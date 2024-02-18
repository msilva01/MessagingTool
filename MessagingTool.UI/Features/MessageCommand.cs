using EFCore.BulkExtensions;
using Hangfire;
using MediatR;
using MessagingTool.Repository.Context;
using MessagingTool.Repository.Entities;
using MessagingTool.UI.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace MessagingTool.UI.Features;
public class SendMessageCommand : IRequest<bool>
{
    public bool SendToAll { get; set; }
    public string Language { get; set; }
    public string text { get; set; }
    public string[]? phoneNumberIds { get; set; }
}


public class SendMessageCommandHandler(
    IConfiguration config,
    IBackgroundJobClient _backgroundJobClient,
    MessagingToolDbContext context,
    ILogger<SendMessageCommandHandler> logger,
    IHubContext<JobProcessingHub, IJobProcessingHub> hubContext) : IRequestHandler<SendMessageCommand, bool>
{

    public Task<bool> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        _backgroundJobClient.Enqueue(() => SendMessages(request));
        return Task.FromResult(true);
    }
    public async Task SendMessages(SendMessageCommand request)
    {
        logger.LogDebug($"Sending Messages handler {request.SendToAll} {request.phoneNumberIds.Length}");
        var result = true;
        var messagesSentCount = 0;
        try
        {
            var sid = config["ConnectionStrings:Twilio:Sid"];
            var token = config["ConnectionStrings:Twilio:Token"];
            var ameritaxPhoneNumber = config["ConnectionStrings:Twilio:PhoneNumber"];

            TwilioClient.Init(sid, token);


            if (!request.SendToAll)
            {
                var customerPhoneNumbers =
                    request.phoneNumberIds.Select(s => new CustomerPhoneNumber() { Id = int.Parse(s) }).ToArray();

                await using var trans = await context.Database.BeginTransactionAsync();
                BulkConfig bulkConfig = new()
                {
                    UpdateByProperties = [nameof(CustomerPhoneNumber.Id)],
                    UseTempDB = true
                };
                await context.BulkReadAsync(customerPhoneNumbers, bulkConfig);
                await trans.CommitAsync();

                foreach (var cp in customerPhoneNumbers)
                {
                    var resultSend = await SendMessageAsync(request.text, cp.PhoneNumber, cp.Id, ameritaxPhoneNumber, logger);
                    result = result && resultSend;
                    messagesSentCount++;
                }

                var messageLogs = request.phoneNumberIds.Select(s => new CustomerMessageLog()
                { CustomerPhoneNumberId = Int32.Parse(s), MessageSentOn = DateTime.Now }).ToList();
                await CreateMessageLogAsync(messageLogs);
            }
            else
            {
                var query = context.Set<CustomerPhoneNumber>()
                    .AsNoTracking()
                    .Where(x => x.Language == int.Parse(request.Language) && x.DoNotCall == false && x.Active == true)
                    .Select(s => new { PhoneNumber = s.PhoneNumber, Id = s.Id });

                var totalCount = await query.CountAsync();
                var currentCount = 0;
                while (currentCount < totalCount)
                {
                    var phoneNumbers = await query.Skip(currentCount).Take(1000).ToArrayAsync();
                    foreach (var cp in phoneNumbers)
                    {
                        var msgSendingResult = await SendMessageAsync(request.text, cp.PhoneNumber, cp.Id, ameritaxPhoneNumber, logger);
                        result = result && msgSendingResult;
                        messagesSentCount++;
                    }

                    var messageLogs = phoneNumbers.Select(s => new CustomerMessageLog()
                    { CustomerPhoneNumberId = s.Id, MessageSentOn = DateTime.Now }).ToList();
                    await CreateMessageLogAsync(messageLogs);

                    currentCount += 1000;
                }
            }
        }
        catch (Exception ex)
        {
            hubContext.Clients.All.ErrorSending(ex.Message);
        }

        hubContext.Clients.All.FinishedSending(result, messagesSentCount);
    }

    private async Task CreateMessageLogAsync(IList<CustomerMessageLog> messageLogs)
    {
        BulkConfig bulkMessageLogConfig = new()
        {
            UpdateByProperties = [nameof(CustomerMessageLog.CustomerPhoneNumberId)],
            UseTempDB = true
        };

        await context.BulkInsertAsync(messageLogs, bulkMessageLogConfig);
    }
    //******secrets storage
    //https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-8.0&tabs=linux
    private async Task<bool> SendMessageAsync(string text, string phoneNumber, int id, string ameritaxPhoneNumber, ILogger<SendMessageCommandHandler> logger)
    {
        var result = true;
        try
        {
            Thread.Sleep(500); //give twilio  a little time between requests
            await MessageResource.CreateAsync(body: text, from: new PhoneNumber(ameritaxPhoneNumber),
                to: new PhoneNumber(phoneNumber));
        }
        catch (Exception ex)
        {
            if (ex.Message == "Attempt to send to unsubscribed recipient")
            {
                result = await MoveToDoNotCallAsync(id);

            }
            else
            {
                logger.LogError($"Error sending message {phoneNumber} {ex.Message}", ex);
                result = await MoveToDoNotCallAsync(id);
            }

        }

        return result;

    }

    private async Task<bool> MoveToDoNotCallAsync(int id)
    {
        var result = false;
        var customerPhone = await context
            .FindAsync<CustomerPhoneNumber>(id);
        if (customerPhone == null)
        {
            throw new KeyNotFoundException($"Invalid Id {id}");
        }
        customerPhone.DoNotCall = true;
        await context.SaveChangesAsync();
        return result;
    }
}