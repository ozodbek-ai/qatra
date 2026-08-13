export interface LessonFormData {
  courseId: string;

  title: string;

  description: string;

  video: FileList;

  duration: number;

  order: number;

  isPreview: boolean;
}