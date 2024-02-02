using ElmahCore.Mvc;
using ElmahCore.Sql;
using System.Reflection;
using MessagingTool.Repository.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddElmah<SqlErrorLog>(options =>
{
    options.OnPermissionCheck = context => context.User.Identity.IsAuthenticated;
    //options.Path = "elmahUI";
    options.ConnectionString = builder.Configuration["ConnectionStrings:MessagingToolDatabase"];
});
builder.Services.AddDbContext<MessagingToolDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration["ConnectionStrings:MessagingToolDatabase"]);
});
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
builder.Services.AddMemoryCache();
builder.Services.AddAutoMapper(typeof(MessagingTool.UI.Program));
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//app.UseAuthorization();
app.UseCors(builder =>
{
    builder
        .SetIsOriginAllowed(_ => true)
        .SetPreflightMaxAge(TimeSpan.FromMinutes(10))
        .AllowAnyHeader()
        .WithExposedHeaders("Exception")
        .AllowAnyMethod()
        .AllowCredentials();
});
app.MapControllers();
app.UseElmah();

app.Run();


namespace MessagingTool.UI
{
    public partial class Program { }
}