using System.ServiceModel.Syndication;
using System.Xml;
using JobHuntX.API.Models;
using JobHuntX.API.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace JobHuntX.API.Handlers;

public static class WeWorkRemotelyRSSHandler
{
    private static readonly HttpClient _httpClient = new HttpClient();
    private const string RssUrl = "https://weworkremotely.com/remote-jobs.rss";

    public static async Task<IResult> GetJobs([FromQuery] string? key)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, RssUrl);
            request.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");

            using var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode(); // ここで403なら例外投げる

            await using var stream = await response.Content.ReadAsStreamAsync();
            using var reader = XmlReader.Create(stream, new XmlReaderSettings { Async = true });
            var feed = SyndicationFeed.Load(reader);

            var jobs = feed.Items
                .Where(item => item.Links.FirstOrDefault()?.Uri != null) // Skip items without a valid URL
                .Select(item => {
                    var titleParts = item.Title?.Text.Split(':', 2); // Split by ':' into at most 2 parts
                    var company = titleParts != null && titleParts.Length > 1 ? titleParts[0].Trim() : "Unknown";
                    var title = titleParts != null && titleParts.Length > 1 ? titleParts[1].Trim() : item.Title?.Text ?? string.Empty;

                    return new Job
                    {
                        Id = Guid.NewGuid(),
                        Website = new Uri("https://weworkremotely.com"),
                        Title = title, // Assign the processed title
                        Company = company, // Assign the processed company
                        Location = new Location { Type = LocationType.Remote },
                        Language = "en",
                        Description = item.Summary?.Text ?? string.Empty,
                        Salary = null,
                        PosterName = null,
                        PostedDate = item.PublishDate.UtcDateTime,
                        Url = item.Links.FirstOrDefault()?.Uri!, // URL is guaranteed to be non-null here
                        // Tags = item.Categories.Select(c => c.Name).ToList()
                        Tags = new List<string>(),
                    };
                }).ToList();

            jobs = JobFilterHelper.FilterJobsByKey(key, jobs);

            return Results.Ok(jobs);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error processing RSS feed: {ex.Message}");
            return Results.Problem("Failed to process the RSS feed.");
        }
    }

    private static string ExtractRegion(SyndicationItem item)
    {
        // "region" は拡張要素から取得
        var regionElement = item.ElementExtensions.ReadElementExtensions<string>("region", "");
        return regionElement.FirstOrDefault() ?? "Worldwide";
    }
}
