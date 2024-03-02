using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using WeatherApp.Registrations;
using WeatherApp.Routing;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();
builder.Services.AddClients();

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();
app.MapWeatherEndpoints();

app.Run();

public partial class Program { }