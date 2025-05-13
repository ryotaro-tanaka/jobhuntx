using JobHuntX.API.Models;
using System.Text.Json;

namespace JobHuntX.API.Handlers;

public static class KeywordTagsHandler {
    public static async Task<IResult> GetKeywordTags(string filePath) {
        return await Utilities.ErrorHandler.WrapAsync(async () => {
            if (!File.Exists(filePath))
                return Results.Ok(new KeywordTags());

            var json = await File.ReadAllTextAsync(filePath);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var keywordTags = JsonSerializer.Deserialize<KeywordTags>(json, options);

            return Results.Ok(keywordTags ?? new KeywordTags());
        });
    }

    private static readonly string DefaultFilePath = Path.Combine("Resources", "keyword-tags.json");
    public static Task<IResult> GetKeywordTags() => GetKeywordTags(DefaultFilePath);
}
