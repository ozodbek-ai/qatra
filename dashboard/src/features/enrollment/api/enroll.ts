import { api } from "@/lib/api";

export const enroll = async (
  courseId: string
) => {
  const response = await api.post(
    "/enrollments",
    {
      courseId,
    }
  );

  return response.data;
};