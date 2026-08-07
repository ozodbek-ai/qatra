export interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  duration: number;
  order: number;
  isPreview: boolean;
  quiz?: {
    id: string;
  } | null;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;

  user: {
    fullName: string;
    avatarUrl?: string | null;
  };
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;

  imageUrl: string | null;

  price: number;

  level:
    | "BEGINNER"
    | "INTERMEDIATE"
    | "ADVANCED";

  category?: string | null;

  duration: number;

  studentsCount: number;

  averageRating: number;

  isPublished: boolean;

  lessons: Lesson[];

  reviews: Review[];

  _count: {
    lessons: number;
    enrollments: number;
    reviews: number;
  };
}