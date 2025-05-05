using JobHuntX.API.Models;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace JobHuntX.API.Handlers;

public static class KeywordTagsHandler {
    public static async Task<IResult> GetKeywordTags(string filePath) {
        return await Utilities.ErrorHandler.WrapAsync(async () => {
            if (!File.Exists(filePath))
                return Results.NotFound();

            var json = await File.ReadAllTextAsync(filePath);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var keywordTags = JsonSerializer.Deserialize<KeywordTags>(json, options);

            return keywordTags is not null ? Results.Ok(keywordTags) : Results.NotFound();
        });
    }

    private static readonly string DefaultFilePath = Path.Combine("Resources", "keyword-tags.json");
    public static Task<IResult> GetKeywordTags() => GetKeywordTags(DefaultFilePath);
}
