// src/components/CommentForm.tsx
import React, { useState } from 'react';
import type { Comment } from '../types/comment';
import { useCurrentUser } from '../contexts/CurrentUserContext';

interface Props {
  onAdd: (comment: Comment) => void;
  parentId?: number | null;
}

export function CommentForm({ onAdd, parentId = null }: Props) {
  const { user } = useCurrentUser();
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      parentId,
      content: text,
      createdAt: new Date().toISOString(),
      score: 0,
      user: {
        username: user.username,
        image: {
          png: user.image
        }
      },
      replies: [],
    };

    onAdd(newComment);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        style={{ width: '100%', height: 60, padding: 8 }}
      />
      <button type="submit" style={{ marginTop: 8 }}>
        Post
      </button>
    </form>
  );
} 
