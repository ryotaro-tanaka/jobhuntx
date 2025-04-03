var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// var logger = app.Logger;
// logger.LogInformation("hoge");
// logger.LogInformation($"ASPNETCORE_URLS: {Environment.GetEnvironmentVariable("ASPNETCORE_URLS")}");

// Program.csの読み込みタイミングではdocker-compose.ymlで指定した環境変数を取得できない。
// docker-compose.ymlでdotnet watch runではく、dotnet runを実行する必要があるが、
// その場合、開発効率が落ちるのでここでは直接http://+:5000を指定する。
var urls = "http://+:5000"; // var urls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? "http://+:5000";
app.Urls.Add(urls);

app.MapGet("/", () => "Hello World!");

app.Run();
