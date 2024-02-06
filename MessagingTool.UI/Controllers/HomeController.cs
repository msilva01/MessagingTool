using MediatR;
using MessagingTool.UI.Features;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace MessagingTool.UI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowCORS")]
    public class HomeController(IMediator mediator, ILogger<HomeController> logger) : ControllerBase
    {
        [HttpPost("[action]")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> Upload([FromForm] UploadCommand request, CancellationToken cancellationToken)
        {
            var response = await mediator.Send(request, cancellationToken);
            return Ok(response);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Get(int rowsPerPage, int pageNumber, int language, bool doNotCall,
            string? sortBy, string? sortOrder,
            string? field, string? filterOperator, string? value, CancellationToken cancellationToken)
        {

            var response = await mediator.Send(new ReadQuery()
            {
                RowsPerPage = rowsPerPage,
                PageNumber = pageNumber,
                SortBy = sortBy,
                SortOrder = sortOrder,
                Field = field,
                FilterOperator = filterOperator,
                Value = value,
                Language = language,
                DoNotCall = doNotCall
            },
                cancellationToken);


            return Ok(response);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Post(SendMessageCommand command, CancellationToken cancellationToken)
        {
            logger.LogInformation($"Sending Messages send to all {command.SendToAll} - {command.phoneNumberIds.Length}");
            var result = await mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateDoNotCall(DoNotCallCommand command, CancellationToken cancellationToken)
        {
            await mediator.Send(command, cancellationToken);
            return Ok();
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> Delete(CancellationToken cancellationToken)
        {
            await mediator.Send(new DeleteCommand(), cancellationToken);
            return Ok();
        }
    }
}
