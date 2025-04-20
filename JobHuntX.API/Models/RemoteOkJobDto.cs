namespace JobHuntX.API.Models;

public class RemoteOkJobDto
{
    public string Slug { get; set; } = string.Empty;
    public string Id { get; set; } = string.Empty;
    public long Epoch { get; set; }
    public string Date { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string CompanyLogo { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int? SalaryMin { get; set; }
    public int? SalaryMax { get; set; }
    public string ApplyUrl { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}
