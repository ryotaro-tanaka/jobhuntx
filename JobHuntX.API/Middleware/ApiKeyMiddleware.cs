using Microsoft.AspNetCore.Http;

namespace JobHuntX.API.Middleware;

public class ApiKeyMiddleware {
    private readonly RequestDelegate _next;
    private const string API_KEY_HEADER_NAME = "X-API-KEY";
    private readonly string _configuredApiKey;

    public ApiKeyMiddleware(RequestDelegate next, IConfiguration configuration) {
        _next = next;
        _configuredApiKey = configuration["API_KEY"] ?? throw new ArgumentNullException("API key not configured.");
    }

    public async Task InvokeAsync(HttpContext context) {
        var path = context.Request.Path.Value?.ToLower();

        if (path == null) {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Unauthorized: Invalid request path.");
            return;
        }

        if (path == "/" || path.StartsWith("/swagger")) {
            await _next(context);
            return;
        }

        if (!context.Request.Headers.TryGetValue(API_KEY_HEADER_NAME, out var extractedApiKey) ||
            extractedApiKey != _configuredApiKey) {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Unauthorized: Invalid or missing API Key.");
            return;
        }

        await _next(context);
    }
}
