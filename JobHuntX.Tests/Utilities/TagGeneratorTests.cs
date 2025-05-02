using JobHuntX.API.Utilities;
using Xunit;

namespace JobHuntX.Tests.Utilities;

public class TagGeneratorTests
{
    [Fact]
    public void ExtractTags_ShouldReturnTags_WhenDescriptionContainsKeywords()
    {
        // Arrange
        var description = "We are looking for a senior developer with experience in Python and AWS.";
        
        // Act
        var tags = TagGenerator.ExtractTags(description);

        // Assert
        Assert.Contains("developer", tags);
        Assert.Contains("senior", tags);
        Assert.Contains("python", tags);
        Assert.Contains("aws", tags);
    }

    [Fact]
    public void ExtractTags_ShouldReturnEmptyList_WhenDescriptionHasNoKeywords()
    {
        // Arrange
        var description = "This is a generic job description with no specific keywords.";

        // Act
        var tags = TagGenerator.ExtractTags(description);

        // Assert
        Assert.Empty(tags);
    }

    [Fact]
    public void ExtractTags_ShouldHandleCaseInsensitivity()
    {
        // Arrange
        var description = "Looking for a PYTHON developer.";

        // Act
        var tags = TagGenerator.ExtractTags(description);

        // Assert
        Assert.Contains("python", tags);
        Assert.Contains("developer", tags);
    }

    [Fact]
    public void ExtractTags_ShouldIgnorePartialMatches()
    {
        // Arrange
        var description = "We need someone with expertise in developing solutions.";

        // Act
        var tags = TagGenerator.ExtractTags(description);

        // Assert
        Assert.DoesNotContain("developer", tags);
    }
}
