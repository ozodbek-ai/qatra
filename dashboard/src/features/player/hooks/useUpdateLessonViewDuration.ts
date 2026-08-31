import { useMutation } from "@tanstack/react-query";

import {
  updateLessonViewDuration,
} from "../api/updateLessonViewDuration";

export const useUpdateLessonViewDuration =
  () => {
    return useMutation({
      mutationFn: ({
        activityId,
        durationSeconds,
      }: {
        activityId: string;
        durationSeconds: number;
      }) =>
        updateLessonViewDuration(
          activityId,
          durationSeconds
        ),
    });
  };