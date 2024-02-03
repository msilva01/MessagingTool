using AutoMapper;
using MediatR;
using MessagingTool.Repository.Context;
using MessagingTool.Repository.Entities;
using Microsoft.EntityFrameworkCore;

namespace MessagingTool.UI.Features;

public class ReadQuery : IRequest<PhoneNumberWrapper>
{
    public string? SortBy { get; set; }
    public string? SortOrder { get; set; }
    public int? RowsPerPage { get; set; }

    public int? PageNumber { get; set; }

    //Filter Fields
    public string? Field { get; set; }
    public string? FilterOperator { get; set; }
    public string? Value { get; set; }
    public int Language { get; set; }
    public bool DoNotCall { get; set; }
}

public class PhoneNumberWrapper
{
    public int TotalNumberOfResults { get; set; }
    public int TotalNumberOfRecords { get; set; }
    public int PageNumber { get; set; }
    public int RowsPerPage { get; set; }
    public PhoneNumbersDto[] Items { get; set; }
}
public class PhoneNumberSelected
{
    public int Id { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime? MessageSentOn { get; set; }
}

public class PhoneNumbersDto
{
    public int Id { get; set; }
    public string PhoneNumber { get; set; }
    public string MessageSentOn { get; set; }
}
public class ReadQUeryHandler(MessagingToolDbContext context, IMapper mapper) : IRequestHandler<ReadQuery, PhoneNumberWrapper>
{
    public async Task<PhoneNumberWrapper> Handle(ReadQuery request, CancellationToken cancellationToken)
    {
        var query = context.Set<CustomerPhoneNumber>()
            .AsNoTracking()
            .Where(x => x.Language == request.Language && x.DoNotCall == request.DoNotCall && x.Active == true)
            .Select(s => new PhoneNumberSelected()
            {
                Id = s.Id,
                PhoneNumber = s.PhoneNumber,
                MessageSentOn = s.CustomerMessageLogs
                    .OrderByDescending(o => o.MessageSentOn)
                    .Select(s => s.MessageSentOn)
                    .FirstOrDefault()
            });

        var pageSize = request.RowsPerPage ?? 10;
        var pageNumber = request.PageNumber ?? 0;
        var firstPage = pageNumber * pageSize;
        
        var totalCount = await query.CountAsync(cancellationToken);
        query = query
            .OrderByDescending(o => o.MessageSentOn)
            .ThenBy(o => o.Id);
        var queryResult = await query.Skip(firstPage).Take(pageSize).ToListAsync(cancellationToken);

        var result = new PhoneNumberWrapper()
        {
            TotalNumberOfRecords = totalCount,
            TotalNumberOfResults = queryResult.Count(),
            Items = mapper.Map<PhoneNumbersDto[]>( queryResult),
            PageNumber = pageNumber,
            RowsPerPage = pageSize,
        };

        return result;
    }
}
