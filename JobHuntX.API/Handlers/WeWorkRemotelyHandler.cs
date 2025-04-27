using HtmlAgilityPack;
using JobHuntX.API.Models;
using JobHuntX.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text;
using System.IO.Compression;
using JobHuntX.API.Utilities;

namespace JobHuntX.API.Handlers;

public static class WeWorkRemotelyHandler {
    // HttpClientはstaticにして再利用（毎回newすると403になるため）
    private static readonly HttpClient _httpClient = CreateHttpClientWithHeaders();
    private const string BaseUrl = "https://weworkremotely.com";

    // https://weworkremotely.com/remote-job-rss-feed の選択肢
    // XMLで配信しているのでスクレイピングせずにパースできる
    public static async Task<IResult> GetWeWorkRemotelyJobs([FromQuery] string? key) {
        try {
            var jobNodes = await FetchAndParseJobNodes<HtmlNodeCollection>(
                    $"{BaseUrl}/remote-jobs", 
                    "//section[contains(@class, 'jobs')]//li[contains(@class, 'new-listing-container')]/a"
                );

            if (jobNodes == null || jobNodes.Count == 0) {
                return Results.Ok(new List<Job>());
            }

            // テスト用に10件まで
            var jobs = jobNodes.Take(10).Select(node => ConvertToJob(node)).ToList();
            jobs = JobFilterHelper.FilterJobsByKey(key, jobs);

            return Results.Ok(jobs);
        }
        catch (Exception ex) {
            Console.WriteLine($"Error scraping WeWorkRemotely: {ex.Message}");
            return Results.Problem("Failed to scrape WeWorkRemotely.");
        }
    }

    private static async Task<T?> FetchAndParseJobNodes<T>(string requestUri, string xpath, bool singleNode = false) where T : class {
        var response = await _httpClient.GetAsync(requestUri);
        response.EnsureSuccessStatusCode();

        var html = await GetHtmlFromResponse(response);

        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        return singleNode 
            ? doc.DocumentNode.SelectSingleNode(xpath) as T
            : doc.DocumentNode.SelectNodes(xpath) as T;
    }

    private static async Task<string> GetHtmlFromResponse(HttpResponseMessage response) {
        var encoding = Encoding.UTF8;

        Stream stream = await response.Content.ReadAsStreamAsync();
        if (response.Content.Headers.ContentEncoding.Contains("br")) {
            stream = new BrotliStream(stream, CompressionMode.Decompress);
        } else if (response.Content.Headers.ContentEncoding.Contains("gzip")) {
            stream = new GZipStream(stream, CompressionMode.Decompress);
        } else if (response.Content.Headers.ContentEncoding.Contains("deflate")) {
            stream = new DeflateStream(stream, CompressionMode.Decompress);
        }

        using var reader = new StreamReader(stream, encoding);
        return await reader.ReadToEndAsync();
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

    private static Job ConvertToJob(HtmlNode node) {
        var titleNode = node.SelectSingleNode(".//h4[@class='new-listing__header__title']");
        var companyNode = node.SelectSingleNode(".//p[@class='new-listing__company-name']");
        var href = node.GetAttributeValue("href", "");
        var fullUrl = href.StartsWith("http", StringComparison.OrdinalIgnoreCase) 
                ? href
                : $"{BaseUrl}{href}";
        var description = GetJobDescriptionAsync(fullUrl).Result;

        return new Job {
            Id = Guid.NewGuid(),
            Website = new Uri(BaseUrl),
            Title = GetSafeInnerText(titleNode, "No Title"),
            Company = GetSafeInnerText(companyNode, "No Company"),
            Location = new Location { Type = "Remote" },
            Language = string.Empty,
            Description = description,
            Salary = null,
            PosterName = string.Empty,
            PostedDate = DateTime.UtcNow,
            Url = new Uri(fullUrl),
            Tags = new List<string>()
        };
    }
    private static async Task<string> GetJobDescriptionAsync(string jobUrl)
    {
        var descriptionNode = await FetchAndParseJobNodes<HtmlNode>(
                jobUrl, 
                "//div[contains(@class, 'lis-container__job__content__description')]",
                true
            );

        if (descriptionNode == null)
            return string.Empty;

        // テキストだけ取得（改行をある程度保持したいなら、HtmlAgilityPackのInnerTextではなく、カスタムで取るのもアリ）
        return descriptionNode.InnerText.Trim();
    }


    private static string GetSafeInnerText(HtmlNode? node, string defaultValue) {
        return !string.IsNullOrWhiteSpace(node?.InnerText)
            ? node.InnerText.Trim()
            : defaultValue;
    }

}
