﻿using EFCore.BulkExtensions;
using MediatR;
using MessagingTool.Repository.Context;
using MessagingTool.Repository.Entities;
using Microsoft.EntityFrameworkCore;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace MessagingTool.UI.Features;
public class SendMessageCommand : IRequest
{
    public bool SendToAll { get; set; }
    public string Language { get; set; }
    public string text { get; set; }
    public string[]? phoneNumberIds{ get; set; }
}


public class SendMessageCommandHandler(IConfiguration config,MessagingToolDbContext context) : IRequestHandler<SendMessageCommand>
{
    public async Task Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {

        if (!request.SendToAll)
        {
            var customerPhoneNumbers =
                request.phoneNumberIds.Select(s => new CustomerPhoneNumber() { Id = int.Parse(s) }).ToArray();

            await using var trans = await context.Database.BeginTransactionAsync(cancellationToken);
            BulkConfig bulkConfig = new()
            {
                UpdateByProperties = [nameof(CustomerPhoneNumber.Id)],
                UseTempDB = true
            };
            await context.BulkReadAsync(customerPhoneNumbers, bulkConfig, cancellationToken: cancellationToken);
            await trans.CommitAsync(cancellationToken);

            foreach (var cp in customerPhoneNumbers)
            {
                await SendMessageAsync(request.text, cp.PhoneNumber);
            }

            var messageLogs = request.phoneNumberIds.Select(s => new CustomerMessageLog()
                { CustomerPhoneNumberId = Int32.Parse(s), MessageSentOn = DateTime.Now }).ToList();
            await CreateMessageLogAsync(messageLogs, cancellationToken);
        }
        else
        {
            var query = context.Set<CustomerPhoneNumber>()
                .AsNoTracking()
                .Where(x => x.Language == int.Parse(request.Language) && x.DoNotCall == false && x.Active == true)
                .Select(s =>  new {PhoneNumber = s.PhoneNumber, Id = s.Id});

            var totalCount = await query.CountAsync(cancellationToken);
            var currentCount = 0;
            while (currentCount < totalCount)
            {
                var phoneNumbers = await query.Skip(currentCount).Take(1000).ToArrayAsync(cancellationToken);
                foreach (var cp in phoneNumbers)
                {
                    await SendMessageAsync(request.text, cp.PhoneNumber);
                }

                var messageLogs = phoneNumbers.Select(s => new CustomerMessageLog()
                    { CustomerPhoneNumberId = s.Id, MessageSentOn = DateTime.Now }).ToList();
                await CreateMessageLogAsync(messageLogs, cancellationToken);

                currentCount += 1000;
            }
        }
        
    }

    private async Task CreateMessageLogAsync(IList<CustomerMessageLog> messageLogs, CancellationToken cancellationToken)
    {
        BulkConfig bulkMessageLogConfig = new()
        {
            UpdateByProperties = [nameof(CustomerMessageLog.CustomerPhoneNumberId)],
            UseTempDB = true
        };

        await context.BulkInsertAsync(messageLogs, bulkMessageLogConfig, cancellationToken: cancellationToken);
    }
//******secrets storage
//https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-8.0&tabs=linux
    private async Task SendMessageAsync(string text, string phoneNumber)
    {
        var sid = config["ConnectionStrings:Twilio:Sid"];
        var token = config["ConnectionStrings:Twilio:Token"];
        var ameritaxPhoneNumber = config["ConnectionStrings:Twilio:PhoneNumber"];
        
        //TwilioClient.Init(sid, token);

        // await MessageResource.CreateAsync(body: text, from: new PhoneNumber(ameritaxPhoneNumber),
        //     to: new PhoneNumber(phoneNumber));
    }
}