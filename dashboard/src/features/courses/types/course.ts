export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  price: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  isPublished: boolean;
}