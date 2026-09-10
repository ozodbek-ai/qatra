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
| TYPES
|--------------------------------------------------------------------------
*/

export type ProfileUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
};


export type UpdateProfilePayload = {
  fullName: string;
};


export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};


/*
|--------------------------------------------------------------------------
| GET MY PROFILE
|--------------------------------------------------------------------------
*/

export async function getMyProfile(): Promise<
  ApiResponse<ProfileUser>
> {
  const response = await fetch(
    `${API_URL}/user/profile`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Profil ma'lumotlarini olishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
*/

export async function updateMyProfile(
  payload: UpdateProfilePayload
): Promise<ApiResponse<ProfileUser>> {
  const response = await fetch(
    `${API_URL}/user/profile`,
    {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Profilni yangilashda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| CHANGE PASSWORD
|--------------------------------------------------------------------------
*/

export async function changeMyPassword(
  payload: ChangePasswordPayload
): Promise<ApiResponse<null>> {
  const response = await fetch(
    `${API_URL}/user/password`,
    {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Parolni o'zgartirishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| UPDATE AVATAR
|--------------------------------------------------------------------------
*/

export async function updateMyAvatar(
  uri: string
): Promise<ApiResponse<ProfileUser>> {
  const token = await getAccessToken();

  const formData = new FormData();

  formData.append(
    "avatar",
    {
      uri,
      name: "avatar.jpg",
      type: "image/jpeg",
    } as any
  );

  const response = await fetch(
    `${API_URL}/user/profile/avatar`,
    {
      method: "POST",

      headers: {
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },

      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Profil rasmini yangilashda xatolik yuz berdi."
    );
  }

  return result;
}