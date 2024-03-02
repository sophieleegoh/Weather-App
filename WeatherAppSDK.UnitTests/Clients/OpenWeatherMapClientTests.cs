using System.Net;
using FluentAssertions;
using Moq;
using Moq.Protected;
using Newtonsoft.Json;
using WeatherApp.Clients;
using WeatherApp.Exceptions;
using WeatherApp.Models;

namespace WeatherAppSDK.UnitTests.Clients;

public class OpenWeatherMapClientTests
{
    private readonly OpenWeatherMapClient _openWeatherMapClient;
    private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler; 
    
    public OpenWeatherMapClientTests()
    {
        _mockHttpMessageHandler = new Mock<HttpMessageHandler>();
        
        var httpClient = new HttpClient(_mockHttpMessageHandler.Object);
        var mockHttpClientFactory = new Mock<IHttpClientFactory>();
        mockHttpClientFactory.Setup(x => x.CreateClient(It.IsAny<string>())).Returns(httpClient);
        
        _openWeatherMapClient = new OpenWeatherMapClient(mockHttpClientFactory.Object);
    }
    
    [Fact]
    public async Task GivenValidCountryAndValidCity_WhenGetWeatherDescription_ThenReturnWeatherDescription()
    {
        // Arrange 
        var city = "Melbourne";
        var country = "Australia";
        var expectedResult = new OpenWeatherMapResponse
            { Weather = new List<Weather> { new() { Description = "moderate rain" } } };

        _mockHttpMessageHandler
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(m =>
                    m.Method == HttpMethod.Get && m.RequestUri.AbsoluteUri ==
                    $"http://api.openweathermap.org/data/2.5/weather?q={city},{country}&appid={Environment.GetEnvironmentVariable("OPEN_WEATHER_MAP_API_KEY")}"),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(JsonConvert.SerializeObject(expectedResult))
            });
        
        // Act 
        var result = await _openWeatherMapClient.GetWeatherDescription(country, city);

        // Assert
        result.Should().BeEquivalentTo(expectedResult);
    }
    
    [Fact]
    public async Task GivenInvalidCountryAndInvalidCity_WhenGetWeatherDescription_ThenReturnWeatherDescription()
    {
        // Arrange 
        var city = "madeup";
        var country = "fake";
    
        _mockHttpMessageHandler
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.Is<HttpRequestMessage>(m =>
                    m.Method == HttpMethod.Get && m.RequestUri.AbsoluteUri ==
                    $"http://api.openweathermap.org/data/2.5/weather?q={city},{country}&appid={Environment.GetEnvironmentVariable("OPEN_WEATHER_MAP_API_KEY")}"),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.NotFound
            });
        
        // Act 
        Func<Task> act = async () => await _openWeatherMapClient.GetWeatherDescription(country, city);
    
        // Assert
        await act.Should().ThrowAsync<ExternalRequestException>().WithMessage("Request to OpenWeatherMap failed");
    }
}
