using System.Collections.Concurrent;
using System.Threading;

namespace JobHuntX.API.Utilities;

public static class CacheHelper
{
    private static readonly ConcurrentDictionary<string, (object? Data, DateTime CacheTime)> _cache = new();
    private static readonly SemaphoreSlim _semaphore = new(1, 1);

    public static async Task<T> GetOrSetAsync<T>(
        string cacheKey,
        Func<Task<T>> fetchData,
        TimeSpan cacheDuration)
    {
        await _semaphore.WaitAsync();
        try
        {
            if (_cache.TryGetValue(cacheKey, out var cachedEntry) &&
                (DateTime.UtcNow - cachedEntry.CacheTime) < cacheDuration)
            {
                return (T)cachedEntry.Data!;
            }
        }
        finally
        {
            _semaphore.Release();
        }

        var data = await fetchData();

        await _semaphore.WaitAsync();
        try
        {
            _cache[cacheKey] = (data, DateTime.UtcNow);
        }
        finally
        {
            _semaphore.Release();
        }

        return data;
    }
}
