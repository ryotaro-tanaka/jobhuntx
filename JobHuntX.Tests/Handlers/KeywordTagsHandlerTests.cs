using JobHuntX.API.Handlers;
using Microsoft.AspNetCore.Http.HttpResults;
using Xunit;

namespace JobHuntX.Tests.Handlers;

public class KeywordTagsHandlerTests
{
    [Fact]
    public async Task GetKeywordTags_ReturnsOk_WhenFileExistsAndValid()
    {
        // Arrange
        var tempFile = Path.GetTempFileName();
        var json = """
        {
            "roles": ["developer"],
            "skills": ["python"],
            "domains": ["ai"],
            "employment": ["full-time"],
            "locations": ["us"]
        }
        """;
        await File.WriteAllTextAsync(tempFile, json);

        // Act
        var result = await KeywordTagsHandler.GetKeywordTags(tempFile);

        // Assert
        var okResult = Assert.IsType<Ok<JobHuntX.API.Models.KeywordTags>>(result);
        Assert.NotNull(okResult.Value);
        Assert.Contains("developer", okResult.Value!.Roles);

        // Cleanup
        File.Delete(tempFile);
    }

    [Fact]
    public async Task GetKeywordTags_ReturnsNotFound_WhenFileDoesNotExist()
    {
        // Arrange
        var tempFile = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString() + ".json");
        if (File.Exists(tempFile))
            File.Delete(tempFile);

        // Act
        var result = await KeywordTagsHandler.GetKeywordTags(tempFile);

        // Assert
        Assert.IsType<NotFound>(result);
    }

    [Fact]
    public async Task GetKeywordTags_ReturnsProblem_WhenFileIsInvalidJson()
    {
        // Arrange
        var tempFile = Path.GetTempFileName();
        await File.WriteAllTextAsync(tempFile, "{ invalid json }");

        // Act
        var result = await KeywordTagsHandler.GetKeywordTags(tempFile);

        // Assert
        Assert.IsType<ProblemHttpResult>(result);

        // Cleanup
        File.Delete(tempFile);
    }
}