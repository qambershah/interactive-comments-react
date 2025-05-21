using System.ComponentModel.DataAnnotations;

namespace InteractiveCommentsApi.DTOs;

public class CreateCommentDto
{
    [Required]
    public UserDto User { get; set; } = new();

    [Required]
    [StringLength(500, MinimumLength = 1)]
    public string Content { get; set; } = string.Empty;

    public int? ParentId { get; set; }
}