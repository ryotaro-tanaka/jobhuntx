using JobHuntX.API.Models;

namespace JobHuntX.API.Utilities;

public static class JobFilterHelper {
    public static List<Job> FilterJobsByKey(string? key, List<Job> jobs) {
        if (string.IsNullOrWhiteSpace(key)) {
            return jobs;
        }

        var lowerKey = key.ToLowerInvariant();
        return jobs.Where(job =>
            job.Title.ToLowerInvariant().Contains(lowerKey) ||
            job.Company.ToLowerInvariant().Contains(lowerKey) ||
            (job.Location.Country?.ToLowerInvariant().Contains(lowerKey) ?? false) ||
            (job.Location.City?.ToLowerInvariant().Contains(lowerKey) ?? false) ||
            (job.PosterName?.ToLowerInvariant().Contains(lowerKey) ?? false) ||
            job.Tags.Any(tag => tag.ToLowerInvariant().Contains(lowerKey))
        ).ToList();
    }
}
