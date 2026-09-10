import { API_URL } from "@/constants/api";
import { getAccessToken } from "@/services/storage.service";

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
| TYPES
|--------------------------------------------------------------------------
*/

export type ChallengeUser = {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
};

export type ChallengeCourse = {
  id: string;
  title: string;
  imageUrl?: string | null;
};

export type ChallengeStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "COMPLETED";

export type Challenge = {
  id: string;

  challengerId: string;
  opponentId: string;
  courseId: string;

  status: ChallengeStatus;

  winnerId?: string | null;

  createdAt: string;
  updatedAt?: string;

  challenger: ChallengeUser;
  opponent: ChallengeUser;

  winner?: ChallengeUser | null;

  course: ChallengeCourse;
};

export type CreateChallengePayload = {
  opponentId: string;
  courseId: string;
};

/*
|--------------------------------------------------------------------------
| GET MY CHALLENGES
|--------------------------------------------------------------------------
*/

export async function getMyChallenges(): Promise<
  ApiResponse<Challenge[]>
> {
  const response = await fetch(
    `${API_URL}/challenges`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Challengelarni olishda xatolik yuz berdi."
    );
  }

  return result;
}

/*
|--------------------------------------------------------------------------
| CREATE CHALLENGE
|--------------------------------------------------------------------------
*/

export async function createChallenge(
  payload: CreateChallengePayload
): Promise<ApiResponse<Challenge>> {
  const response = await fetch(
    `${API_URL}/challenges`,
    {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Challenge yaratishda xatolik yuz berdi."
    );
  }

  return result;
}

/*
|--------------------------------------------------------------------------
| ACCEPT CHALLENGE
|--------------------------------------------------------------------------
*/

export async function acceptChallenge(
  challengeId: string
): Promise<ApiResponse<Challenge>> {
  const response = await fetch(
    `${API_URL}/challenges/${challengeId}/accept`,
    {
      method: "PATCH",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Challenge qabul qilishda xatolik yuz berdi."
    );
  }

  return result;
}

/*
|--------------------------------------------------------------------------
| DECLINE CHALLENGE
|--------------------------------------------------------------------------
*/

export async function declineChallenge(
  challengeId: string
): Promise<ApiResponse<Challenge>> {
  const response = await fetch(
    `${API_URL}/challenges/${challengeId}/decline`,
    {
      method: "PATCH",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Challenge rad etishda xatolik yuz berdi."
    );
  }

  return result;
}

/*
|--------------------------------------------------------------------------
| DELETE CHALLENGE
|--------------------------------------------------------------------------
*/

export async function deleteChallenge(
  challengeId: string
): Promise<{
  success: boolean;
  message?: string;
}> {
  const response = await fetch(
    `${API_URL}/challenges/${challengeId}`,
    {
      method: "DELETE",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Challenge o'chirishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| CHALLENGE PROGRESS
|--------------------------------------------------------------------------
*/

export type ChallengeProgressUser = {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
};

export type ChallengeProgressCourse = {
  id: string;
  title: string;
  imageUrl?: string | null;
};

export type ChallengeProgress = {
  id: string;

  challengerId: string;
  opponentId: string;
  courseId: string;

  status:
    | "PENDING"
    | "ACCEPTED"
    | "DECLINED"
    | "COMPLETED";

  challengerScore: number;
  opponentScore: number;

  challengerCompletedAt?: string | null;
  opponentCompletedAt?: string | null;

  winnerId?: string | null;

  winner?: ChallengeProgressUser | null;

  createdAt: string;
  updatedAt: string;

  challenger: ChallengeProgressUser;
  opponent: ChallengeProgressUser;

  course: ChallengeProgressCourse;
};

export async function getChallengeProgress(
  challengeId: string
): Promise<ApiResponse<ChallengeProgress>> {
  const response = await fetch(
    `${API_URL}/challenges/${challengeId}/progress`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Challenge progressini olishda xatolik yuz berdi."
    );
  }

  return result;
}