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

  return (
    <div>
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
    </div>
  );
}
