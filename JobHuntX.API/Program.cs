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

// Swagger
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
        Location = new Location { Type = "Remote", City = null, Country = null },
        Language = "en",
        Description = "We are looking for a skilled React developer to join our dynamic team. " +
                      "In this role, you will be responsible for building and maintaining user-facing features " +
                      "using React.js and related technologies. You will collaborate closely with designers, " +
                      "backend developers, and product managers to deliver high-quality, scalable, and maintainable " +
                      "web applications. Key responsibilities include writing clean and efficient code, " +
                      "optimizing components for maximum performance, and staying up-to-date with the latest " +
                      "industry trends and best practices. The ideal candidate has a strong understanding of " +
                      "JavaScript, modern frontend frameworks, and experience with state management libraries " +
                      "such as Redux or Context API. Familiarity with TypeScript, testing frameworks, and CI/CD " +
                      "pipelines is a plus. Join us to work on exciting projects and make a meaningful impact!",
        PosterName = "John Doe", // Updated property name and value
        PostedDate = DateTime.Now.AddDays(-10),
        Url = new Uri("https://example.com/job/12345")
    },
    new Job
    {
        Id = Guid.NewGuid(),
        Website = new Uri("https://example2.com"),
        Title = "Backend Engineer",
        Company = "CodeBase Inc.",
        Location = new Location { Type = "On-site", City = "Tokyo", Country = "Japan" },
        Language = "ja",
        Description = "Join our backend team to build scalable APIs...",
        PosterName = "Jane Smith", // Updated property name and value
        PostedDate = DateTime.Now.AddDays(-5),
        Url = new Uri("https://example2.com/job/67890")
    },
    new Job
    {
        Id = Guid.NewGuid(),
        Website = new Uri("https://example3.com"),
        Title = "Full Stack Developer",
        Company = "DevWorks",
        Location = new Location { Type = "Remote", City = "San Francisco", Country = "USA" },
        Language = "en",
        Description = "Looking for a full stack developer with React and Node.js experience...",
        PosterName = "Alice Johnson", // Updated property name and value
        PostedDate = DateTime.Now.AddDays(-15),
        Url = new Uri("https://example3.com/job/11223")
    },
    new Job
    {
        Id = Guid.NewGuid(),
        Website = new Uri("https://example4.com"),
        Title = "Data Scientist",
        Company = "DataCorp",
        Location = new Location { Type = "On-site", City = "New York", Country = "USA" },
        Language = "en",
        Description = "We are hiring a data scientist to analyze large datasets...",
        PosterName = "Michael Brown", // Updated property name and value
        PostedDate = DateTime.Now.AddDays(-20),
        Url = new Uri("https://example4.com/job/44556")
    }
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
