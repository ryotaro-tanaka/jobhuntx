using JobHuntX.API.Models;
using JobHuntX.API.Handlers;
using Microsoft.AspNetCore.Mvc;

namespace JobHuntX.API.Extensions;
public static class ApplicationExtensions {
    public static void UseSwaggerWithUI(this WebApplication app) {
        if (app.Environment.IsDevelopment()) {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
    }

    public static void MapEndpoints(this WebApplication app) {
        app.MapGet("/api/jobs", async([FromQuery] string ? key) => {
            var handler = new RemoteOkHandler();
            return await handler.GetJobs(key);
        })
            .Produces<List<Job>>(StatusCodes.Status200OK)
            .WithOpenApi();

        app.MapJobEndpoint<RemoteOkHandler>("/api/remoteok");
        app.MapJobEndpoint<WeWorkRemotelyHandler>("/api/wework");
        app.MapJobEndpoint<WeWorkRemotelyRSSHandler>("/api/weworkrss");

        app.MapGet("/api/sample", SampleJobHandler.GetJobs)
            .Produces<List<Job>>(StatusCodes.Status200OK)
            .WithOpenApi();

        app.MapGet("/api/candidates", SampleCandidateHandler.GetCandidates)
            .Produces<List<Job>>(StatusCodes.Status200OK)
            .WithOpenApi();

        app.MapGet("/api/keywords", KeywordTagsHandler.GetKeywordTags)
            .Produces<KeywordTags>(StatusCodes.Status200OK)
            .WithOpenApi();

        app.MapGet("/", () => "Welcome to JobHuntX.API!")
            .Produces<string>(StatusCodes.Status200OK)
            .WithOpenApi();
    }

    private static void MapJobEndpoint<THandler>(this WebApplication app, string route)
        where THandler : IJobHandler, new() {
        app.MapGet(route, async([FromQuery] string ? key) => {
            var handler = new THandler();
            return await handler.GetJobs(key);
        })
        .Produces<List<Job>>(StatusCodes.Status200OK)
        .WithOpenApi();
    }
}
