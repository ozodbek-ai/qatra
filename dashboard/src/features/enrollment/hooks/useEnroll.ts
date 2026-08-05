import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { enroll } from "../api/enroll";

export const useEnroll = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: enroll,

    onSuccess: () => {
      navigate("/my-courses");
    },
  });
};