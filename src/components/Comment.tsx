import { useState } from 'react';
import type { Comment as CommentType } from '../types/comment';
import { CommentForm } from './CommentForm';

interface Props {
  comment: CommentType;
  depth?: number;
  onReply: (reply: CommentType) => void;
}

export function CommentItem({ comment, depth = 0, onReply }: Props) {
  const [replying, setReplying] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        marginBottom: '1rem',
        marginLeft: depth * 20,
        alignItems: 'flex-start',
        gap: '0.75rem',
      }}
    >
      <img
        src={comment.user.image.png}
        alt={`${comment.user.username}'s avatar`}
        style={{ width: 36, height: 36, borderRadius: '50%' }}
      />

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <strong>{comment.user.username}</strong>
          <span style={{ fontSize: '0.75rem', color: '#888' }}>
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p>{comment.content}</p>

        <button onClick={() => setReplying(!replying)} style={{ fontSize: '0.75rem', marginTop: 4 }}>
          {replying ? 'Cancel' : 'Reply'}
        </button>

        {replying && (
          <CommentForm
            onAdd={(reply) => {
              onReply({ ...reply, parentId: comment.id });
              setReplying(false);
            }}
            parentId={comment.id}
          />
        )}

        {comment.replies?.length > 0 && (
          <div>
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
