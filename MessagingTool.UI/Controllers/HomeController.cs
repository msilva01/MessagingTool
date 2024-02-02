using MediatR;
using MessagingTool.UI.Features;
using Microsoft.AspNetCore.Mvc;

namespace MessagingTool.UI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController(IMediator mediator) : ControllerBase
    {
        [HttpPost("[action]")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> Upload([FromForm] UploadCommand request, CancellationToken cancellationToken)
        {
            var response = await mediator.Send(request, cancellationToken);
            return Ok(response);
        }
        [HttpGet("[action]")]
        public async Task<IActionResult> Get(int rowsPerPage, int pageNumber, string? sortBy, string? sortOrder,
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
                    Value = value
                },
                cancellationToken);


            return Ok(response);
        }
    }
}
