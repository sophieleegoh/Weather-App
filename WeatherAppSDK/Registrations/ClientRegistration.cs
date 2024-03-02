using Microsoft.Extensions.DependencyInjection;
using WeatherApp.Clients;

namespace WeatherApp.Registrations;

public static class ClientRegistration
{
    public static void AddClients(this IServiceCollection services)
    {
        services.AddTransient<IOpenWeatherMapClient, OpenWeatherMapClient>();
    }
}
