import type { Comment } from '../types/comment';
import { buildCommentTree } from '../utils/commentTree';
import { CommentItem } from './CommentItem';

interface Props {
  comments: Comment[];
  onReply: (reply: Comment) => void;
  onEdit: (id: number, updatedContent: string) => void;
  onDelete: (id: number) => void;
  onVote: (id: number, delta: number) => void;
}

export function CommentList({ comments, onReply, onEdit, onDelete, onVote }: Props) {
  const nested = buildCommentTree(comments);

  if (nested.length === 0) {
    return <p className="empty-state">No comments yet. Start the discussion.</p>;
  }

  return (
    <ol className="comment-list" aria-label="Comment thread">
      {nested.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onVote={onVote}
        />
      ))}
    </ol>
  );
}
