using MediatR;
using MessagingTool.Repository.Context;
using MessagingTool.Repository.Entities;
using Microsoft.EntityFrameworkCore;

namespace MessagingTool.UI.Features;

public class DeleteCommand : IRequest
{
}


public class DeleteCommandHandler(MessagingToolDbContext context) : IRequestHandler<DeleteCommand>
{

    public async Task Handle(DeleteCommand request, CancellationToken cancellationToken)
    {
        await context.Set<CustomerMessageLog>().ExecuteDeleteAsync(cancellationToken);
        await context.Set<CustomerPhoneNumber>().ExecuteDeleteAsync(cancellationToken);
    }
}