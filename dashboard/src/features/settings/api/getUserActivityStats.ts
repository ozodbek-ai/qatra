import { api } from "@/lib/axios";

export interface UserActivityStats {
  logins: {
    today: number;
    week: number;
    month: number;
  };

  loginDays: {
    date: string;
    dayIndex: number;
    day: string;
    loggedIn: boolean;
  }[];

  lessonDuration: {
    today: number;
    week: number;
    month: number;
    total: number;
  };

  totalLessonsViewed: number;
}

export const getUserActivityStats = async (
  userId: string
) => {
  const response = await api.get(
    `/admin/users/${userId}/activity-stats`
  );

  return response.data.data as UserActivityStats;
};