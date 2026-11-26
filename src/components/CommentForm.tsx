import { useId, useState, type FormEvent } from 'react';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import type { Comment } from '../types/comment';

interface Props {
  onAdd: (comment: Comment) => void;
  parentId?: number | null;
  onCancel?: () => void;
}

export function CommentForm({ onAdd, parentId = null, onCancel }: Props) {
  const { user } = useCurrentUser();
  const [text, setText] = useState('');
  const textareaId = useId();
  const isReply = parentId !== null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = text.trim();
    if (!content) return;

    onAdd({
      id: Date.now(),
      parentId,
      content,
      createdAt: new Date().toISOString(),
      score: 0,
      user: { username: user.username, image: user.image },
      replies: [],
    });
    setText('');
  };

  return (
    <form className={`comment-form${isReply ? ' comment-form-reply' : ''}`} onSubmit={handleSubmit}>
      <img className="composer-avatar" src={user.image} alt="" />
      <div className="composer-fields">
        <div className="composer-meta">
          <label htmlFor={textareaId}>{isReply ? 'Write a reply' : `Posting as ${user.username}`}</label>
          <span>Be respectful and stay on topic.</span>
        </div>
        <textarea
          id={textareaId}
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder={isReply ? 'Add your reply…' : 'Share a thought…'}
          rows={isReply ? 3 : 4}
        />
        <div className="composer-actions">
          {onCancel && (
            <button className="button button-quiet" type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button className="button button-primary" type="submit" disabled={!text.trim()}>
            {isReply ? 'Post reply' : 'Post comment'}
          </button>
        </div>
      </div>
    </form>
  );
}
