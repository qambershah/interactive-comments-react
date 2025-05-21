using InteractiveCommentsApi.DTOs;
using InteractiveCommentsApi.Models;

namespace InteractiveCommentsApi.Mappers;

public static class CommentMapper
{
    public static CommentDto ToDto(Comment comment)
    {
        return new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content ?? "",
            ParentId = comment.ParentId,
            CreatedAt = comment.CreatedAt,
            User = comment.User == null 
                ? new UserDto() 
                : new UserDto { Username = comment.User.Username, Image = comment.User.Image },
            Replies = comment.Replies?.Select(ToDto).ToList() ?? new List<CommentDto>(),
            Score = comment.Score,
        };
    }

    public static Comment FromCreateDto(CreateCommentDto dto)
    {
        return new Comment
        {
            Content = dto.Content,
            ParentId = dto.ParentId,
            CreatedAt = DateTime.UtcNow,
            Score = 0,
            User = dto.User == null 
                ? new User() 
                : new User { Username = dto.User.Username, Image = dto.User.Image }
        };
    }
}