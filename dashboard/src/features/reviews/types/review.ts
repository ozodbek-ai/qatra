export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;

  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };

  course: {
    id: string;
    title: string;
  };
}