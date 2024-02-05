using ElmahCore.Mvc;
using ElmahCore.Sql;
using MessagingTool.Repository.Context;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowCORS",
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        });
});
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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
app.UseHttpsRedirection();
app.UseSwagger();
app.UseSwaggerUI();
app.UseStaticFiles();
app.UseRouting();

app.UseCors(x => x
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());


//app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseElmah();
app.Run();


namespace MessagingTool.UI
{
    public partial class Program { }
}