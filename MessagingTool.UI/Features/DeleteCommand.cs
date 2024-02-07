using MediatR;
using MessagingTool.Repository.Context;
using MessagingTool.Repository.Entities;
using Microsoft.EntityFrameworkCore;

namespace MessagingTool.UI.Features;

public class DeleteCommand : IRequest
{public bool English { get; set; }
    public bool Spanish { get; set; } 
    public bool DoNotCall { get; set; }
}


public class DeleteCommandHandler(MessagingToolDbContext context) : IRequestHandler<DeleteCommand>
{

    public async Task Handle(DeleteCommand request, CancellationToken cancellationToken)
    {
        
        await context.Set<CustomerMessageLog>().ExecuteDeleteAsync( cancellationToken);
        if (request.English)
        {
            await context.Set<CustomerPhoneNumber>().Where(x => x.Language == 1).ExecuteDeleteAsync(cancellationToken);    
        }
        
        if (request.Spanish)
        {
            await context.Set<CustomerPhoneNumber>().Where(x => x.Language == 2).ExecuteDeleteAsync(cancellationToken);    
        }
        
        if (request.DoNotCall)
        {
            await context.Set<CustomerPhoneNumber>().Where(x => x.DoNotCall == true).ExecuteDeleteAsync(cancellationToken);    
        }

    }
}