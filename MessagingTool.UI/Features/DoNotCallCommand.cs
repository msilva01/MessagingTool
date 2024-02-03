using EFCore.BulkExtensions;
using MediatR;
using MessagingTool.Repository.Context;
using MessagingTool.Repository.Entities;
using MessagingTool.UI.Utils;
using Microsoft.EntityFrameworkCore;

namespace MessagingTool.UI.Features;

public class DoNotCallCommand :IRequest
{
    public int[] PhoneNumberIds{ get; set; }
    public bool DoNotCall { get; set; }
}

public class DoNotCallCommandHandler(MessagingToolDbContext context) : IRequestHandler<DoNotCallCommand>
{
    public async Task Handle(DoNotCallCommand request, CancellationToken cancellationToken)
    {
        var query = await context.Set<CustomerPhoneNumber>()
                .Where(x => request.PhoneNumberIds.Contains(x.Id))
                .ExecuteUpdateAsync(s => s.SetProperty(n => n.DoNotCall, n => request.DoNotCall),
                    cancellationToken: cancellationToken)
            ;

    }
}
