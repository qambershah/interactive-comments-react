using InteractiveCommentsApi.Models;

namespace InteractiveCommentsApi.Services;

public interface ICommentService
{
    IEnumerable<Comment> GetAll();
    Comment? GetById(int id);
    void Add(Comment comment);
    bool Update(int id, string newContent);
    bool Delete(int id);
}