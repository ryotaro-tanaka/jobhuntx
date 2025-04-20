using System.Text.Json;
using JobHuntX.API.Models;

namespace JobHuntX.API.Handlers;

public static class RemoteOkHandler {
    public static async Task<IResult> GetRemoteOkJobs() {
        using var httpClient = new HttpClient();
        var response = await httpClient.GetFromJsonAsync<List<object>>("https://remoteok.com/api");

        // Early return if response is null
        if (response == null || response.Count == 0) {
            return Results.Ok(new List<Job>());
        }

        response.RemoveAt(0); // Remove the first element with irrelevant data

        var remoteOkJobs =
            response.Select(item => JsonSerializer.Deserialize<RemoteOkJobDto>(item.ToString()!))
                .Where(job => job != null)
                .ToList();

        var jobs = remoteOkJobs.Select(remoteOkJob => new Job {
            Id = Guid.NewGuid(), // Generate a new GUID
            Website = new Uri("https://remoteok.com"), // Default website
            Title = remoteOkJob!.Position, // Non-null assertion
            Company = remoteOkJob.Company,
            Location = new Location { Type = "Remote" }, // Default to "Remote"
            Language = remoteOkJob.Tags.Contains("typescript") || remoteOkJob.Tags.Contains("react") ? "en" : "unknown",
            Description = remoteOkJob.Description,
            PosterName = string.Empty, // No equivalent field in RemoteOK
            PostedDate = DateTime.TryParse(remoteOkJob.Date, out var parsedDate) ? parsedDate : DateTime.UtcNow,
            Url = !string.IsNullOrEmpty(remoteOkJob.ApplyUrl) ? new Uri(remoteOkJob.ApplyUrl) : new Uri(remoteOkJob.Url)
        }).ToList();

        return Results.Ok(jobs);
    }
}
