import { describe, expect, it } from 'vitest';
import type { Comment } from '../types/comment';
import { buildCommentTree } from './commentTree';

const comment = (id: number, parentId: number | null, content: string): Comment => ({
  id,
  parentId,
  content,
  createdAt: '2026-01-01T00:00:00.000Z',
  score: 0,
  user: { username: 'tester', image: '/avatar.png' },
  replies: [],
});

describe('buildCommentTree', () => {
  it('nests replies at any depth without changing the input comments', () => {
    const comments = [
      comment(1, null, 'Parent'),
      comment(2, 1, 'Reply'),
      comment(3, 2, 'Nested reply'),
    ];

    const tree = buildCommentTree(comments);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.replies[0]?.content).toBe('Reply');
    expect(tree[0]?.replies[0]?.replies[0]?.content).toBe('Nested reply');
    expect(comments[0]?.replies).toEqual([]);
  });

  it('keeps replies whose parent is missing visible as root comments', () => {
    const tree = buildCommentTree([
      comment(1, null, 'Parent'),
      comment(2, 404, 'Orphaned reply'),
    ]);

    expect(tree.map((item) => item.content)).toEqual(['Parent', 'Orphaned reply']);
  });

  it('supports a valid parent id of zero', () => {
    const tree = buildCommentTree([
      comment(0, null, 'Parent'),
      comment(1, 0, 'Reply'),
    ]);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.replies.map((item) => item.content)).toEqual(['Reply']);
  });
});
