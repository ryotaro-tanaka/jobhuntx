using System.Text; // Add this line for Encoding.UTF8
using System.Text.Json;
using System.Net;
using JobHuntX.API.Models;

namespace JobHuntX.API.Handlers;

public static class RemoteOkHandler {
    public static async Task<IResult> GetRemoteOkJobs() {
        using var httpClient = new HttpClient();
        using var response = await httpClient.GetAsync("https://remoteok.com/api");

        response.EnsureSuccessStatusCode();

        // UTF-8としてストリームを読み込む
        var stream = await response.Content.ReadAsStreamAsync();
        using var reader = new StreamReader(stream, Encoding.UTF8); // Encoding.UTF8 requires System.Text
        var jsonString = await reader.ReadToEndAsync(); // 絵文字も正しく認識されている

        var options = new JsonSerializerOptions {
            PropertyNameCaseInsensitive = true
        };

        var json = JsonSerializer.Deserialize<List<RemoteOkJobDto>>(jsonString, options); // 絵文字が文字化けしている

        if (json == null || json.Count == 0) {
            return Results.Ok(new List<Job>());
        }

        Console.WriteLine("Decoded: " + json[1].Description);

        json.RemoveAt(0); // metadata

        var jobs = json.Select(remoteOkJob => new Job {
            Id = Guid.NewGuid(),
            Website = new Uri("https://remoteok.com"),
            Title = remoteOkJob.Position,
            Company = remoteOkJob.Company,
            Location = new Location { Type = "Remote" },
            Language = string.Empty,
            // Description = remoteOkJob.Description,
            // Description = WebUtility.HtmlDecode(remoteOkJob.Description),
            Description = RemoveNonAscii(remoteOkJob.Description),
            PosterName = string.Empty,
            PostedDate = DateTime.TryParse(remoteOkJob.Date, out var parsedDate) ? parsedDate : DateTime.UtcNow,
            Url = new Uri(remoteOkJob.ApplyUrl)
        }).ToList();

        return Results.Ok(jobs);
    }
    public static string RemoveNonAscii(string input) {
        if (string.IsNullOrEmpty(input))
            return input;
        return new string(input.Where(c => c <= 127).ToArray());
    }

    public static string DecodeUtf8EscapedString(string input) {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        // JSONの \u00XX 系をバイト列に変換
        var bytes = new List<byte>();
        for (int i = 0; i < input.Length - 5; i++) {
            if (input[i] == '\\' && input[i + 1] == 'u') {
                var hex = input.Substring(i + 2, 4);
                if (byte.TryParse(hex, System.Globalization.NumberStyles.HexNumber, null, out var b)) {
                    bytes.Add(b);
                    i += 5;
                }
            }
        }

        return Encoding.UTF8.GetString(bytes.ToArray());
    }
}
