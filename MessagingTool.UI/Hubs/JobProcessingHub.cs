using Microsoft.AspNetCore.SignalR;

namespace MessagingTool.UI.Hubs;


public interface IJobProcessingHub
{
    [HubMethodName("finishedSending")]
    Task FinishedSending(bool result, int numberOfTextsSent);
    [HubMethodName("errorSending")]
    Task ErrorSending(string errorMessage);
}


public class JobProcessingHub : Hub<IJobProcessingHub>
{
    
}