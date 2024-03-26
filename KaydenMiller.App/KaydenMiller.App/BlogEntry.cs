using System.Text.Json.Serialization;

namespace KaydenMiller.App;

public class BlogEntry
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;

    [JsonPropertyName("description")]
    public string Description { get; set; } = default!;

    [JsonPropertyName("publishDate")]
    public DateTime PublishDate { get; set; } = default!;

    [JsonPropertyName("fileName")]
    public string FileName { get; set; } = default!;
}