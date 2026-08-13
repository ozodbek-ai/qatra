import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

import type { Lesson } from "../types/lesson";
import type { LessonFormData } from "../types/lesson-form";

export async function createLesson(
  data: LessonFormData
) {
  const formData = new FormData();

  formData.append(
    "courseId",
    data.courseId
  );

  formData.append(
    "title",
    data.title
  );

  formData.append(
    "description",
    data.description
  );

  formData.append(
    "duration",
    String(data.duration)
  );

  formData.append(
    "order",
    String(data.order)
  );

  formData.append(
    "isPreview",
    String(data.isPreview)
  );

  if (data.video?.length) {
    formData.append(
      "video",
      data.video[0]
    );
  }

  const response =
    await api.post<ApiResponse<Lesson>>(
      "/lessons",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data.data;
}