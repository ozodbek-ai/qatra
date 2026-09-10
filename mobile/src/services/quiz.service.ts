import { API_URL } from "@/constants/api";

import {
  getAccessToken,
} from "@/services/storage.service";


type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};




async function getHeaders() {
  const token = await getAccessToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}


/*
|--------------------------------------------------------------------------
| QUIZ TYPES
|--------------------------------------------------------------------------
*/

export type QuizOption = {
  id: string;
  text: string;
};


export type QuizQuestion = {
  id: string;

  question: string;

  type: "SINGLE" | "MULTIPLE";

  options: QuizOption[];
};


export type QuizAttempt = {
  id: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
};


export type Quiz = {
  id: string;

  title: string;

  description?: string | null;

  passPercentage: number;

  lesson: {
    id: string;
    title: string;

    course: {
      id: string;
      title: string;
    };
  };

  questions: QuizQuestion[];

  attempt: QuizAttempt | null;
};


export type QuizAnswer = {
  questionId: string;
  optionIds: string[];
};


export type QuizSubmitResult = {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
};


/*
|--------------------------------------------------------------------------
| GET QUIZ
|--------------------------------------------------------------------------
*/

export async function getQuizById(
  quizId: string
): Promise<ApiResponse<Quiz>> {
  const response = await fetch(
    `${API_URL}/quizzes/${quizId}`,
    {
      method: "GET",

      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Quizni olishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| SUBMIT QUIZ
|--------------------------------------------------------------------------
|
| Backend payload:
|
| {
|   answers: [
|     {
|       questionId: "...",
|       optionIds: ["..."]
|     }
|   ]
| }
|
*/

export async function submitQuiz(
  quizId: string,
  answers: QuizAnswer[]
): Promise<ApiResponse<QuizSubmitResult>> {
  const response = await fetch(
    `${API_URL}/quizzes/${quizId}/submit`,
    {
      method: "POST",

      headers: await getHeaders(),

      body: JSON.stringify({
        answers,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Quizni topshirishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| QUIZ RESULT
|--------------------------------------------------------------------------
*/

export type QuizResult = {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
};


export async function getQuizResult(
  quizId: string
): Promise<ApiResponse<QuizResult>> {
  const response = await fetch(
    `${API_URL}/quizzes/${quizId}/result`,
    {
      method: "GET",

      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Quiz natijasini olishda xatolik yuz berdi."
    );
  }

  return result;
}