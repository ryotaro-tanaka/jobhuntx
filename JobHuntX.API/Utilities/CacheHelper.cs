using System.Threading;

namespace JobHuntX.API.Utilities;

public static class CacheHelper
{
    public static async Task<T> GetOrSetAsync<T>(
        Func<Task<T>> fetchData,
        SemaphoreSlim semaphore,
        Func<T?> getCachedData,
        Action<T> setCacheData,
        TimeSpan cacheDuration)
    {
        await semaphore.WaitAsync();
        try
        {
            var cachedData = getCachedData();
            if (cachedData != null && (DateTime.UtcNow - GetCacheTime(setCacheData)) < cacheDuration)
            {
                return cachedData;
            }
        }
        finally
        {
            semaphore.Release();
        }

        var data = await fetchData();

        await semaphore.WaitAsync();
        try
        {
            setCacheData(data);
        }
        finally
        {
            semaphore.Release();
        }

        return data;
    }

    private static DateTime GetCacheTime<T>(Action<T> setCacheData)
    {
        // This method should return the cache time. Adjust as needed for your implementation.
        return DateTime.UtcNow; // Placeholder
    }
}
