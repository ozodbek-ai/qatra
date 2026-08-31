export type QuestionType =
  | "SINGLE"
  | "MULTIPLE";

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string | null;
  description?: string | null;
  passPercentage: number;

  lessonId: string;

  lesson?: {
    id: string;
    title: string;

    course: {
      id: string;
      title: string;
    };
  };

  questions: QuizQuestion[];

  attempt?: {
    id: string;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    submittedAt: string;
  } | null;
}

export interface SubmitAnswer {
  questionId: string;
  optionIds: string[];
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  submittedAt?: string;
}