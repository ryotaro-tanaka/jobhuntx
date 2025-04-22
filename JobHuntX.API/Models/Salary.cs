namespace JobHuntX.API.Models;

public class Salary {
    public string CurrencyCode { get; set; } = "AUD"; // ISO 4217 currency code
    public decimal? Min { get; set; }
    public decimal? Max { get; set; }
    public SalaryTimeUnit TimeUnit { get; set; } = SalaryTimeUnit.Year;

    // 換算用プロパティ（内部利用）
    public decimal? ConvertedMin { get; set; }
    public decimal? ConvertedMax { get; set; }
    public string BaseCurrencyCode { get; set; } = "AUD";
    public DateTime? ExchangeRateUpdatedAt { get; set; }
}

public enum SalaryTimeUnit {
    Year,
    Month,
    Week,
    Day,
    Hour
}
