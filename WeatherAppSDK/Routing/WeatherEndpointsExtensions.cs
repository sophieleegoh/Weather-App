using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Newtonsoft.Json;
using WeatherApp.Clients;
using WeatherApp.Models;

namespace WeatherApp.Routing;

public static class WeatherEndpointsExtensions
{
    public static void MapWeatherEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("weather", async ([FromServices] IOpenWeatherMapClient openWeatherMapClient, [FromQuery] string country, [FromQuery] string city) =>
        {
            var result = await openWeatherMapClient.GetWeatherDescription(country, city);
                
            return new WeatherResponse
            {
                Description = result.Weather.Select(x => x.Description).ToList()
            };
            }).Produces<WeatherResponse>();
    }
}
