using System.Net;

namespace WeatherApp.Exceptions;

public class ExternalRequestException : Exception
{
    public HttpStatusCode StatusCode { get; }

    public ExternalRequestException(HttpStatusCode statusCode, string message) : base(message)
    {
        StatusCode = statusCode;
    }
}
