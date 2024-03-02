using Newtonsoft.Json;

namespace WeatherApp.Models;

public class OpenWeatherMapResponse
{
    [JsonProperty("weather")]
    public List<Weather> Weather { get; set; }
}

public class Weather
{
    [JsonProperty("description")]
    public string Description { get; set; }
}
