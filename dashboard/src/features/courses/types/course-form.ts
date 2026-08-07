export interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  price: number;
  category?: string;
  duration?: number;
  level:
    | "BEGINNER"
    | "INTERMEDIATE"
    | "ADVANCED";
}