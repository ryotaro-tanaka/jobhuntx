using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using JobHuntX.API.Models;
using JobHuntX.API.Data; // Add this line to reference SampleData

namespace JobHuntX.API.Extensions {
    public static class ApplicationExtensions {
        public static void UseSwaggerWithUI(this WebApplication app) {
            if (app.Environment.IsDevelopment()) {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
        }

        public static void MapEndpoints(this WebApplication app) {
            app.MapGet("/api/jobs", () => {
                var sampleJobs = SampleData.GetSampleJobs();
                return Results.Ok(sampleJobs);
            })
            .Produces<List<Job>>(StatusCodes.Status200OK)
            .WithOpenApi();

            app.MapGet("/api/remoteok", async () => {
                using var httpClient = new HttpClient();
                var jobs = await httpClient.GetFromJsonAsync<List<object>>("https://remoteok.com/api");
                if (jobs != null && jobs.Count > 0) {
                    jobs.RemoveAt(0); // Remove the first element
                }
                return Results.Ok(jobs);
            });

            app.MapGet("/", () => "Welcome to JobHuntX.API!")
                .Produces<string>(StatusCodes.Status200OK)
                .WithOpenApi();
        }
    }
}
