import { useEffect, useState } from "react";
import type { Comment } from "../types/comment";

// const API_URL = "http://localhost:5000/api/Comments";
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: {
          "x-api-key": API_KEY
        }
      });
      if (!res.ok) throw new Error("Failed to fetch comments.");
      const json = await res.json();
      setComments(json); // Adjust if your API wraps data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Add comment/reply
  const addComment = async (newComment: Partial<Comment>) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error("Failed to add comment.");
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment.");
    }
  };

  // Update comment
  const updateComment = async (id: number, updatedContent: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ content: updatedContent }),
      });
      if (!res.ok) throw new Error("Failed to update comment.");
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update comment.");
    }
  };

  // Delete comment
  const deleteComment = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });
      if (!res.ok) throw new Error("Failed to delete comment.");
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comment.");
    }
  };

  // Vote (increment/decrement score)
  const voteComment = async (id: number, delta: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}/vote`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ delta }),
      });
      if (!res.ok) throw new Error("Failed to vote on comment.");
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to vote.");
    }
  };

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    voteComment,
    refetch: fetchComments,
  };
};