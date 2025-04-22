using System.Text.Json;
using JobHuntX.API.Models;

namespace JobHuntX.API.Handlers;

public static class RemoteOkHandler {
    public static async Task<IResult> GetRemoteOkJobs() {
        using var httpClient = new HttpClient();
        using var response = await httpClient.GetAsync("https://remoteok.com/api");

        response.EnsureSuccessStatusCode();
        var jsonString = await response.Content.ReadAsStringAsync();// 絵文字も正しく認識されている
        var json = JsonSerializer.Deserialize<List<RemoteOkJobDto>>(jsonString); // 絵文字が文字化けしている

        if (json == null || json.Count == 0) {
            return Results.Ok(new List<Job>());
        }

        json.RemoveAt(0); // metadata

        var jobs = json.Select(remoteOkJob => new Job {
            Id = Guid.NewGuid(),
            Website = new Uri("https://remoteok.com"),
            Title = remoteOkJob.Position,
            Company = remoteOkJob.Company,
            Location = new Location { Type = "Remote" },
            Language = string.Empty,
            Description = RemoveNonAscii(remoteOkJob.Description),
            Salary = (remoteOkJob.SalaryMax == 0 || remoteOkJob.SalaryMin == 0) ? null : new Salary {
                CurrencyCode = "USD",
                Min = remoteOkJob.SalaryMin,
                Max = remoteOkJob.SalaryMax,
                TimeUnit = SalaryTimeUnit.Year
            },
            PosterName = string.Empty,
            PostedDate = DateTime.TryParse(remoteOkJob.Date, out var parsedDate) ? parsedDate : DateTime.UtcNow,
            Url = new Uri(remoteOkJob.ApplyUrl)
        }).ToList();

        return Results.Ok(jobs);
    }

    private static Salary? ParseSalary(string? salaryString) {
        if (string.IsNullOrEmpty(salaryString)) return null;

        // Example: "$80,000 - $120,000 USD/year"
        var parts = salaryString.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 4) return null;

        try {
            var minMax = parts[0].Replace("$", "").Split('-');
            var min = decimal.Parse(minMax[0].Replace(",", ""));
            var max = decimal.Parse(minMax[1].Replace(",", ""));
            var currency = parts[2];
            var timeUnit = parts[3].ToLower() switch {
                "year" => SalaryTimeUnit.Year,
                "month" => SalaryTimeUnit.Month,
                "week" => SalaryTimeUnit.Week,
                "day" => SalaryTimeUnit.Day,
                "hour" => SalaryTimeUnit.Hour,
                _ => SalaryTimeUnit.Year
            };

            return new Salary {
                CurrencyCode = currency,
                Min = min,
                Max = max,
                TimeUnit = timeUnit
            };
        } catch {
            return null;
        }
    }

    public static string RemoveNonAscii(string input) {
        if (string.IsNullOrEmpty(input))
            return input;
        return new string(input.Where(c => c <= 127).ToArray());
    }
}
