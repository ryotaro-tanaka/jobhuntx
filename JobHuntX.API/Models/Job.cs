namespace JobHuntX.API.Models;

public class Job {
    public Guid Id { get; set; }
    public Uri Website { get; set; } = new Uri("about:blank");
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public Location Location { get; set; } = new();
    public string Language { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Salary? Salary { get; set; }
    public string PosterName { get; set; } = string.Empty;
    public DateTime PostedDate { get; set; }
    public Uri Url { get; set; } = new Uri("about:blank");
    public List<string> Tags { get; set; } = new();
}