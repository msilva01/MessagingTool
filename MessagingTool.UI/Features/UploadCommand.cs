using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using CsvHelper.Configuration.Attributes;
using EFCore.BulkExtensions;
using MediatR;
using MessagingTool.Repository.Context;
using MessagingTool.Repository.Entities;
using MessagingTool.UI.Utils;

namespace MessagingTool.UI.Features;

public class UploadCommand : IRequest<FileUploadResult>
{
    public int Language { get; set; }
    public IFormFile File { get; set; }
}

public class CustomerPhoneNumbersDto
{
    [Index(0)]
    public string PhoneNumber { get; set; }
}
public class FileUploadResult
{
    public int NumberOfRecordsCreated { get; set; }
}

public class UploadCommandHandler(MessagingToolDbContext context) : IRequestHandler<UploadCommand, FileUploadResult>
{

    /*public async Task<FileUploadDto> Handle(UploadCommand request, CancellationToken cancellationToken)
    {
        using var ms = new MemoryStream();
        await request.File.CopyToAsync(ms, cancellationToken);
        ms.Position = 0;
        ExcelHelper.Import(ms);

        return new FileUploadDto();
    }*/
    public async Task<FileUploadResult> Handle(UploadCommand request, CancellationToken cancellationToken)
    {
        var result = new FileUploadResult();
        var bulkConfig = new BulkConfig() { UpdateByProperties = [nameof(CustomerPhoneNumber.PhoneNumber)] };
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = false,
        };
        using var reader = new StreamReader(request.File.OpenReadStream());
        using var csvR = new CsvReader(reader, config);
        var records = csvR.GetRecords<CustomerPhoneNumbersDto>().DistinctBy(x => x.PhoneNumber).Select(s =>
                new CustomerPhoneNumber()
                    { PhoneNumber = s.PhoneNumber, DateCreated = DateTime.Now, Active = true, DoNotCall = false, Language = request.Language})
            .ToArray();
        await using (var transaction = await context.Database.BeginTransactionAsync(cancellationToken))
        {
            await context.BulkInsertOrUpdateAsync(records, bulkConfig, cancellationToken: cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }

        result.NumberOfRecordsCreated = records.Length;

        return result;
    }
}
    
