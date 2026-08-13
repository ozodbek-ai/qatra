import { useQuery } from "@tanstack/react-query";

import { getAdminDashboard } from "../api/getAdminDashboard";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });
};