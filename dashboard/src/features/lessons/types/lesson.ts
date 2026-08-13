export type Lesson = {
  id: string;
  courseId: string;

  title: string;
  description: string | null;

  videoUrl: string | null;

  duration: number;
  order: number;

  isPreview: boolean;
  isPublished: boolean;

  createdAt: string;
  updatedAt: string;

  quiz?: {
    id: string;
    title: string | null;
  } | null;
};