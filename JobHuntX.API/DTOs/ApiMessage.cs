public enum ApiMessageType {
    Success,
    Info,
    Warning,
    Error
}

public class ApiMessage {
    public ApiMessageType Type { get; set; } = ApiMessageType.Success;
    public string Text { get; set; } = "";
}
