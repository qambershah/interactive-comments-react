import { describe, expect, it } from 'vitest';
import type { Comment } from '../types/comment';
import { removeCommentAndReplies, replaceComment } from './commentState';

const comment = (id: number, parentId: number | null, content: string, replies: Comment[] = []): Comment => ({
  id,
  parentId,
  content,
  createdAt: '2026-01-01T00:00:00.000Z',
  score: 0,
  user: { username: 'tester', image: '/avatar.png' },
  replies,
});

describe('comment state updates', () => {
  it('replaces one nested comment while keeping its replies and other comments', () => {
    const reply = comment(2, 1, 'Reply');
    const comments = [comment(1, null, 'Parent', [reply]), comment(3, null, 'Other')];
    const updated = comment(2, 1, 'Edited reply');

    const result = replaceComment(comments, updated);

    expect(result[0]?.replies[0]?.content).toBe('Edited reply');
    expect(result[1]?.content).toBe('Other');
    expect(comments[0]?.replies[0]?.content).toBe('Reply');
  });

  it('adds an updated comment if it is not already in the collection', () => {
    const result = replaceComment([], comment(1, null, 'New comment'));

    expect(result.map(item => item.content)).toEqual(['New comment']);
  });

  it('updates a vote score without changing a root comment position', () => {
    const comments = [
      { ...comment(1, null, 'Top'), score: 8 },
      { ...comment(2, null, 'Next'), score: 6 },
      { ...comment(3, null, 'Voted'), score: 5 },
    ];
    const updated = { ...comments[2]!, score: 9 };

    const result = replaceComment(comments, updated);

    expect(result.map(item => item.id)).toEqual([1, 2, 3]);
    expect(result.map(item => item.score)).toEqual([8, 6, 9]);
  });

  it('updates a reply score without moving it or changing parent order', () => {
    const comments = [
      { ...comment(1, null, 'Parent'), score: 10, replies: [
        { ...comment(2, 1, 'Lower reply'), score: 2 },
        { ...comment(3, 1, 'Higher reply'), score: 4 },
      ] },
      { ...comment(4, null, 'Other parent'), score: 8 },
    ];
    const updatedReply = { ...comments[0]!.replies[0]!, score: 12 };

    const result = replaceComment(comments, updatedReply);

    expect(result.map(item => item.id)).toEqual([1, 4]);
    expect(result[0]?.replies.map(item => item.id)).toEqual([2, 3]);
    expect(result[0]?.replies.map(item => item.score)).toEqual([12, 4]);
  });

  it('removes a comment and all descendants without changing the original collection', () => {
    const comments = [
      comment(1, null, 'Parent'),
      comment(2, 1, 'Reply'),
      comment(3, 2, 'Nested reply'),
      comment(4, null, 'Other'),
    ];

    const result = removeCommentAndReplies(comments, 1);

    expect(result.map(item => item.id)).toEqual([4]);
    expect(comments.map(item => item.id)).toEqual([1, 2, 3, 4]);
  });
});
