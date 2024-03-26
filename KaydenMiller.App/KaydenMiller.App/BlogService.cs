using System.Net.Http.Json;

namespace KaydenMiller.App;


public class BlogService
{
    private readonly HttpClient _http;

    public BlogService(HttpClient http)
    {
        _http = http;
    }

    public async Task<IEnumerable<BlogEntry>> GetBlogEntryFiles()
    {
        var blogEntries = await _http.GetFromJsonAsync<IEnumerable<BlogEntry>>("blog-entries/blog-entries.json");
        return blogEntries ?? [];
    }

    public async Task<string> GetMarkdownData(string file)
    {
        var markdown = await _http.GetStringAsync($"blog-entries/{file}");
        return markdown;
    }
}