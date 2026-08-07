import { api } from "@/lib/axios";

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