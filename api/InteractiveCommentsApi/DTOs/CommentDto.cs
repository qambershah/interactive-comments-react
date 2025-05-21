namespace InteractiveCommentsApi.DTOs;
public class CommentDto
{
    public int Id { get; set; }
    public UserDto User { get; set; } = new();
    public string Content { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public DateTime CreatedAt { get; set; }
    public int Score { get; set; }
    public List<CommentDto> Replies { get; set; } = new();
}