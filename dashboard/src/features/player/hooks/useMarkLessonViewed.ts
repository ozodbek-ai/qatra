import { useMutation } from "@tanstack/react-query";

import { markLessonViewed } from "../api/markLessonViewed";

export const useMarkLessonViewed = () => {
  return useMutation({
    mutationFn: markLessonViewed,
  });
};