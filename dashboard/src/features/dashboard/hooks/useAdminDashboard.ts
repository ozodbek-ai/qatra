import { useQuery } from "@tanstack/react-query";

import { getAdminDashboard } from "../api/getAdminDashboard";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });
}