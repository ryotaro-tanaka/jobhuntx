using HtmlAgilityPack;
using JobHuntX.API.Models;
using JobHuntX.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text;
using System.IO.Compression; // 追加

namespace JobHuntX.API.Handlers;

public static class WeWorkRemotelyHandler {
    // HttpClientはstaticにして再利用（毎回newすると403になるため）
    private static readonly HttpClient _httpClient = CreateHttpClientWithHeaders();

    public static async Task<IResult> GetWeWorkRemotelyJobs([FromQuery] string? key) {
        try {
            var response = await _httpClient.GetAsync("https://weworkremotely.com/remote-jobs");
            response.EnsureSuccessStatusCode();

            var encoding = Encoding.UTF8; // 文字コード（今回はUTF-8想定）

            Stream stream = await response.Content.ReadAsStreamAsync();
            if (response.Content.Headers.ContentEncoding.Contains("br")) {
                stream = new BrotliStream(stream, CompressionMode.Decompress);
            } else if (response.Content.Headers.ContentEncoding.Contains("gzip")) {
                stream = new GZipStream(stream, CompressionMode.Decompress);
            } else if (response.Content.Headers.ContentEncoding.Contains("deflate")) {
                stream = new DeflateStream(stream, CompressionMode.Decompress);
            }
            // else 生のstreamでOK

            using var reader = new StreamReader(stream, encoding);
            var html = await reader.ReadToEndAsync();

            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var jobNodes = doc.DocumentNode.SelectNodes("//section[contains(@class, 'jobs')]//li[contains(@class, 'new-listing-container')]//a");
            Console.WriteLine($"Found {jobNodes?.Count} job nodes.");
            Console.WriteLine($"{jobNodes?[0].InnerHtml}");

            if (jobNodes == null || jobNodes.Count == 0) {
                return Results.Ok(new List<Job>());
            }

            var jobs = jobNodes.Select(node => ConvertToJob(node)).ToList();
            jobs = FilterJobsByKey(key, jobs);

            return Results.Ok(jobs);
        }
        catch (Exception ex) {
            // 例外発生時はログ（開発中は詳細返す）
            Console.WriteLine($"Error scraping WeWorkRemotely: {ex.Message}");
            return Results.Problem("Failed to scrape WeWorkRemotely.");
        }
    }

    // pretend to be a real browser
    private static HttpClient CreateHttpClientWithHeaders() {
        var handler = new HttpClientHandler {
            UseCookies = true,
            CookieContainer = new CookieContainer()
        };
        var httpClient = new HttpClient(handler);
        httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
        httpClient.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8");
        httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-US,en;q=0.9");
        httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
        httpClient.DefaultRequestHeaders.Add("Connection", "keep-alive");
        httpClient.DefaultRequestHeaders.Add("Upgrade-Insecure-Requests", "1");
        httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Dest", "document");
        httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Mode", "navigate");
        httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Site", "none");
        httpClient.DefaultRequestHeaders.Add("Sec-Fetch-User", "?1");
        return httpClient;
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

    private static Job ConvertToJob(HtmlNode node) {
        var titleNode = node.SelectSingleNode(".//span[@class='title']");
        var companyNode = node.SelectSingleNode(".//span[@class='company']");
        var url = "https://weworkremotely.com" + node.GetAttributeValue("href", "");

        return new Job {
            Id = Guid.NewGuid(),
            Website = new Uri("https://weworkremotely.com"),
            Title = titleNode?.InnerText.Trim() ?? "No Title",
            Company = companyNode?.InnerText.Trim() ?? "No Company",
            Location = new Location { Type = "Remote" },
            Language = string.Empty,
            Description = string.Empty,
            Salary = null,
            PosterName = string.Empty,
            PostedDate = DateTime.UtcNow,
            Url = new Uri(url),
            Tags = new List<string>()
        };
    }
}
