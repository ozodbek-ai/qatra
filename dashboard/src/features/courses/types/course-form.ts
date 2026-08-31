export interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  price: number;
  category?: string | null;
  duration?: number;
  level:
    | "BEGINNER"
    | "INTERMEDIATE"
    | "ADVANCED";
}