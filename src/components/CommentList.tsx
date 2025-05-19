import type { Comment } from '../types/comment';
import { CommentItem } from './CommentItem';

interface Props {
  comments: Comment[];
  onReply: (reply: Comment) => void;
  onEdit: (id: number, updatedContent: string) => void;
  onDelete: (id: number) => void;
  onVote: (id: number, delta: number) => void;
}

// Organize comments into a nested tree
function buildCommentTree(comments: Comment[]): Comment[] {
  const map = new Map<number, Comment>();
  const roots: Comment[] = [];

  for (const comment of comments) {
    map.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of comments) {
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      if (parent) parent.replies.push(map.get(comment.id)!);
    } else {
      roots.push(map.get(comment.id)!);
    }
  }

  return roots;
}

export function CommentList({ comments, onReply, onEdit, onDelete, onVote }: Props) {
  const nested = buildCommentTree(comments);

  return (
    <div>
      {nested.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onReply={onReply} onEdit={onEdit} onDelete={onDelete} onVote={onVote}/>
      ))}
    </div>
  );
}
