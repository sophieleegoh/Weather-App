using Newtonsoft.Json;
using WeatherApp.Exceptions;
using WeatherApp.Models;

namespace WeatherApp.Clients;

public class OpenWeatherMapClient : IOpenWeatherMapClient
{
    private readonly HttpClient _httpClient;
    
    public OpenWeatherMapClient(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    public async Task<OpenWeatherMapResponse?> GetWeatherDescription(string country, string city)
    {
        var response = await _httpClient.GetAsync(
                $"http://api.openweathermap.org/data/2.5/weather?q={city},{country}&appid={Environment.GetEnvironmentVariable("OPEN_WEATHER_MAP_API_KEY")}");
        if (!response.IsSuccessStatusCode)
        {
            throw new ExternalRequestException(response.StatusCode, "Request to OpenWeatherMap failed");
        }
            
        return JsonConvert.DeserializeObject<OpenWeatherMapResponse>(await response.Content.ReadAsStringAsync());
    }
}
