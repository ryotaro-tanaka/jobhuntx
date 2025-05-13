using HtmlAgilityPack;
using JobHuntX.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text;
using System.IO.Compression;
using JobHuntX.API.Utilities;
using System.Text.RegularExpressions;

namespace JobHuntX.API.Handlers;

public class WeWorkRemotelyHandler : HandlerBase {
    protected override string CacheKey => nameof(WeWorkRemotelyHandler);
    protected override TimeSpan CacheDuration => TimeSpan.FromMinutes(0);

    // should share httpclient with RSS
    private static readonly HttpClient _httpClient = HttpClientFactoryUtil.CreateHttpClientWithHeaders();
    private const string BaseUrl = "https://weworkremotely.com";

    protected override async Task<List<Job>> FetchJobsAsync() {
        var doc = await FetchJobDocumentAsync($"{BaseUrl}/remote-jobs");
        var jobNodes = doc.DocumentNode.SelectNodes("//section[contains(@class, 'jobs')]//li[contains(@class, 'new-listing-container')]/a");

        if (jobNodes == null || jobNodes.Count == 0) {
            return new List<Job>();
        }

        // 重いので3件まで取得。余裕があれば10件ずつ取得する仕様にしたい
        // 並列に処理するとWWR側でブロックされるので、1件ずつ処理する
        var jobs = new List<Job>();
        foreach (var node in jobNodes.Take(3)) {
            var job = await ConvertToJobAsync(node);
            jobs.Add(job);
        }
        return jobs;
    }
    private static async Task<HtmlDocument> FetchJobDocumentAsync(string requestUri) {
        var response = await _httpClient.GetAsync(requestUri);
        response.EnsureSuccessStatusCode();

        var html = await GetHtmlFromResponse(response);

        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    private static async Task<string> GetHtmlFromResponse(HttpResponseMessage response) {
        var encoding = Encoding.UTF8;

        Stream stream = await response.Content.ReadAsStreamAsync();
        if (response.Content.Headers.ContentEncoding.Contains("br")) {
            stream = new BrotliStream(stream, CompressionMode.Decompress);
        }
        else if (response.Content.Headers.ContentEncoding.Contains("gzip")) {
            stream = new GZipStream(stream, CompressionMode.Decompress);
        }
        else if (response.Content.Headers.ContentEncoding.Contains("deflate")) {
            stream = new DeflateStream(stream, CompressionMode.Decompress);
        }

        using var reader = new StreamReader(stream, encoding);
        return await reader.ReadToEndAsync();
    }

    // private static HttpClient CreateHttpClientWithHeaders() {
    //     var handler = new HttpClientHandler {
    //         UseCookies = true,
    //         CookieContainer = new CookieContainer()
    //     };
    //     var httpClient = new HttpClient(handler);
    //     httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
    //     httpClient.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8");
    //     httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-US,en;q=0.9");
    //     httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
    //     httpClient.DefaultRequestHeaders.Add("Connection", "keep-alive");
    //     httpClient.DefaultRequestHeaders.Add("Upgrade-Insecure-Requests", "1");
    //     httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Dest", "document");
    //     httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Mode", "navigate");
    //     httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Site", "none");
    //     httpClient.DefaultRequestHeaders.Add("Sec-Fetch-User", "?1");
    //     return httpClient;
    // }

    private static async Task<Job> ConvertToJobAsync(HtmlNode node) {
        var titleNode = node.SelectSingleNode(".//h4[@class='new-listing__header__title']");
        var companyNode = node.SelectSingleNode(".//p[@class='new-listing__company-name']");
        var href = node.GetAttributeValue("href", "");
        var fullUrl = href.StartsWith("http", StringComparison.OrdinalIgnoreCase)
            ? href
            : $"{BaseUrl}{href}";

        var doc = await FetchJobDocumentAsync(fullUrl);

        var description = ExtractJobDescription(doc);
        var salary = ExtractJobSalary(doc);
        var PostedDate = ExtractJobPostedDate(doc);
        var tags = ExtractJobTags(doc);
        tags.AddRange(TagGenerator.ExtractTags(description));

        return new Job {
            Id = Guid.NewGuid(),
            Website = new Uri(BaseUrl),
            Title = GetSafeInnerText(titleNode, "No Title"),
            Company = GetSafeInnerText(companyNode, "No Company"),
            Location = new Location { Type = LocationType.Remote },
            Language = "en",
            Description = description,
            Salary = salary,
            PosterName = null,
            PostedDate = PostedDate,
            Url = new Uri(fullUrl),
            Tags = tags
        };
    }

    private static string ExtractJobDescription(HtmlDocument doc) {
        var descriptionNode = doc.DocumentNode.SelectSingleNode("//div[contains(@class, 'lis-container__job__content__description')]");
        return descriptionNode?.InnerText.Trim() ?? string.Empty;
    }

    private static Salary? ExtractJobSalary(HtmlDocument doc) {
        var salaryNode = doc.DocumentNode.SelectSingleNode("//li[contains(@class, 'lis-container__job__sidebar__job-about__list__item') and contains(text(), 'Salary')]//span[contains(@class, 'box')]");
        if (salaryNode == null)
            return null;

        var salaryText = salaryNode.InnerText.Trim();
        return ParseSalary(salaryText);
    }

    private static Salary? ParseSalary(string salaryText) {
        var salary = new Salary();
        var parts = salaryText.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        if (parts.Length > 0 && parts[0].StartsWith("$")) {
            var range = parts[0].Trim('$').Replace(",", "").Split('-');
            if (range.Length == 2) {
                salary.Min = decimal.TryParse(range[0], out var min) ? min : null;
                salary.Max = decimal.TryParse(range[1], out var max) ? max : null;
            }
            else if (range.Length == 1) {
                salary.Min = decimal.TryParse(range[0], out var min) ? min : null;
            }
        }

        if (parts.Length > 1 && parts[^1].Length == 3) {
            salary.CurrencyCode = parts[^1];
        }

        return salary;
    }

    private static DateTime ExtractJobPostedDate(HtmlDocument doc) {
        var dateNow = DateTime.Now;

        var postedDateNode = doc.DocumentNode.SelectSingleNode("//li[contains(@class, 'lis-container__job__sidebar__job-about__list__item') and contains(text(), 'Posted on')]/span");
        if (postedDateNode == null)
            return dateNow; // Return current DateTime if element not found.

        var text = postedDateNode.InnerText.Trim();
        var match = Regex.Match(text, @"(\d+)\s+(minutes?|hours?|days?|months?)\s+ago");

        if (!match.Success)
            return dateNow; // Return current DateTime if regex does not match.

        var value = int.Parse(match.Groups[1].Value);
        var unit = match.Groups[2].Value;

        return unit.StartsWith("minute") ? dateNow.AddMinutes(-value) :
               unit.StartsWith("hour") ? dateNow.AddHours(-value) :
               unit.StartsWith("day") ? dateNow.AddDays(-value) :
               unit.StartsWith("month") ? dateNow.AddMonths(-value) :
               dateNow; // Default to current DateTime if unit is unrecognized.
    }

    private static string GetSafeInnerText(HtmlNode? node, string defaultValue) {
        return !string.IsNullOrWhiteSpace(node?.InnerText)
            ? node.InnerText.Trim()
            : defaultValue;
    }

    private static List<string> ExtractJobTags(HtmlDocument doc) {
        var tags = new List<string>();

        // Extract Job Type
        var jobTypeNode = doc.DocumentNode.SelectSingleNode("//li[contains(@class, 'lis-container__job__sidebar__job-about__list__item') and contains(text(), 'Job type')]//span[contains(@class, 'box--jobType')]");
        if (jobTypeNode != null) {
            var jobType = jobTypeNode.InnerText.Trim().ToLower();
            if (!string.IsNullOrEmpty(jobType)) {
                tags.Add(jobType);
            }
        }

        // Extract Skills
        var skillsNodes = doc.DocumentNode.SelectNodes("//li[contains(@class, 'lis-container__job__sidebar__job-about__list__item--full') and contains(text(), 'Skills')]//span[contains(@class, 'box--multi')]");
        if (skillsNodes != null) {
            foreach (var skillNode in skillsNodes) {
                var skill = skillNode.InnerText.Trim().ToLower();
                if (!string.IsNullOrEmpty(skill)) {
                    tags.Add(skill);
                }
            }
        }

        return tags;
    }
}
