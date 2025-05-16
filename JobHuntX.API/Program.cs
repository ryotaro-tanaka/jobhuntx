using JobHuntX.API.Extensions;
using JobHuntX.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.ConfigureCors(builder.Configuration);

var app = builder.Build();

// Swagger
app.UseSwaggerWithUI();

app.UseHttpsRedirection();

// Enable CORS
app.UseCors();

// middleware
app.UseMiddleware<ApiKeyMiddleware>();

// react rooting
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

// Program.csの読み込みタイミングではdocker-compose.ymlで指定した環境変数を取得できない。
// docker-compose.ymlでdotnet watch runではく、dotnet runを実行する必要があるが、
// その場合、開発効率が落ちるのでここでは直接http://+:5000を指定する。
var urls = "http://+:5000"; // var urls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? "http://+:5000";
app.Urls.Add(urls);

// Map endpoints
app.MapEndpoints();

app.Run();
