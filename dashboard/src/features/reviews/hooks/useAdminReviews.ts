import { useQuery } from "@tanstack/react-query";

import { getAdminReviews } from "../api/getAdminReviews";

export function useAdminReviews() {
  return useQuery({
    queryKey: ["admin-reviews"],
    queryFn: getAdminReviews,
  });
}