import { useQuery } from "@tanstack/react-query";

import { getDashboard } from "../api/getDashboard";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });
}