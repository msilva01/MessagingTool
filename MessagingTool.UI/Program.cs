using ElmahCore.Mvc;
using ElmahCore.Sql;
using MessagingTool.Repository.Context;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using MessagingTool.UI;
using MessagingTool.UI.Hubs;
using NLog;
using NLog.Web;
using Hangfire;
using Hangfire.MemoryStorage;

var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("init main");
try
{

    var builder = WebApplication.CreateBuilder(args);
    builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: "AllowCORS",
            policy => { policy.SetIsOriginAllowed(x => true).AllowAnyMethod().AllowAnyHeader().AllowCredentials(); });
    });

    builder.Logging.ClearProviders();
    builder.Host.UseNLog();

    builder.Services.AddControllers();
    builder.Services.AddSignalR();
    builder.Services.AddSwaggerGen();
    builder.Services.AddHangfire(x => x.UseMemoryStorage());

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
    builder.Services.AddHangfireServer();
    builder.Services.AddAutoMapper(typeof(MessagingTool.UI.Program));

    var app = builder.Build();

// Configure the HTTP request pipeline.
    app.UseHttpsRedirection();
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseStaticFiles();
    app.UseRouting();
    app.UseCors(x => x
        .AllowAnyMethod()
        .AllowAnyHeader()
        .SetIsOriginAllowed(origin => true) // allow any origin
        .AllowCredentials()); // allow credentials

//app.UseAuthentication();
    app.UseAuthorization();

    app.UseMiddleware<ErrorHandlerMiddleware>();
    app.UseHangfireDashboard();
    app.MapControllers();
    app.UseElmah();
    app.MapHub<JobProcessingHub>("/hub");
    app.Run();
}
catch (Exception ex)
{
    logger.Error(ex);
}
finally
{
    NLog.LogManager.Shutdown();
}

namespace MessagingTool.UI
{
    public partial class Program { }
}