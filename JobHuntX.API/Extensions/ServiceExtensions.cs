using JobHuntX.API.Handlers;
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

    public static void RegisterHandlers(this IServiceCollection services) {
        services.AddScoped<RemoteOkHandler>();
        services.AddScoped<WeWorkRemotelyRSSHandler>();

        // Register as IJobHandler for AggregateJobHandler
        services.AddScoped<IJobHandler>(sp => sp.GetRequiredService<RemoteOkHandler>());
        services.AddScoped<IJobHandler>(sp => sp.GetRequiredService<WeWorkRemotelyRSSHandler>());

        services.AddScoped<AggregateJobHandler>();
    }
}
