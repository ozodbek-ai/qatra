import { api } from "@/lib/axios";

export interface AdminCertificate {
  id: string;
  certificateNo: string;
  issuedAt: string;

  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };

  course: {
    id: string;
    title: string;
  };
}

export interface AdminCertificateCourse {
  id: string;
  title: string;
  count: number;
}

export interface AdminCertificateData {
  statistics: {
    totalCertificates: number;
    totalRecipients: number;

    todayCertificates: number;
    todayRecipients: number;

    weekCertificates: number;
    weekRecipients: number;

    monthCertificates: number;
    monthRecipients: number;
  };

  recentCertificates:
    AdminCertificate[];

  topCourses:
    AdminCertificateCourse[];
}

export const getAdminCertificates =
  async (): Promise<AdminCertificateData> => {
    const response =
      await api.get<{
        success: boolean;
        data: AdminCertificateData;
      }>(
        "/certificates/admin"
      );

    return response.data.data;
  };