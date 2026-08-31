import { useQuery } from "@tanstack/react-query";
import { getReels } from "../api/getReels";

export function useReels() {
  return useQuery({
    queryKey: ["reels"],
    queryFn: getReels,
  });
}