using JobHuntX.API.Models;
using JobHuntX.API.Handlers;
using Microsoft.AspNetCore.Mvc;

namespace JobHuntX.API.Extensions {
    public static class ApplicationExtensions {
        public static void UseSwaggerWithUI(this WebApplication app) {
            if (app.Environment.IsDevelopment()) {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
        }

        public static void MapEndpoints(this WebApplication app) {
            app.MapGet("/api/sample", SampleJobHandler.GetSampleJobs)
                .Produces<List<Job>>(StatusCodes.Status200OK)
                .WithOpenApi();

            // app.MapGet("/api/jobs", RemoteOkHandler.GetRemoteOkJobs)
            app.MapGet("/api/jobs", SampleJobHandler.GetSampleJobs)
                .Produces<List<Job>>(StatusCodes.Status200OK)
                .WithOpenApi();

            app.MapGet("/api/remoteok", async([FromQuery] string ? key) => {
                var jobs = await RemoteOkHandler.GetRemoteOkJobs(key);
                return Results.Ok(jobs);
            })
                .Produces<List<Job>>(StatusCodes.Status200OK)
                .WithOpenApi();

            app.MapGet("/api/wework", async([FromQuery] string ? key) => {
                var handler = new WeWorkRemotelyHandler();
                return await handler.GetJobs(key);
            })
                .Produces<List<Job>>(StatusCodes.Status200OK)
                .WithOpenApi();

            app.MapGet("/api/weworkrss", async([FromQuery] string ? key) => {
                var handler = new WeWorkRemotelyRSSHandler();
                return await handler.GetJobs(key);
            })
                .Produces<List<Job>>(StatusCodes.Status200OK)
                .WithOpenApi();

            app.MapGet("/", () => "Welcome to JobHuntX.API!")
                .Produces<string>(StatusCodes.Status200OK)
                .WithOpenApi();
        }
    }
}
