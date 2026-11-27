import type { Comment } from '../types/comment';

export function replaceComment(comments: Comment[], updatedComment: Comment): Comment[] {
  let found = false;
  const replace = (items: Comment[]): Comment[] => items.map(comment => {
    if (comment.id === updatedComment.id) {
      found = true;
      return { ...updatedComment, replies: comment.replies };
    }

    return { ...comment, replies: replace(comment.replies ?? []) };
  });

  const updatedComments = replace(comments);
  return found ? updatedComments : [...comments, updatedComment];
}

export function updateCommentContent(comments: Comment[], id: number, content: string): Comment[] {
  return comments.map(comment => comment.id === id
    ? { ...comment, content }
    : { ...comment, replies: updateCommentContent(comment.replies ?? [], id, content) });
}

export function removeCommentAndReplies(comments: Comment[], id: number): Comment[] {
  const removedIds = new Set<number>([id]);
  let foundDescendant = true;

  while (foundDescendant) {
    foundDescendant = false;

    const visit = (items: Comment[]) => {
      for (const comment of items) {
        if (comment.parentId !== null && removedIds.has(comment.parentId) && !removedIds.has(comment.id)) {
          removedIds.add(comment.id);
          foundDescendant = true;
        }
        visit(comment.replies ?? []);
      }
    };

    visit(comments);
  }

  const remove = (items: Comment[]): Comment[] => items
    .filter(comment => !removedIds.has(comment.id))
    .map(comment => ({ ...comment, replies: remove(comment.replies ?? []) }));

  return remove(comments);
}
