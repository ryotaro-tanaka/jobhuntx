using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace JobHuntX.API.Utilities;

public static class ErrorHandler
{
    private static readonly ILogger _logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger("ErrorHandler");

    public static async Task<IResult> WrapAsync(Func<Task<IResult>> action)
    {
        try
        {
            return await action();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred.");
            return Results.Problem("An unexpected error occurred.");
        }
    }
}
