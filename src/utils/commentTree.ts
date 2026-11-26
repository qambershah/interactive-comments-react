import type { Comment } from '../types/comment';

export function buildCommentTree(comments: Comment[]): Comment[] {
  const commentsById = new Map<number, Comment>();
  const roots: Comment[] = [];

  for (const comment of comments) {
    commentsById.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of comments) {
    const current = commentsById.get(comment.id)!;

    if (comment.parentId === null) {
      roots.push(current);
      continue;
    }

    const parent = commentsById.get(comment.parentId);
    if (parent) {
      parent.replies.push(current);
    } else {
      // Keep an orphaned reply visible if its parent was removed or omitted by the API.
      roots.push(current);
    }
  }

  return roots;
}
