import { useEffect, useState } from "react";
import type { Comment } from "../types/comment";

// const DATA_URL = "/comments.json"; -- Do this for dev
const DATA_URL = `${import.meta.env.BASE_URL}comments.json`;

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error("Failed to fetch comments.");
        const json = await res.json();

        const normalised = json.comments.map((c: Comment) => ({
          ...c,
          replies: c.replies ?? [],
        }));
        setComments(normalised);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, []);

  // Add a new comment
  const addComment = (newComment: Comment) => {
    setComments(prev => [...prev, newComment]);
  };

  // Update a comment
  const updateComment = (id: number, updatedContent: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === id ? { ...comment, content: updatedContent } : comment
      )
    );
  };

  // Delete a comment
  const deleteComment = (id: number) => {
    setComments(prev => prev.filter(comment => comment.id !== id));
  };

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
  };
};
