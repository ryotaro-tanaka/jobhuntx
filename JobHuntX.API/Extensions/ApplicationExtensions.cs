using JobHuntX.API.Models;
using JobHuntX.API.Data;
using JobHuntX.API.Handlers;

namespace JobHuntX.API.Extensions {
    public static class ApplicationExtensions {
        public static void UseSwaggerWithUI(this WebApplication app) {
            if (app.Environment.IsDevelopment()) {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
        }

        public static void MapEndpoints(this WebApplication app) {
            // app.MapGet("/api/jobs", () => {
            //     var sampleJobs = SampleData.GetSampleJobs();
            //     return Results.Ok(sampleJobs);
            // })
            // .Produces<List<Job>>(StatusCodes.Status200OK)
            // .WithOpenApi();

            app.MapGet("/api/jobs", RemoteOkHandler.GetRemoteOkJobs)
                .Produces<List<Job>>(StatusCodes.Status200OK)
                .WithOpenApi();

            app.MapGet("/api/remoteok", async () => {
                var jobs = await RemoteOkHandler.GetRemoteOkJobs();
                return Results.Ok(jobs);
            })
            .Produces<List<Job>>(StatusCodes.Status200OK)
            .WithOpenApi();

            app.MapGet("/", () => "Welcome to JobHuntX.API!")
                .Produces<string>(StatusCodes.Status200OK)
                .WithOpenApi();
        }
    }
}
