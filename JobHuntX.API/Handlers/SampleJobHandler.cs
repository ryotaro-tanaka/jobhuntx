using JobHuntX.API.Models;

namespace JobHuntX.API.Handlers;

public static class SampleJobHandler {
    public static IResult GetSampleJobs() {
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
                Description = "We are looking for a skilled React developer.", // 10 words
                Salary = new Salary
                {
                    CurrencyCode = "AUD",
                    Min = 80000,
                    Max = 120000,
                    TimeUnit = SalaryTimeUnit.Year
                },
                PosterName = "John Doe",
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
                Description = string.Join(" ", Enumerable.Repeat("Join our backend team to build scalable APIs.", 20)), // 100 words
                Salary = new Salary
                {
                    CurrencyCode = "JPY",
                    Min = 6000000,
                    Max = 9000000,
                    TimeUnit = SalaryTimeUnit.Year
                },
                PosterName = "Jane Smith",
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
                Description = string.Join(" ", Enumerable.Repeat("Looking for a full stack developer.", 10)), // 10 words
                Salary = new Salary
                {
                    CurrencyCode = "USD",
                    Min = 90000,
                    Max = 130000,
                    TimeUnit = SalaryTimeUnit.Year
                },
                PosterName = "Alice Johnson",
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
                Description = string.Join(" ", Enumerable.Repeat("We are hiring a data scientist to analyze datasets.", 20)), // 100 words
                Salary = new Salary
                {
                    CurrencyCode = "USD",
                    Min = 100000,
                    Max = 150000,
                    TimeUnit = SalaryTimeUnit.Year
                },
                PosterName = "Michael Brown",
                PostedDate = DateTime.Now.AddDays(-20),
                Url = new Uri("https://example4.com/job/44556")
            },
            new Job
            {
                Id = Guid.NewGuid(),
                Website = new Uri("https://example5.com"),
                Title = "Mobile App Developer",
                Company = "Appify",
                Location = new Location { Type = "Remote", City = null, Country = null },
                Language = "en",
                Description = "Develop cutting-edge mobile applications for iOS and Android.", // 10 words
                Salary = new Salary
                {
                    CurrencyCode = "USD",
                    Min = 85000,
                    Max = 120000,
                    TimeUnit = SalaryTimeUnit.Year
                },
                PosterName = "Chris Evans",
                PostedDate = DateTime.Now.AddDays(-25),
                Url = new Uri("https://example5.com/job/55678")
            },
            new Job
            {
                Id = Guid.NewGuid(),
                Website = new Uri("https://example6.com"),
                Title = "DevOps Engineer",
                Company = "CloudOps",
                Location = new Location { Type = "On-site", City = "London", Country = "UK" },
                Language = "en",
                Description = string.Join(" ", Enumerable.Repeat("Implement and maintain CI/CD pipelines.", 20)), // 100 words
                Salary = new Salary
                {
                    CurrencyCode = "GBP",
                    Min = 70000,
                    Max = 100000,
                    TimeUnit = SalaryTimeUnit.Year
                },
                PosterName = "Emma Watson",
                PostedDate = DateTime.Now.AddDays(-30),
                Url = new Uri("https://example6.com/job/66789")
            },
            new Job
            {
                Id = Guid.NewGuid(),
                Website = new Uri("https://example7.com"),
                Title = "UI/UX Designer",
                Company = "Designify",
                Location = new Location { Type = "Remote", City = null, Country = null },
                Language = "en",
                Description = "Create intuitive and visually appealing user interfaces.", // 10 words
                Salary = new Salary
                {
                    CurrencyCode = "USD",
                    Min = 70000,
                    Max = 100000,
                    TimeUnit = SalaryTimeUnit.Year
                },
                PosterName = "Sophia Lee",
                PostedDate = DateTime.Now.AddDays(-35),
                Url = new Uri("https://example7.com/job/77890")
            },
            new Job
            {
                Id = Guid.NewGuid(),
                Website = new Uri("https://example8.com"),
                Title = "Machine Learning Engineer",
                Company = "AI Labs",
                Location = new Location { Type = "On-site", City = "Berlin", Country = "Germany" },
                Language = "en",
                Description = string.Join(" ", Enumerable.Repeat("Develop and optimize machine learning models.", 20)), // 100 words
                Salary = new Salary
                {
                    CurrencyCode = "EUR",
                    Min = 80000,
                    Max = 120000,
                    TimeUnit = SalaryTimeUnit.Year
                },
                PosterName = "Liam Brown",
                PostedDate = DateTime.Now.AddDays(-40),
                Url = new Uri("https://example8.com/job/88901")
            },
            new Job
            {
                Id = Guid.NewGuid(),
                Website = new Uri("https://example9.com"),
                Title = "Cloud Architect",
                Company = "Cloudify",
                Location = new Location { Type = "Remote", City = null, Country = null },
                Language = "en",
                Description = "Design scalable cloud infrastructure solutions.", // 10 words
                Salary = new Salary
                {
                    CurrencyCode = "USD",
                    Min = 100000,
                    Max = 150000,
                    TimeUnit = SalaryTimeUnit.Year
                },
                PosterName = "Olivia Green",
                PostedDate = DateTime.Now.AddDays(-45),
                Url = new Uri("https://example9.com/job/99012")
            },
            new Job
            {
                Id = Guid.NewGuid(),
                Website = new Uri("https://example10.com"),
                Title = "Cybersecurity Analyst",
                Company = "SecureTech",
                Location = new Location { Type = "On-site", City = "Sydney", Country = "Australia" },
                Language = "en",
                Description = string.Join(" ", Enumerable.Repeat("Monitor and protect systems from cyber threats.", 20)), // 100 words
                Salary = new Salary
                {
                    CurrencyCode = "AUD",
                    Min = 90000,
                    Max = 130000,
                    TimeUnit = SalaryTimeUnit.Year
                },
                PosterName = "Noah Wilson",
                PostedDate = DateTime.Now.AddDays(-50),
                Url = new Uri("https://example10.com/job/10123")
            }
        };
        return Results.Ok(sampleJobs); // Return Results.Ok directly
    }
}
