using JobHuntX.API.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen();

// Add CORS policy
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
if (allowedOrigins == null || !allowedOrigins.Any())
{
    throw new InvalidOperationException("AllowedOrigins is not configured.");
}

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// 開発環境なら Swagger を使う
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors();

// Program.csの読み込みタイミングではdocker-compose.ymlで指定した環境変数を取得できない。
// docker-compose.ymlでdotnet watch runではく、dotnet runを実行する必要があるが、
// その場合、開発効率が落ちるのでここでは直接http://+:5000を指定する。
var urls = "http://+:5000"; // var urls = Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? "http://+:5000";
app.Urls.Add(urls);

var sampleJobs = new List<Job>
{
    new Job
    {
        Id = Guid.NewGuid(),
        Website = new Uri("https://example.com"),
        Title = "React Developer",
        Company = "TechCorp",
        Location = new List<Location>
        {
            new Location { Type = "Remote" },
            new Location { City = "Sydney", Country = "Australia" }
        },
        Language = "en",
        Description = "We are looking for a React developer...",
        Name = "Hoge Corporation",
        PostedDate = DateTime.Now.AddDays(-10),
        Url = new Uri("https://example.com/job/12345")
    },
    new Job { Id = Guid.NewGuid(), Website = new Uri("https://example2.com"), Title = "Backend Engineer", Company = "CodeBase Inc.", Location = new List<Location> { new Location { Type = "On-site", City = "Tokyo", Country = "Japan" } }, Language = "ja", Description = "Join our backend team to build scalable APIs...", Name = "CodeBase Inc.", PostedDate = DateTime.Now.AddDays(-5), Url = new Uri("https://example2.com/job/67890") },
    new Job { Id = Guid.NewGuid(), Website = new Uri("https://example3.com"), Title = "Full Stack Developer", Company = "DevWorks", Location = new List<Location> { new Location { Type = "Remote" } }, Language = "en", Description = "Looking for a full stack developer with React and Node.js experience...", Name = "DevWorks", PostedDate = DateTime.Now.AddDays(-15), Url = new Uri("https://example3.com/job/11223") },
    new Job { Id = Guid.NewGuid(), Website = new Uri("https://example4.com"), Title = "Data Scientist", Company = "DataCorp", Location = new List<Location> { new Location { Type = "On-site", City = "New York", Country = "USA" } }, Language = "en", Description = "We are hiring a data scientist to analyze large datasets...", Name = "DataCorp", PostedDate = DateTime.Now.AddDays(-20), Url = new Uri("https://example4.com/job/44556") },
    new Job { Id = Guid.NewGuid(), Website = new Uri("https://example4.com"), Title = "Data Scientist", Company = "DataCorp", Location = new List<Location> { new Location { Type = "On-site", City = "New York", Country = "USA" } }, Language = "en", Description = "We are hiring a data scientist to analyze large datasets...", Name = "DataCorp", PostedDate = DateTime.Now.AddDays(-20), Url = new Uri("https://example4.com/job/44556") }
    // ...add more jobs as needed...
};

app.MapGet("/api/jobs", () =>
{
    return Results.Ok(sampleJobs);
})
    .Produces<List<Job>>(StatusCodes.Status200OK) // Add Produces hint
    .WithOpenApi(); // 明示的にOpenAPI定義へ

app.MapGet("/", () => "Welcome to JobHuntX.API!")
    .Produces<string>(StatusCodes.Status200OK) // Add Produces hint
    .WithOpenApi(); // 明示的にOpenAPI定義へ

app.Run();
