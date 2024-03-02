using WeatherApp.Models;

namespace WeatherApp.Clients;

public interface IOpenWeatherMapClient
{
    Task<OpenWeatherMapResponse?> GetWeatherDescription(string country, string city);
}
