using JobHuntX.API.Models;

public class JobListResponse {
    public bool IsSuccess { get; set; } = true;
    public int TotalCount { get; set; }
    public List<Job> Jobs { get; set; } = new();
    public List<ApiMessage> Messages { get; set; } = new();
}
