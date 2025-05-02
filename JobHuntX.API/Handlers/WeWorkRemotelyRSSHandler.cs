using System.ServiceModel.Syndication;
using System.Xml;
using JobHuntX.API.Models;
using JobHuntX.API.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace JobHuntX.API.Handlers;

public class WeWorkRemotelyRSSHandler : HandlerBase {
    protected override string CacheKey => nameof(WeWorkRemotelyRSSHandler);
    protected override TimeSpan CacheDuration => TimeSpan.FromMinutes(0);

    private static readonly HttpClient _httpClient = new HttpClient();
    private const string BaseUrl = "https://weworkremotely.com";
    private const string RssUrl = $"{BaseUrl}/remote-jobs.rss";
    private const string UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

    protected override async Task<List<Job>> FetchJobsAsync() {
        var feed = await FetchFeedAsync();
        return ParseFeedItems(feed);
    }

    private static async Task<SyndicationFeed> FetchFeedAsync() {
        var request = new HttpRequestMessage(HttpMethod.Get, RssUrl);
        request.Headers.Add("User-Agent", UserAgent);

        using var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync();
        using var reader = XmlReader.Create(stream, new XmlReaderSettings { Async = true });
        return SyndicationFeed.Load(reader);
    }

    private static List<Job> ParseFeedItems(SyndicationFeed feed) {
        return feed.Items
            .Where(item => item.Links.FirstOrDefault()?.Uri != null)
            .Select(item => {
                var titleParts = item.Title?.Text.Split(':', 2); // Split by ':' into at most 2 parts
                var company = titleParts != null && titleParts.Length > 1 ? titleParts[0].Trim() : "Unknown";
                var title = titleParts != null && titleParts.Length > 1 ? titleParts[1].Trim() : item.Title?.Text ?? string.Empty;

                return new Job {
                    Id = Guid.NewGuid(),
                    Website = new Uri(BaseUrl),
                    Title = title,
                    Company = company,
                    Location = new Location { Type = LocationType.Remote },
                    Language = "en",
                    // Description = item.Summary?.Text ?? string.Empty,
                    Description = string.Empty,
                    Salary = null,
                    PosterName = null,
                    PostedDate = item.PublishDate.UtcDateTime,
                    Url = item.Links.FirstOrDefault()?.Uri!,
                    Tags = new List<string>(),
                };
            }).ToList();
    }
}
