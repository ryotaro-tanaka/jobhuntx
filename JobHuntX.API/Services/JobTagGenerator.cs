using JobHuntX.API.Models;

namespace JobHuntX.API.Services;

public static class JobTagGenerator {
    public static List<string> GenerateTags(Job job) {
        var tags = new List<string>();

        // AddWords(job.Title);
        // AddWords(job.Company);
        // AddWords(job.Location?.City);
        // AddWords(job.Description);
        // AddWords(job.PosterName);

        return tags.Distinct().ToList();
    }

    // void AddWords(string? text)
    // {
    //     if (!string.IsNullOrWhiteSpace(text))
    //     {
    //         var words = text
    //             .Split(new[] { ' ', ',', '.', ';', '(', ')', '[', ']', '{', '}', '\n' }, StringSplitOptions.RemoveEmptyEntries)
    //             .Select(w => w.Trim().ToLowerInvariant())
    //             .Distinct();

    //         tags.AddRange(words);
    //     }
    // }
}
