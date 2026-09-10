import { API_URL } from "@/constants/api";

import {
  getAccessToken,
} from "@/services/storage.service";


type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};


async function getHeaders() {
  const token = await getAccessToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}


/*
|--------------------------------------------------------------------------
| CERTIFICATE TYPES
|--------------------------------------------------------------------------
*/

export type CertificateCourse = {
  id: string;

  title: string;

  slug?: string;

  imageUrl?: string | null;
};


export type Certificate = {
  id: string;

  certificateNo: string;

  issuedAt: string;

  userId?: string;

  courseId: string;

  completionId?: string;

  course: CertificateCourse;
};


/*
|--------------------------------------------------------------------------
| MY CERTIFICATES
|--------------------------------------------------------------------------
|
| GET /certificates/me
|
*/

export async function getMyCertificates(): Promise<
  ApiResponse<Certificate[]>
> {
  const response = await fetch(
    `${API_URL}/certificates/me`,
    {
      method: "GET",

      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Sertifikatlarni olishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| VERIFY CERTIFICATE
|--------------------------------------------------------------------------
|
| GET /certificates/verify/:certificateNo
|
*/

export async function verifyCertificate(
  certificateNo: string
): Promise<ApiResponse<Certificate>> {
  const response = await fetch(
    `${API_URL}/certificates/verify/${certificateNo}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Sertifikat topilmadi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| CERTIFICATE PDF URL
|--------------------------------------------------------------------------
|
| PDF endpoint:
|
| GET /certificates/:certificateId/pdf
|
| Bu endpoint Authorization talab qiladi.
|
*/

export async function getCertificatePdfUrl(
  certificateId: string
): Promise<{
  url: string;
  headers: Record<string, string>;
}> {
  const token = await getAccessToken();

  return {
    url:
      `${API_URL}/certificates/${certificateId}/pdf`,

    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  };
}