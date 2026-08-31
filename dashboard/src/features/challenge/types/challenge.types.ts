export type ChallengeStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "COMPLETED";


export interface ChallengeUser {
  id: string;
  fullName: string;
  avatarUrl: string | null;
}


export interface ChallengeCourse {
  id: string;
  title: string;
  imageUrl: string | null;
}


export interface Challenge {
  id: string;

  challengerId: string;

  opponentId: string;

  courseId: string;

  status: ChallengeStatus;

  challengerScore: number;

  opponentScore: number;

  challengerCompletedAt: string | null;

  opponentCompletedAt: string | null;

  winnerId: string | null;

  winner: ChallengeUser | null;

  createdAt: string;

  updatedAt: string;

  challenger: ChallengeUser;

  opponent: ChallengeUser;

  course: ChallengeCourse;
}


export interface CreateChallengePayload {
  opponentId: string;
  courseId: string;
}


export interface ChallengeApiResponse {
  success: boolean;
  data: Challenge;
}


export interface ChallengesApiResponse {
  success: boolean;
  data: Challenge[];
}