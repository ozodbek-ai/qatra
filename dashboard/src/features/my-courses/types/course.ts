export interface MyCourse {
  id: string;
  enrolledAt: string;

  course: {
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
    isPublished: boolean;

    totalLessons: number;
    completedLessons: number;
    progress: number;

    completions: {
      id: string;
      completedAt: string;
    }[];

    reviews: {
      rating: number;
    }[];
  };
}