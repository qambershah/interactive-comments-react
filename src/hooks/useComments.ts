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
        setComments(sortByScore(normalised));
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
    setComments(prev => sortByScore([...prev, newComment]));
  };

  // Update a comment
  const updateComment = (id: number, updatedContent: string) => {
    const updateRecursive = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === id) {
          return { ...comment, content: updatedContent };
        }

        return {
          ...comment,
          replies: comment.replies ? updateRecursive(comment.replies) : [],
        };
      });
    };

    setComments(prev => sortByScore(updateRecursive(prev)));
  };

  const deleteRecursive = (comments: Comment[], id: number): Comment[] => {
    return comments
      .filter(comment => comment.id !== id)
      .map(comment => ({
        ...comment,
        replies: deleteRecursive(comment.replies ?? [], id),
      }));
  };

  const deleteComment = (id: number) => {
    setComments(prev => sortByScore(deleteRecursive(prev, id)));
  };

  const sortByScore = (comments: Comment[]): Comment[] => {
    return comments
      .map(comment => ({
        ...comment,
        replies: sortByScore(comment.replies ?? []),
      }))
      .sort((a, b) => b.score - a.score);
  };

  const voteComment = (id: number, delta: number) => {
    const voteRecursive = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === id) {
          return { ...comment, score: comment.score + delta };
        }
        return { ...comment, replies: voteRecursive(comment.replies ?? []) };
      });
    };

    setComments(prev => sortByScore(voteRecursive(prev)));
  };

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    voteComment
  };
};
