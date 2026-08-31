import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { submitQuiz } from "../api/submitQuiz";

import type { SubmitAnswer } from "../types/quiz";

export const useSubmitQuiz = (
  quizId: string,
  courseId?: string
) => {
  const queryClient =
    useQueryClient();

  const navigate =
    useNavigate();

  return useMutation({
    mutationFn: (
      answers: SubmitAnswer[]
    ) =>
      submitQuiz(
        quizId,
        answers
      ),

    onSuccess: (result) => {
      /*
       * Quiz natijasi o'zgardi.
       */
      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: [
            "player",
            courseId,
          ],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["player"],
        });
      }

      /*
       * Dashboard statistikasi
       */
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      /*
       * Mening kurslarim
       */
      queryClient.invalidateQueries({
        queryKey: ["my-courses"],
      });

      /*
       * Sertifikatlar
       */
      queryClient.invalidateQueries({
        queryKey: ["certificates"],
      });

      /*
       * Quiz muvaffaqiyatli
       * topshirilgan bo'lsa,
       * foydalanuvchini avtomatik
       * kurs/player sahifasiga qaytaramiz.
       */
      if (result.passed) {
        toast.success(
          "Quiz muvaffaqiyatli topshirildi."
        );

        setTimeout(() => {
          navigate(
            courseId
              ? `/player/${courseId}`
              : "/my-courses",
            {
              replace: true,
            }
          );
        }, 800);

        return;
      }

      /*
       * Student quizdan o'ta olmagan bo'lsa,
       * natija sahifasida qoladi va
       * qayta topshirishi mumkin.
       */
      toast.error(
        "Quizdan o'ta olmadingiz. Qayta urinib ko'rishingiz mumkin."
      );
    },
  });
};