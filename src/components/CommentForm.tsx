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
    <form
  onSubmit={handleSubmit}
  style={{
    display: 'flex',
    gap: 16,
    padding: 20,
    background: '#161b22',
    borderRadius: 12,
    border: '1px solid #30363d',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px #0002',
    alignItems: 'flex-start', // Avatar + online indicator stays top-aligned with textarea
  }}
>
  <div style={{ position: 'relative', width: 52, minWidth: 52 }}>
    <img
      src={user.image}
      alt="avatar"
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        objectFit: "cover",
        border: "2.5px solid #3fb950",
        background: '#222',
      }}
    />
    <span
      style={{
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: '#3fb950',
        border: '2.5px solid #161b22',
        boxShadow: '0 0 0 2px #161b22',
      }}
      title="Online"
    ></span>
  </div>
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder={`Share your wisdom, ${user.username}...`}
      style={{
        width: '100%',
        minHeight: 100,
        padding: 12,
        background: '#0d1117',
        color: '#c9d1d9',
        border: '1px solid #30363d',
        borderRadius: 6,
        fontSize: 14,
        marginBottom: 12,
        resize: 'vertical',
        boxSizing: 'border-box',
      }}
    />
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button
        type="submit"
        disabled={!text.trim()}
        style={{
          background: '#238636',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '10px 28px',
          fontWeight: 600,
          fontSize: 16,
          cursor: text.trim() ? 'pointer' : 'not-allowed',
          opacity: text.trim() ? 1 : 0.6,
          marginTop: 0,
        }}
      >
        Post
      </button>
    </div>
  </div>
</form>
  );
} 
