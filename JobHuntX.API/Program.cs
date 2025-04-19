using JobHuntX.API.Models;
using JobHuntX.API.Extensions;

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

var urls = "http://+:5000";
app.Urls.Add(urls);

// Map endpoints
app.MapEndpoints();

app.Run();
