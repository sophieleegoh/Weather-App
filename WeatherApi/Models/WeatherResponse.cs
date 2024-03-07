using Newtonsoft.Json;

namespace WeatherApp.Models;

public class WeatherResponse
{
    [JsonProperty("description")]
    public List<string> Description { get; set; }
}
