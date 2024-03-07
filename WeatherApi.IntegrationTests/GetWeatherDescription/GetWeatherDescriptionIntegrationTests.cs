using System.Net;
using FluentAssertions;

namespace WeatherAppSDK.IntegrationTests.GetWeatherDescription
{
    [Collection(TestContext.TestCollection)]
    public class GetWeatherDescriptionIntegrationTests
    {
        private readonly TestContext _context;
        private readonly HttpClient _client;
        
        public GetWeatherDescriptionIntegrationTests(TestContext context)
        {
            _context = context; 
            _client = context.GetClient();
            _client.DefaultRequestHeaders.Add("API-KEY", Environment.GetEnvironmentVariable("ApiKeys__0"));
        }

        [Fact]
        public async Task GivenValidInput_WhenGetWeatherDescription_ThenReturnExpectedResult()
        {
            // Arrange
            var city = "Melbourne";
            var country = "Au";

            // Act
            var response = await _client.GetAsync($"weather?country={country}&city={city}");

            // Assert
            response.EnsureSuccessStatusCode();
        }
        
        [Fact]
        public async Task GivenNoCity_WhenGetWeatherDescription_ThenReturnBadRequest()
        {
            // Arrange
            var city = string.Empty;
            var country = "Au";

            // Act
            var response = await _client.GetAsync($"weather?country={country}&city={city}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }
        
        [Fact]
        public async Task GivenCityNotFoundInCountryProvided_WhenGetWeatherDescription_ThenReturnNotFound()
        {
            // Arrange
            var city = "Paris";
            var country = "Au";

            // Act
            var response = await _client.GetAsync($"weather?country={country}&city={city}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
        
        [Fact]
        public async Task GivenOver5CallsIn1Hour_WhenGetWeatherDescription_ThenReturnHttpStatusCode429TooManyRequests()
        {
            // Arrange 
            
            // Change the Api key to a separate one so that when the API key limit has been exhausted, it shouldn't impact
            // other integration tests
            _client.DefaultRequestHeaders.Remove("API-KEY");
            _client.DefaultRequestHeaders.Add("API-KEY", Environment.GetEnvironmentVariable("ApiKeys__1"));
            
            // Act
            for (int ii = 0; ii < 5; ii++)
            {
                await _client.GetAsync("weather?country=au&city=melbourne");
            }
            var response6 = await _client.GetAsync("weather?country=au&city=melbourne");

            // Assert
            response6.StatusCode.Should().Be(HttpStatusCode.TooManyRequests);
        }
        
        [Fact]
        public async Task GivenUnauthorisedUser_WhenGetWeatherDescription_ThenReturnHttpStatusCode401Unauthorised()
        {
            // Arrange 
            var unauthenticatedClient = _context.GetClient();
            
            // Act
            var response6 = await unauthenticatedClient.GetAsync("weather?country=au&city=melbourne");

            // Assert
            response6.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}