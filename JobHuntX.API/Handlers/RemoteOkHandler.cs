using System.Text.Json;
using JobHuntX.API.Models;
using JobHuntX.API.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace JobHuntX.API.Handlers;

public static class RemoteOkHandler {
    public static async Task<IResult> GetRemoteOkJobs([FromQuery] string? key) {
        using var httpClient = new HttpClient();
        using var response = await httpClient.GetAsync("https://remoteok.com/api");

        response.EnsureSuccessStatusCode();
        var jsonString = await response.Content.ReadAsStringAsync();// 絵文字も正しく認識されている
        var json = JsonSerializer.Deserialize<List<RemoteOkJobDto>>(jsonString); // 絵文字が文字化けしている

        if (json == null || json.Count == 0) {
            return Results.Ok(new List<Job>());
        }

        json.RemoveAt(0); // metadata
        var jobs = json.Select(ConvertToJob).ToList();

        jobs = FilterJobsByKey(key, jobs);

        return Results.Ok(jobs);
    }

    private static List<Job> FilterJobsByKey(string? key, List<Job> jobs) {
        if (string.IsNullOrWhiteSpace(key)) {
            return jobs;
        }

        var lowerKey = key.ToLowerInvariant();
        return jobs.Where(job =>
            job.Title.ToLowerInvariant().Contains(lowerKey) ||
            job.Company.ToLowerInvariant().Contains(lowerKey) ||
            (job.Location.Country?.ToLowerInvariant().Contains(lowerKey) ?? false) ||
            (job.Location.City?.ToLowerInvariant().Contains(lowerKey) ?? false) ||
            job.PosterName.ToLowerInvariant().Contains(lowerKey) ||
            job.Tags.Any(tag => tag.ToLowerInvariant().Contains(lowerKey))
        ).ToList();
    }

    private static Job ConvertToJob(RemoteOkJobDto remoteOkJob) {
        return new Job {
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
            Url = new Uri(remoteOkJob.ApplyUrl),
            Tags = remoteOkJob.Tags
        };
    }

    private static string RemoveNonAscii(string input) {
        if (string.IsNullOrEmpty(input))
            return input;
        return new string(input.Where(c => c <= 127).ToArray());
    }
}
