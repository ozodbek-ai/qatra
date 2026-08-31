import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { completeLesson } from "../api/completeLesson";

export const useCompleteLesson = (
  courseId: string
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: completeLesson,

    onSuccess: () => {
      /*
       * Player:
       * completed lesson va nextLesson
       * yangilanadi.
       */
      queryClient.invalidateQueries({
        queryKey: [
          "player",
          courseId,
        ],
      });

      /*
       * Dashboard statistikasi
       */
      queryClient.invalidateQueries({
        queryKey: [
          "dashboard",
        ],
      });

      /*
       * Mening kurslarim
       */
      queryClient.invalidateQueries({
        queryKey: [
          "my-courses",
        ],
      });

      /*
       * Agar kurs tugagan bo'lsa,
       * yangi sertifikatni ko'rsatish uchun
       * certificates query'sini yangilaymiz.
       */
      queryClient.invalidateQueries({
        queryKey: [
          "certificates",
        ],
      });
    },
  });
};