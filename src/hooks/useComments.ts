import { useCallback, useEffect, useState } from 'react';
import type { Comment } from '../types/comment';
import { removeCommentAndReplies, replaceComment, sortCommentsByScore } from '../utils/commentState';

const API_KEY = import.meta.env.VITE_API_KEY;

function getApiUrl() {
  const apiUrl = import.meta.env.VITE_API_URL?.trim();
  if (!apiUrl) {
    throw new Error('Comments API is not configured. Set VITE_API_URL in your .env file.');
  }

  return apiUrl.replace(/\/+$/, '');
}

function getHeaders(includeJson = false): HeadersInit {
  return {
    ...(includeJson ? { 'Content-Type': 'application/json' } : {}),
    ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
  };
}

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async (signal?: AbortSignal, showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl(), {
        headers: getHeaders(),
        signal,
      });
      if (!response.ok) throw new Error('Failed to fetch comments.');
      setComments(await response.json() as Comment[]);
    } catch (err) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err.message : 'Unknown error occurred.');
    } finally {
      if (showLoading && !signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => fetchComments(controller.signal, true));
    return () => controller.abort();
  }, [fetchComments]);

  const addComment = async (newComment: Partial<Comment>) => {
    setError(null);
    try {
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(newComment),
      });
      if (!response.ok) throw new Error('Failed to add comment.');
      const createdComment = await response.json() as Comment;
      setComments(current => [...current, createdComment]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment.');
    }
  };

  const updateComment = async (id: number, updatedContent: string) => {
    setError(null);
    try {
      const response = await fetch(`${getApiUrl()}/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ content: updatedContent }),
      });
      if (!response.ok) throw new Error('Failed to update comment.');
      const updatedComment = await response.json() as Comment;
      setComments(current => replaceComment(current, updatedComment));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comment.');
    }
  };

  const deleteComment = async (id: number) => {
    setError(null);
    try {
      const response = await fetch(`${getApiUrl()}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete comment.');
      setComments(current => removeCommentAndReplies(current, id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment.');
    }
  };

  const voteComment = async (id: number, delta: number) => {
    setError(null);
    try {
      const response = await fetch(`${getApiUrl()}/${id}/vote`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify({ delta }),
      });
      if (!response.ok) throw new Error('Failed to vote on comment.');
      const updatedComment = await response.json() as Comment;
      setComments(current => sortCommentsByScore(replaceComment(current, updatedComment)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote.');
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
