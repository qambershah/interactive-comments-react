import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Comment as CommentType } from '../types/comment';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { CommentForm } from './CommentForm';

interface Props {
  comment: CommentType;
  onReply: (reply: CommentType) => void;
  onEdit: (id: number, updatedContent: string) => void;
  onDelete: (id: number) => void;
  onVote: (id: number, delta: number) => void;
}

export function CommentItem({ comment, onReply, onEdit, onDelete, onVote }: Props) {
  const [replying, setReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.content);
  const { user } = useCurrentUser();
  const isCurrentUser = user.username === comment.user.username;
  const authorId = `comment-${comment.id}-author`;
  const createdAt = new Date(comment.createdAt);

  const saveEdit = () => {
    const content = editedText.trim();
    if (!content) return;
    onEdit(comment.id, content);
    setIsEditing(false);
  };

  const deleteComment = () => {
    if (window.confirm('Delete this comment and its replies? This cannot be undone.')) {
      onDelete(comment.id);
    }
  };

  return (
    <li className="comment-entry">
      <article className="comment-card" aria-labelledby={authorId}>
        <div className="vote-control" aria-label={`Score ${comment.score}`}>
          <button className="vote-button" type="button" onClick={() => onVote(comment.id, 1)} aria-label="Upvote" title="Upvote">
            <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m10 4 6 7H4l6-7Z" /></svg>
          </button>
          <span className="vote-count" aria-live="polite" aria-atomic="true">{comment.score}</span>
          <button className="vote-button" type="button" onClick={() => onVote(comment.id, -1)} aria-label="Downvote" title="Downvote">
            <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m10 16-6-7h12l-6 7Z" /></svg>
          </button>
        </div>

        <div className="comment-main">
          <header className="comment-header">
            <img className="comment-avatar" src={comment.user.image} alt="" />
            <span className="comment-author" id={authorId}>{comment.user.username}</span>
            {isCurrentUser && <span className="you-badge">You</span>}
            <time className="comment-date" dateTime={comment.createdAt}>
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </time>
          </header>

          {isEditing ? (
            <div className="edit-panel">
              <label className="visually-hidden" htmlFor={`edit-${comment.id}`}>Edit your comment</label>
              <textarea
                id={`edit-${comment.id}`}
                value={editedText}
                onChange={event => setEditedText(event.target.value)}
                rows={4}
                autoFocus
              />
              <div className="comment-actions">
                <button className="button button-primary" type="button" onClick={saveEdit} disabled={!editedText.trim()}>
                  Save changes
                </button>
                <button className="button button-quiet" type="button" onClick={() => {
                  setIsEditing(false);
                  setEditedText(comment.content);
                }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="comment-content">{comment.content}</p>
          )}

          <div className="comment-actions" aria-label="Comment actions">
            <button className="button button-quiet" type="button" onClick={() => setReplying(value => !value)}>
              {replying ? 'Close reply' : 'Reply'}
            </button>
            {isCurrentUser && !isEditing && (
              <>
                <button className="button button-quiet" type="button" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
                <button className="button button-danger" type="button" onClick={deleteComment}>
                  Delete
                </button>
              </>
            )}
          </div>

          {replying && (
            <CommentForm
              parentId={comment.id}
              onAdd={reply => {
                onReply(reply);
                setReplying(false);
              }}
              onCancel={() => setReplying(false)}
            />
          )}

          {comment.replies?.length > 0 && (
            <ol className="reply-list" aria-label={`Replies to ${comment.user.username}`}>
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onVote={onVote}
                />
              ))}
            </ol>
          )}
        </div>
      </article>
    </li>
  );
}
