using JobHuntX.API.Models;
using Microsoft.AspNetCore.Mvc;
using JobHuntX.API.Utilities;
using JobHuntX.API.DTOs;

namespace JobHuntX.API.Handlers;

public class AggregateJobHandler {
    private readonly List<IJobHandler> _handlers;

    public AggregateJobHandler() {
        _handlers = new List<IJobHandler>
        {
            new RemoteOkHandler(),
            new WeWorkRemotelyRSSHandler(),
        };
    }

    public async Task<IResult> GetJobs([FromQuery] string? key) {
        var allJobs = new List<Job>();
        var messages = new List<ApiMessage>();

        foreach (var handler in _handlers) {
            try {
                if (handler is HandlerBase baseHandler) {
                    var jobs = await baseHandler.GetJobsAsync(key);
                    allJobs.AddRange(jobs);
                }
            }
            catch (Exception ex) {
                messages.Add(new ApiMessage {
                    Type = ApiMessageType.Error,
                    Text = $"{handler.GetType().Name}: {ex.Message}"
                });
            }
        }

        if (allJobs.Count == 0) {
            var badResponse = new JobListResponse {
                IsSuccess = false,
                TotalCount = 0,
                Jobs = allJobs,
                Messages = messages
            };
            return Results.Ok(badResponse);
        }

        var response = new JobListResponse {
            IsSuccess = messages.Count == 0,
            TotalCount = allJobs.Count,
            Jobs = allJobs,
            Messages = messages
        };

        return Results.Ok(response);
    }
}
