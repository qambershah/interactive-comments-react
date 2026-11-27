using DefaultNamespace;
using InteractiveCommentsApi.Controllers;
using InteractiveCommentsApi.DTOs;
using InteractiveCommentsApi.Models;
using InteractiveCommentsApi.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using Xunit;

namespace InteractiveCommentsApi.Tests;

public class CommentsControllerTests
{
    [Fact]
    public void Post_StoresContentAsWritten()
    {
        var service = CreateService();
        var controller = new CommentsController(service);
        var request = new CreateCommentDto
        {
            Content = "<b>Hello</b> — it's \"fine\" & done",
            User = new UserDto { Username = "tester", Image = "/avatar.png" }
        };

        var result = Assert.IsType<CreatedAtActionResult>(controller.Post(request));
        var response = Assert.IsType<CommentDto>(result.Value);

        Assert.Equal(request.Content, response.Content);
        Assert.Equal(request.Content, service.GetById(response.Id)?.Content);
    }

    [Fact]
    public void Put_RepeatedEditsDoNotChangeTheText()
    {
        // Regression: content was HTML-encoded on every save, so "—" became "&#x2014;"
        // and then "&amp;#x2014;" as the same text was edited again.
        const string text = "Hooks, signals, server rendering — master them & <share> what you learn.";
        var service = CreateService();
        service.Add(NewComment("Original"));
        var controller = new CommentsController(service);

        for (var i = 0; i < 3; i++)
        {
            var current = service.GetById(1)!.Content;
            controller.Put(1, new UpdateCommentDto { Content = i == 0 ? text : current });
        }

        var result = Assert.IsType<OkObjectResult>(controller.Put(1, new UpdateCommentDto { Content = text }));
        Assert.Equal(text, Assert.IsType<CommentDto>(result.Value).Content);
        Assert.Equal(text, service.GetById(1)?.Content);
    }

    [Fact]
    public void Delete_RemovesCommentAndItsReplies()
    {
        var service = CreateService();
        service.Add(NewComment("Parent"));
        service.Add(NewComment("Reply", parentId: 1));
        var controller = new CommentsController(service);

        var result = controller.Delete(1);

        Assert.IsType<NoContentResult>(result);
        Assert.Empty(service.GetAll());
    }

    [Fact]
    public void Vote_AdjustsCommentScore()
    {
        var service = CreateService();
        service.Add(NewComment("Vote target"));
        var controller = new CommentsController(service);

        var result = Assert.IsType<OkObjectResult>(controller.Vote(1, new VoteCommentDto { Delta = 1 }));
        var response = Assert.IsType<CommentDto>(result.Value);

        Assert.Equal(1, response.Score);
    }

    [Fact]
    public void GetById_ReturnsNotFoundForMissingComment()
    {
        var controller = new CommentsController(CreateService());

        var result = controller.GetById(404);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    private static CommentService CreateService()
    {
        var environment = new TestWebHostEnvironment
        {
            ContentRootPath = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N"))
        };

        return new CommentService(environment);
    }

    private static Comment NewComment(string content, int? parentId = null) => new()
    {
        Content = content,
        ParentId = parentId,
        User = new User { Username = "tester", Image = "/avatar.png" }
    };

    private sealed class TestWebHostEnvironment : IWebHostEnvironment
    {
        public string ApplicationName { get; set; } = nameof(InteractiveCommentsApi);
        public IFileProvider WebRootFileProvider { get; set; } = new NullFileProvider();
        public string WebRootPath { get; set; } = string.Empty;
        public string EnvironmentName { get; set; } = "Development";
        public string ContentRootPath { get; set; } = string.Empty;
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
    }
}
