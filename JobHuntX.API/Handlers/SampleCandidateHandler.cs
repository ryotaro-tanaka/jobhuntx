using JobHuntX.API.Models;

namespace JobHuntX.API.Handlers;

public static class SampleCandidateHandler {
    public static IResult GetCandidates() {
        var sampleCandidates = new List<Candidate>
        {
            new Candidate
            {
                Id = Guid.NewGuid(),
                Name = "Ryotaro Tanaka",
                Skills = new List<string> {
                    "React",
                    "ASP.NET Core",
                    "Docker"
                },
                ProfileUrl = new Uri("https://www.linkedin.com/in/ryotaro-tanaka/"),
                Summary = "This app was developed by this person.",
                Location = new Location {
                    Type = LocationType.Hybrid,
                    City = null,
                    Country = "Australia"
                },
                AvailableFrom = DateTime.Now
            }
        };
        return Results.Ok(sampleCandidates); // Return Results.Ok directly
    }
}
