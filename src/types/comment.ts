export interface Comment {
  id: number;
  parentId: number | null;
  content: string;
  createdAt: string;
  score: number;
  replyingTo?: string;
  user: {
    username: string;
    image: string;
  };
  replies: Comment[];
}
