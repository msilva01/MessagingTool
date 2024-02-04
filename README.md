# MessagingTool

Error when publishing because of typescript add this to .csproj
    <TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>
    <TypeScriptToolsVersion>Latest</TypeScriptToolsVersion>



dotnet ef database update --project MessagingTool.Repository --startup-project MessagingTool.UI

dotnet ef migrations add InitialCreate --project MessagingTool.Repository --startup-project MessagingTool.UI


--REVERT
dotnet ef database update 0 --project MessagingTool.Repository --startup-project MessagingTool.UI  
dotnet ef migrations remove --project MessagingTool.Repository --startup-project MessagingTool.UI
dotnet ef migrations script 0 --project MessagingTool.Repository --startup-project MessagingTool.UI  
dotnet ef migrations script InitialCreate --project MessagingTool.Repository --startup-project MessagingTool.UI  
