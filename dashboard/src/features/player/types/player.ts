export interface PlayerLesson {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  duration: number;
  order: number;
  completed: boolean;

  quiz?: {
    id: string;
  } | null;
}

export interface PlayerCourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
}

export interface PlayerData {
  course: PlayerCourse;

  progress: number;

  isCompleted: boolean;

  completedAt: string | null;

  completedLessons: string[];

  lessons: PlayerLesson[];

  nextLesson: PlayerLesson | null;
}