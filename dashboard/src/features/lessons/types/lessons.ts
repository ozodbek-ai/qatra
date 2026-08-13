export interface Lesson {
  id: string;

  courseId: string;

  title: string;

  description: string | null;

  videoUrl: string | null;

  duration: number;

  order: number;

  isPreview: boolean;

  isPublished: boolean;

  quiz?: {
    id: string;
    title: string;
  } | null;
}