using JobHuntX.API.Models;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace JobHuntX.API.Handlers;

public static class KeywordTagsHandler {
    private static readonly string FilePath = Path.Combine("Resources", "keyword-tags.json");

    public static async Task<IResult> GetKeywordTags() {
        return await Utilities.ErrorHandler.WrapAsync(async () => {
            if (!File.Exists(FilePath))
                return Results.NotFound();

            var json = await File.ReadAllTextAsync(FilePath);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var keywordTags = JsonSerializer.Deserialize<KeywordTags>(json, options);

            return keywordTags is not null ? Results.Ok(keywordTags) : Results.NotFound();
        });
    }
}
