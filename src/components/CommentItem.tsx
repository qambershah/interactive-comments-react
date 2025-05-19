import { useState } from 'react';
import type { Comment as CommentType } from '../types/comment';
import { CommentForm } from './CommentForm';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  comment: CommentType;
  depth?: number;
  onReply: (reply: CommentType) => void;
  onEdit: (id: number, updatedContent: string) => void;
  onDelete: (id: number) => void;
  onVote: (id: number, delta: number) => void;
}

export function CommentItem({
  comment,
  depth = 0,
  onReply,
  onEdit,
  onDelete,
  onVote,
}: Props) {
  const [replying, setReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.content);
  const { user } = useCurrentUser();
  const isCurrentUser = user.username === comment.user.username;

  return (
    <div
      style={{
        marginLeft: depth * 24,
        marginBottom: '1rem',
        padding: '1rem',
        border: '1px solid #30363d',
        borderRadius: '10px',
        background: '#161b22', // GitHub card background
        color: '#c9d1d9',      // Main text color
        boxShadow: '0 1px 2px rgba(20,23,28,0.10)',
        transition: 'background 0.2s'
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#21262d')}
      onMouseLeave={e => (e.currentTarget.style.background = '#161b22')}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ position: 'relative', marginRight: 12 }}>
          <img
            src={comment.user.image.png}
            alt={comment.user.username}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              border: isCurrentUser ? "2px solid #3fb950" : "2px solid #30363d",
              background: "#0d1117"
            }}
          />
          {isCurrentUser && (
            <span
              title="You are online"
              style={{
                position: 'absolute',
                bottom: 3,
                right: 3,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#3fb950',
                border: '2px solid #161b22'
              }}
            />
          )}
        </div>
        <strong style={{ marginRight: 8, color: '#c9d1d9' }}>
          {isCurrentUser ? "You" : comment.user.username}
        </strong>
        <span style={{ fontSize: '0.95rem', color: '#8b949e', verticalAlign: 'middle' }}  title={new Date(comment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}>
          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
        </span>
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={editedText}
            onChange={e => setEditedText(e.target.value)}
            rows={3}
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
          <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                onEdit(comment.id, editedText);
                setIsEditing(false);
              }}
              style={actionBtnStyle}
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedText(comment.content);
              }}
              style={actionBtnStyle}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p style={{ margin: '8px 0 0 0', textAlign: 'left' }}>{comment.content}</p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        {/* Upvote/Downvote arrows */}
        <button onClick={() => onVote(comment.id, 1)} style={voteBtnStyle} aria-label="Upvote" title='Upvote'>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M10 5L5 12h10L10 5z" fill="currentColor"/>
          </svg>
        </button>
        <span style={{ fontWeight: 600 }}>{comment.score}</span>
        <button onClick={() => onVote(comment.id, -1)} style={voteBtnStyle} aria-label="Downvote" title='Downvote'>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M10 15l5-7H5l5 7z" fill="currentColor"/>
          </svg>
        </button>

        <button onClick={() => setReplying(!replying)} style={{
          ...actionBtnStyle,
          textDecoration: 'underline',
          textUnderlineOffset: 2,
          color: '#58a6ff',
          }}
          title={replying ? "Cancel reply" : "Reply"}>
          {replying ? 'Cancel' : 'Reply'}
        </button>
        {isCurrentUser && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                ...actionBtnStyle,
                textDecoration: 'underline',
                textUnderlineOffset: 2,
                color: '#58a6ff',
              }}
              title="Edit your comment"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
                  onDelete(comment.id);
                }
              }}
              style={{
                ...dangerBtnStyle,
                textDecoration: 'underline',
                textUnderlineOffset: 2
              }}
              title="Delete your comment"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Reply Form */}
      {replying && (
        <div style={{ marginTop: 10 }}>
          <CommentForm
            parentId={comment.id}
            onAdd={reply => {
              onReply({ ...reply, parentId: comment.id });
              setReplying(false);
            }}
          />
        </div>
      )}

      {/* Render Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onVote={onVote}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Reusable button styles
const actionBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#58a6ff', // GitHub accent blue
  cursor: 'pointer',
  padding: '2px 10px',
  fontSize: '0.9rem',
  borderRadius: 4,
  fontWeight: 500,
  transition: 'background 0.15s',
};
const dangerBtnStyle: React.CSSProperties = {
  ...actionBtnStyle,
  color: '#f85149', // GitHub danger
};
const voteBtnStyle: React.CSSProperties = {
  ...actionBtnStyle,
  color: '#8b949e',
  fontWeight: 700,
};