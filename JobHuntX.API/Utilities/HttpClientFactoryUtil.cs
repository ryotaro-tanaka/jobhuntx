using System.Net;

namespace JobHuntX.API.Utilities;

public static class HttpClientFactoryUtil
{
    public static HttpClient CreateHttpClientWithHeaders()
    {
        var handler = new HttpClientHandler
        {
            UseCookies = true,
            CookieContainer = new CookieContainer(),
            AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate | DecompressionMethods.Brotli
        };
        var httpClient = new HttpClient(handler);
        httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36");
        httpClient.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8");
        httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-US,en;q=0.9");
        httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
        httpClient.DefaultRequestHeaders.Add("Connection", "keep-alive");
        httpClient.DefaultRequestHeaders.Add("Upgrade-Insecure-Requests", "1");
        httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Dest", "document");
        httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Mode", "navigate");
        httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Site", "none");
        httpClient.DefaultRequestHeaders.Add("Sec-Fetch-User", "?1");
        return httpClient;
    }
}