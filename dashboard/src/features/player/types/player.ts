export interface PlayerLesson {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  duration: number;
  order: number;
  completed: boolean;
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

  completedLessons: string[];

  lessons: PlayerLesson[];

  nextLesson: PlayerLesson | null;
}