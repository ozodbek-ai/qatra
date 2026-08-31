import { useQuery } from "@tanstack/react-query";

import {
  getAdminCertificates,
} from "../api/getAdminCertificates";

export const useAdminCertificates =
  () => {
    return useQuery({
      queryKey: [
        "admin-certificates",
      ],
      queryFn:
        getAdminCertificates,
    });
  };