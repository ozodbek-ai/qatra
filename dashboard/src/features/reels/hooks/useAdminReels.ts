import { useQuery } from "@tanstack/react-query";
import { getAdminReels } from "../api/getAdminReels";

export function useAdminReels() {
  return useQuery({
    queryKey: ["admin-reels"],
    queryFn: getAdminReels,
  });
}