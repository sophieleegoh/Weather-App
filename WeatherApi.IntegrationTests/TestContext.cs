using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using WeatherApp.Registrations;

namespace WeatherAppSDK.IntegrationTests;

public class TestContext : IAsyncLifetime
{
    private WebApplicationFactory<Program> _factory;
    public const string TestCollection = "ComponentTests";

    public Task InitializeAsync()
    {
        _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseEnvironment("development");
            builder.UseTestServer()
                .ConfigureServices(services =>
                {
                    services.AddClients();
                });
        });
        return Task.CompletedTask;
    }

    public async Task DisposeAsync()
    {
        _factory.Dispose();
    }

    public HttpClient GetClient()
    {
        return _factory.CreateClient();
    }
}

[CollectionDefinition(TestContext.TestCollection)]
public class TestCollection : ICollectionFixture<TestContext>
{

}