using JobHuntX.API.Models;
using Microsoft.AspNetCore.Mvc;
using JobHuntX.API.Utilities;

namespace JobHuntX.API.Handlers;

public class AggregateJobHandler
{
    private readonly List<IJobHandler> _handlers;

    public AggregateJobHandler()
    {
        // 必要なHandlerをここに追加
        _handlers = new List<IJobHandler>
        {
            new RemoteOkHandler(),
            new WeWorkRemotelyRSSHandler(),
            // 今後増やす場合はここに追加
        };
    }

    public async Task<IResult> GetJobs([FromQuery] string? key)
    {
        return await ErrorHandler.WrapAsync(async () =>
        {
            var allJobs = new List<Job>();
            foreach (var handler in _handlers)
            {
                if (handler is HandlerBase baseHandler)
                {
                    var jobs = await baseHandler.GetJobsAsync(key);
                    allJobs.AddRange(jobs);
                }
            }
            return Results.Ok(allJobs);
        });
    }
}