import { api } from "@/lib/axios";

export async function deleteLesson(id: string) {
  console.log("API DELETE:", id);

  const response = await api.delete(
    `/lessons/${id}`
  );

  console.log(
    "API DELETE RESPONSE:",
    response.data
  );

  return response.data;
}