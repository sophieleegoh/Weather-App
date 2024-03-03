using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using WeatherApp.Constants;

namespace WeatherApp.Authentication;

public class ApiKeyAuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public ApiKeyAuthMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Headers.TryGetValue(ApiKeyConstants.ApiKeyHeaderName, out var extractedApiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Api key missing");
            return;
        }
        
        var apiKeys = _configuration.GetSection(ApiKeyConstants.ApiKeyName).Get<List<string>>();
        // var apiKeys = new List<string> { "123", "321" };
        if (!apiKeys.Contains(extractedApiKey))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Invalid api key");
            return;
        }
        await _next(context);
    }
}