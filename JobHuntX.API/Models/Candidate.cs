namespace JobHuntX.API.Models;

public class Candidate {
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = new();
    public Uri ProfileUrl { get; set; } = new Uri("about:blank");
    public string? Summary { get; set; }
    public Location Location { get; set; } = new();
    public DateTime AvailableFrom { get; set; }
    public bool IsSpecial { get; set; } = false;
}
