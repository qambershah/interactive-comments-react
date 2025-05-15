import type { Comment } from '../types/comment';
import { CommentItem } from './Comment';

interface Props {
  comments: Comment[];
  onReply: (reply: Comment) => void;
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

export function CommentList({ comments, onReply }: Props) {
  const nested = buildCommentTree(comments);

  return (
    <div>
      {nested.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onReply={onReply} />
      ))}
    </div>
  );
}
