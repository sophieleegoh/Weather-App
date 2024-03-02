using System.Net;
using FluentAssertions;

namespace WeatherAppSDK.IntegrationTests.GetWeatherDescription
{
    [Collection(TestContext.TestCollection)]
    public class GetWeatherDescriptionIntegrationTests
    {
        private readonly HttpClient _client;


        public GetWeatherDescriptionIntegrationTests(TestContext context)
        {
            _client = context.GetClient();
        }

        [Fact]
        public async Task GivenValidInput_WhenGetWeatherDescription_ThenReturnExpectedResult()
        {
            // Arrange
            var city = "Melbourne";
            var country = "Australia";

            // Act
            var response = await _client.GetAsync($"weather?country={country}&city={city}");

            // Assert
            response.EnsureSuccessStatusCode();
        }
        
        [Fact]
        public async Task GivenOver5CallsIn1Hour_WhenGetWeatherDescription_ThenReturnHttpStatusCode429TooManyRequests()
        {
            // Act
            await _client.GetAsync("weather?country=australia&city=melbourne");
            await _client.GetAsync("weather?country=australia&city=melbourne");
            await _client.GetAsync("weather?country=australia&city=melbourne");
            await _client.GetAsync("weather?country=australia&city=melbourne");
            await _client.GetAsync("weather?country=australia&city=melbourne");
            var response6 = await _client.GetAsync("weather?country=australia&city=melbourne");

            // Assert
            response6.StatusCode.Should().Be(HttpStatusCode.TooManyRequests);
        }
    }
}