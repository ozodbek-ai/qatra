import { useMutation } from "@tanstack/react-query";

import { downloadCertificate } from "../api/downloadCertificate";

export const useDownloadCertificate = () => {
  return useMutation({
    mutationFn: downloadCertificate,
  });
};