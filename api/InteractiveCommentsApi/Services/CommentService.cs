using System.Text.Encodings.Web;
using System.Text.Json;
using DefaultNamespace;
using InteractiveCommentsApi.Models;

namespace InteractiveCommentsApi.Services;

public class CommentService : ICommentService
{
    private readonly List<Comment> _comments = new();
    private readonly HtmlEncoder _htmlEncoder;
    private readonly object _lock = new();

    public CommentService(HtmlEncoder htmlEncoder, IWebHostEnvironment env)
    {
        _htmlEncoder = htmlEncoder;
        
        var jsonPath = Path.Combine(env.ContentRootPath, "Seed", "comments.json");
        if (File.Exists(jsonPath))
        {
            var json = File.ReadAllText(jsonPath);
            var seed = JsonSerializer.Deserialize<SeedData>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            _comments = seed?.Comments ?? new List<Comment>();
        }
        else
        {
            _comments = new List<Comment>();
        }
    }

    public IEnumerable<Comment> GetAll()
    {
        lock (_lock)
        {
            return _comments.OrderByDescending(c => c.Score).ToList();
        }
    }

    public IEnumerable<Comment> GetThread()
    {
        lock (_lock)
        {
            var lookup = _comments.ToLookup(c => c.ParentId);
            List<Comment> BuildThread(int? parentId) =>
                lookup[parentId]
                    .Select(c => { c.Replies = BuildThread(c.Id); return c; })
                    .ToList();
            return BuildThread(null);
        }
    }

    public Comment? GetById(int id)
    {
        lock (_lock)
        {
            return _comments.FirstOrDefault(c => c.Id == id);
        }
    }

    public void Add(Comment comment)
    {
        if (string.IsNullOrWhiteSpace(comment.Content))
            throw new ArgumentException("Content cannot be empty.");

        comment.Content = _htmlEncoder.Encode(comment.Content);

        lock (_lock)
        {
            // Simple Id generation (you might want to use a better approach)
            comment.Id = _comments.Count == 0 ? 1 : _comments.Max(c => c.Id) + 1;
            _comments.Add(comment);
        }
    }

    public bool Update(int id, string newContent)
    {
        lock (_lock)
        {
            var comment = GetById(id);
            if (comment != null)
            {
                comment.Content = _htmlEncoder.Encode(newContent);
                return true;
            }
            return false;
        }
    }

    public bool Delete(int id)
    {
        lock (_lock)
        {
            var exists = _comments.Any(c => c.Id == id);
            if (!exists) return false;
            DeleteRecursive(id);
            return true;
        }
    }

    private void DeleteRecursive(int id)
    {
        var toDelete = _comments.Where(c => c.ParentId == id).Select(c => c.Id).ToList();
        foreach (var childId in toDelete)
        {
            DeleteRecursive(childId);
        }
        _comments.RemoveAll(c => c.Id == id);
    }
}