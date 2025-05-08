using JobHuntX.API.Models;
using JobHuntX.API.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace JobHuntX.API.Handlers;

public interface IJobHandler {
    Task<IResult> GetJobs(string? key);
}

public abstract class HandlerBase : IJobHandler {
    protected virtual TimeSpan CacheDuration => TimeSpan.FromMinutes(10);

    /// <summary>Defines the cache key for each handler</summary>
    protected abstract string CacheKey { get; }

    /// <summary>Data fetching logic (to be cached)</summary>
    protected abstract Task<List<Job>> FetchJobsAsync();

    /// <summary>Common GetJobs entry point</summary>
    public async Task<IResult> GetJobs([FromQuery] string? key) {
        return await ErrorHandler.WrapAsync(async () => {
            var jobs = await CacheHelper.GetOrSetAsync(CacheKey, FetchJobsAsync, CacheDuration);
            jobs = JobFilterHelper.FilterJobsByKey(key, jobs);
            return Results.Ok(jobs);
        });
    }

    /// <summary>
    /// Fetches and filters the job list for internal use or aggregation.
    /// Unlike GetJobs, this method returns a raw List<Job>; without HTTP response wrapping or error handling.
    /// </summary>
    public async Task<List<Job>> GetJobsAsync(string? key) {
        var jobs = await CacheHelper.GetOrSetAsync(CacheKey, FetchJobsAsync, CacheDuration);
        return JobFilterHelper.FilterJobsByKey(key, jobs);
    }
}
