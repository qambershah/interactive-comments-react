using System.ComponentModel.DataAnnotations;

namespace DefaultNamespace;
public class UpdateCommentDto
{
    [Required]
    [StringLength(500, MinimumLength = 1)]
    public string Content { get; set; } = string.Empty;
}