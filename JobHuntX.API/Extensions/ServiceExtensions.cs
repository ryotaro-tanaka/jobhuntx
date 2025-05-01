using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace JobHuntX.API.Extensions;
public static class ServiceExtensions {
    public static void ConfigureCors(this IServiceCollection services, IConfiguration configuration) {
        var allowedOrigins = configuration.GetSection("AllowedOrigins").Get<string[]>();
        if (allowedOrigins == null || !allowedOrigins.Any()) {
            throw new InvalidOperationException("AllowedOrigins is not configured.");
        }

        services.AddCors(options => {
            options.AddDefaultPolicy(policy => {
                policy.WithOrigins(allowedOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
            });
        });
    }
}
