namespace JobHuntX.API.Models;

public class Location {
    public LocationType Type { get; set; } // Limited to Remote, Hybrid, Onsite
    public string? City { get; set; } // e.g., "Sydney"
    public string? Country { get; set; } // e.g., "Australia"
}

public enum LocationType {
    Remote,  // リモート
    Hybrid,  // ハイブリッド
    Onsite   // オンサイト
}
