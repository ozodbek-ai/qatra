import { useQuery } from "@tanstack/react-query";

import { getAdminUsers } from "../api/getAdminUsers";

export const useAdminUsers = (
  page = 1,
  limit = 20
) => {
  return useQuery({
    queryKey: [
      "admin-users",
      page,
      limit,
    ],
    queryFn: () =>
      getAdminUsers(
        page,
        limit
      ),
  });
};