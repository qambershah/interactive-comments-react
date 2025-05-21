using InteractiveCommentsApi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;
using DefaultNamespace;
using InteractiveCommentsApi.DTOs;
using InteractiveCommentsApi.Mappers;
using InteractiveCommentsApi.Services;

namespace InteractiveCommentsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;
    private readonly HtmlEncoder _htmlEncoder;

    public CommentsController(ICommentService commentService, HtmlEncoder htmlEncoder)
    {
        _commentService = commentService;
        _htmlEncoder = htmlEncoder;
    }

    /// <summary>
    /// Retrieves all comments.
    /// </summary>
    /// <returns>A list of CommentDto objects representing all comments.</returns>
    [HttpGet]
    public ActionResult<IEnumerable<CommentDto>> Get()
    {
        // Use CommentMapper to convert to DTOs
        var comments = _commentService.GetAll()
            .Select(CommentMapper.ToDto)
            .ToList();
        return Ok(comments);
    }
    
    [HttpGet("{id}")]
    public ActionResult<CommentDto> GetById(int id)
    {
        var comment = _commentService.GetById(id);
        if (comment == null) return NotFound();
        return Ok(CommentMapper.ToDto(comment));
    }

    /// <summary>
    /// Creates a new comment.
    /// </summary>
    /// <param name="dto">The DTO containing the content and author of the new comment.</param>
    /// <returns>The created comment as a CommentDto with a 201 Created response.</returns>
    [HttpPost]
    public IActionResult Post([FromBody] CreateCommentDto dto)
    {
        // Sanitize the content to prevent HTML/script injection attacks
        var sanitizedContent = _htmlEncoder.Encode(dto.Content);
        var sanitizedDto = new CreateCommentDto
        {
            User = dto.User,
            Content = sanitizedContent,
            ParentId = dto.ParentId
        };
        // Use CommentMapper to create Comment entity
        var comment = CommentMapper.FromCreateDto(sanitizedDto);
        comment.CreatedAt = DateTime.UtcNow;
        // Add the new comment to the data store via the service
        _commentService.Add(comment);
        // Use CommentMapper to convert to DTO
        var resultDto = CommentMapper.ToDto(comment);
        // Return a 201 Created response with the location of the new resource
        return CreatedAtAction(nameof(GetById), new { id = comment.Id }, resultDto);
    }

    /// <summary>
    /// Updates the content of an existing comment.
    /// </summary>
    /// <param name="id">The ID of the comment to update.</param>
    /// <param name="dto">The DTO containing the updated content.</param>
    /// <returns>No content on successful update.</returns>
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] UpdateCommentDto dto)
    {
        // Sanitize the updated content to prevent HTML/script injection
        var sanitizedContent = _htmlEncoder.Encode(dto.Content);

        // Update the comment content via the service
        var success = _commentService.Update(id, sanitizedContent);
        if (!success) return NotFound();
        // Return 204 No Content to indicate successful update without returning data
        return NoContent();
    }

    /// <summary>
    /// Deletes a comment by its ID.
    /// </summary>
    /// <param name="id">The ID of the comment to delete.</param>
    /// <returns>No content on successful deletion.</returns>
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        // Remove the comment from the data store via the service
        var deleted = _commentService.Delete(id);
        if (!deleted) return NotFound();

        // Return 204 No Content to indicate successful deletion
        return NoContent();
    }
    
    /// <summary>
    /// Updates the score (vote) of a comment.
    /// </summary>
    /// <param name="id">The ID of the comment.</param>
    /// <param name="delta">Vote value (e.g., +1 or -1).</param>
    [HttpPatch("{id}/vote")]
    public IActionResult Vote(int id, [FromBody] VoteCommentDto dto)
    {
        var comment = _commentService.GetById(id);
        if (comment == null) return NotFound();

        comment.Score += dto.Delta;
        // Optionally persist change if you add a real DB later
        return Ok(CommentMapper.ToDto(comment));
    }
}

