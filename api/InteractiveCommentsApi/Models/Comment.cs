namespace InteractiveCommentsApi.Models;

public class Comment
{
    public int Id { get; set; }
    public User? User { get; set; }
    public string? Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public int Score { get; set; }
    public int? ParentId { get; set; }
    public List<Comment> Replies { get; set; } = new();
}