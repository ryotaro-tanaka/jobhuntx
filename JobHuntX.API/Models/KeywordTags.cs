namespace JobHuntX.API.Models;

public class KeywordTags {
    public List<string> Roles { get; set; } = new();
    public List<string> Skills { get; set; } = new();
    public List<string> Domains { get; set; } = new();
    public List<string> Employment { get; set; } = new();
    public List<string> Locations { get; set; } = new();
}
