var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// var logger = app.Logger;
// logger.LogInformation("hoge");
// logger.LogInformation($"ASPNETCORE_URLS: {Environment.GetEnvironmentVariable("ASPNETCORE_URLS")}");

// Program.csの読み込みタイミングではdocker-compose.ymlで指定した環境変数を取得できない。
// docker-compose.ymlでdotnet watch runではく、dotnet runを実行する必要があるが、
// その場合、開発効率が落ちるのでここでは直接http://+:5000を指定する。
var urls = "http://+:5000"; // var urls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? "http://+:5000";
app.Urls.Add(urls);

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
