using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using WeatherApp.Clients;
using WeatherApp.Exceptions;
using WeatherApp.Models;

namespace WeatherApp.Routing;

public static class WeatherEndpointsExtensions
{
    public static void MapWeatherEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("weather", async (
                [FromServices] IOpenWeatherMapClient openWeatherMapClient, 
                [FromQuery] string country, 
                [FromQuery] string city) =>
            {
                try
                {
                    var result = await openWeatherMapClient.GetWeatherDescription(country, city);

                    return Results.Ok(new WeatherResponse
                    {
                        Description = result.Weather.Select(x => x.Description).ToList()
                    });
                }
                catch (ExternalRequestException e)
                {
                    return Results.Problem(statusCode: (int)e.StatusCode);
                }
            })
            .RequireRateLimiting("fixed-by-api-key")
            .RequireCors()
            .Produces<WeatherResponse>();
    }
}
