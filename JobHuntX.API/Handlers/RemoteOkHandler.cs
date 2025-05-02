using System.Text.Json;
using JobHuntX.API.Models;
using JobHuntX.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using JobHuntX.API.Utilities;

namespace JobHuntX.API.Handlers;

public class RemoteOkHandler : HandlerBase {
    protected override string CacheKey => nameof(RemoteOkHandler);
    private const string BaseUrl = "https://remoteok.com";
    private const string ApiUrl = $"{BaseUrl}/api";

    protected override async Task<List<Job>> FetchJobsAsync() {
        using var httpClient = new HttpClient();
        using var response = await httpClient.GetAsync(ApiUrl);

        response.EnsureSuccessStatusCode();
        var jsonString = await response.Content.ReadAsStringAsync();// 絵文字も正しく認識されている
        var json = JsonSerializer.Deserialize<List<RemoteOkJobDto>>(jsonString); // 絵文字が文字化けしている

        if (json == null || json.Count == 0) {
            return new List<Job>();
        }

        json.RemoveAt(0); // metadata
        return json.Select(ConvertToJob).ToList();
    }

    public static async Task<IResult> GetRemoteOkJobs([FromQuery] string? key) {
        using var httpClient = new HttpClient();
        using var response = await httpClient.GetAsync(ApiUrl);

        response.EnsureSuccessStatusCode();
        var jsonString = await response.Content.ReadAsStringAsync();// 絵文字も正しく認識されている
        var json = JsonSerializer.Deserialize<List<RemoteOkJobDto>>(jsonString); // 絵文字が文字化けしている

        if (json == null || json.Count == 0) {
            return Results.Ok(new List<Job>());
        }

        json.RemoveAt(0); // metadata
        var jobs = json.Select(ConvertToJob).ToList();
        jobs = JobFilterHelper.FilterJobsByKey(key, jobs);

        return Results.Ok(jobs);
    }

    private static Job ConvertToJob(RemoteOkJobDto remoteOkJob) {
        var description = RemoveNonAscii(remoteOkJob.Description);

        var tags = remoteOkJob.Tags;
        tags.AddRange(TagGenerator.ExtractTags(description));

        return new Job {
            Id = Guid.NewGuid(),
            Website = new Uri(BaseUrl),
            Title = remoteOkJob.Position,
            Company = remoteOkJob.Company,
            Location = new Location { Type = LocationType.Remote },
            Language = string.Empty,
            Description = description,
            Salary = (remoteOkJob.SalaryMax == 0 || remoteOkJob.SalaryMin == 0) ? null : new Salary {
                CurrencyCode = "USD",
                Min = remoteOkJob.SalaryMin,
                Max = remoteOkJob.SalaryMax,
                TimeUnit = SalaryTimeUnit.Year
            },
            PosterName = null,
            PostedDate = DateTime.TryParse(remoteOkJob.Date, out var parsedDate) ? parsedDate : DateTime.UtcNow,
            Url = new Uri(remoteOkJob.ApplyUrl),
            Tags = tags,
        };
    }

    private static string RemoveNonAscii(string input) {
        return new string(input.Where(c => c <= 127).ToArray());
    }
}
