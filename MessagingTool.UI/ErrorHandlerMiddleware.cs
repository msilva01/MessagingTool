namespace MessagingTool.UI;

using System.Net;
using System.Text.Json;
public class ErrorHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlerMiddleware> _loggerFactory;
    public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> loggerFactory)
    {
        _next = next;
        _loggerFactory = loggerFactory;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception error)
        {
            var response = context.Response;
            response.ContentType = "application/json";
            _loggerFactory.LogError(error, "Exception");

            switch (error)
            {
                case AggregateException e:
                    _loggerFactory.LogError(e, "Aggr Exception");
                    e.Handle(ex =>
                    {
                        if (ex is not AppException) return true;
                        _loggerFactory.LogError(e, "Aggr -> App Exception");
                        response.StatusCode = (int)HttpStatusCode.BadRequest;
                        return true;
                    });
                    break;
                case AppException e:
                    // custom application error
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    _loggerFactory.LogError(e, "App Exception");
                    break;
                case KeyNotFoundException e:
                    // not found error
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    break;

                case UnauthorizedAccessException e:
                    response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    break;
                default:
                    // unhandled error
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            var result = JsonSerializer.Serialize(new { message = error?.Message });
            await response.WriteAsync(result);
        }
    }
}
