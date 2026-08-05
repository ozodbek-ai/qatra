import { api } from "@/lib/api";
import type { Certificate } from "../types/certificate";

export const getCertificates = async () => {
  const response = await api.get<{
    success: boolean;
    data: Certificate[];
  }>("/certificates/me");

  return response.data.data;
};