export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  order: number;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  passPercentage: number;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface SubmitAnswer {
  questionId: string;
  optionId: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
}