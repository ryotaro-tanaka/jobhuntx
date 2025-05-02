using System.Text.Json;
using System.Text.RegularExpressions;

namespace JobHuntX.API.Utilities;

public static class TagGenerator
{
    private static readonly HashSet<string> _keywords;

    static TagGenerator()
    {
        var json = File.ReadAllText("Resources/keyword-tags.json"); // パスは適宜調整
        var dictionary = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(json);

        _keywords = dictionary?
            .SelectMany(kv => kv.Value)
            .Select(k => k.ToLowerInvariant())
            .ToHashSet() ?? new HashSet<string>();
    }

    public static List<string> ExtractTags(string description)
    {
        if (string.IsNullOrWhiteSpace(description)) return new List<string>();

        var tags = new HashSet<string>();
        var lowerDesc = description.ToLowerInvariant();

        foreach (var keyword in _keywords)
        {
            var pattern = $@"\b{Regex.Escape(keyword)}\b";
            if (Regex.IsMatch(lowerDesc, pattern))
            {
                tags.Add(keyword);
            }
        }

        return tags.ToList();
    }
}
