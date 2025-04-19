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
            var sampleJobs = SampleData.GetSampleJobs();

            app.MapGet("/api/jobs", () => Results.Ok(sampleJobs))
                .Produces<List<Job>>(StatusCodes.Status200OK)
                .WithOpenApi();

            app.MapGet("/", () => "Welcome to JobHuntX.API!")
                .Produces<string>(StatusCodes.Status200OK)
                .WithOpenApi();
        }
    }
}
