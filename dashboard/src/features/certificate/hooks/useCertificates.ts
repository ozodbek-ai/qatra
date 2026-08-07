// import { useQuery } from "@tanstack/react-query";

// import { getCertificates } from "../api/getCertificates";

// export const useCertificates = () => {
//   return useQuery({
//     queryKey: ["certificates"],
//     queryFn: getCertificates,
//   });
// };


import { useQuery } from "@tanstack/react-query";

import { getCertificates } from "../api/getCertificates";
import type { Certificate } from "../types/certificate";

export const useCertificates = () => {
  return useQuery<Certificate[]>({
    queryKey: ["certificates"],
    queryFn: getCertificates,
  });
};