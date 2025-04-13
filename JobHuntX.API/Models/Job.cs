namespace JobHuntX.API.Models;

public class Job
{
    public Guid Id { get; set; } // Unique identifier
    public Uri Website { get; set; } = new Uri("about:blank"); // Changed to Uri for better URL handling
    public string Title { get; set; } = string.Empty; // Job title
    public string Company { get; set; } = string.Empty; // Company name
    public List<Location> Location { get; set; } = new(); // List of locations
    public string Language { get; set; } = string.Empty; // Changed to string.Empty for cases where language is unknown
    public string Description { get; set; } = string.Empty; // Job description
    public string Name { get; set; } = string.Empty; // Alternative company name
    public DateTime PostedDate { get; set; } // Date the job was posted
    public Uri Url { get; set; } = new Uri("about:blank"); // Job URL
}
