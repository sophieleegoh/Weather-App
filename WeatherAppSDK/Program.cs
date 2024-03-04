using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using WeatherApp.Authentication;
using WeatherApp.Constants;
using WeatherApp.Registrations;
using WeatherApp.Routing;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:3000").AllowAnyHeader();
        });
});

builder.Services.AddHttpClient();
builder.Services.AddClients();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddRateLimiter(rateLimiterOptions =>
{
    rateLimiterOptions.AddPolicy("fixed-by-api-key", httpContext =>
    {
        httpContext.Request.Headers.TryGetValue(ApiKeyConstants.ApiKeyHeaderName,
            out var extractedApiKey);
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: extractedApiKey,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1)
            }
        );
    });
    rateLimiterOptions.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

builder.Services.AddSwaggerGen(x =>
{
    x.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        Description = "The api key to access the api",
        Type = SecuritySchemeType.ApiKey,
        Name = "API-KEY",
        In = ParameterLocation.Header,
        Scheme = "ApiKeyScheme"
    });
    var scheme = new OpenApiSecurityScheme
    {
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "ApiKey"
        },
        In = ParameterLocation.Header
    };
    var requirement = new OpenApiSecurityRequirement
    {
        { scheme, new List<string>() }
    };
    x.AddSecurityRequirement(requirement);
});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors();

app.UseSwagger();
app.UseSwaggerUI();
app.MapSwagger();

app.UseMiddleware<ApiKeyAuthMiddleware>();
app.UseAuthorization();

app.MapWeatherEndpoints();
app.UseRateLimiter();
app.Run();

public partial class Program { }