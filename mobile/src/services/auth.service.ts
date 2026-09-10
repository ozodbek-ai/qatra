import { API_URL } from "@/constants/api";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type LoginResponse = {
  accessToken: string;
  user: User;
};

type MeResponse = {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
};

export async function loginUser(
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const text = await response.text();

console.log("API RESPONSE:", text);

let result;

try {
  result = JSON.parse(text);
} catch {
  throw new Error(
    `Server JSON qaytarmadi: ${text.substring(0, 150)}`
  );
}

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Kirishda xatolik yuz berdi."
    );
  }

  return result as ApiResponse<LoginResponse>;
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        fullName,
        email,
        password,
      }),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Ro'yxatdan o'tishda xatolik yuz berdi."
    );
  }

  return result;
}

export async function getMe(
  token: string
) {
  const response = await fetch(
    `${API_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
      "Foydalanuvchi ma'lumotlarini olishda xatolik."
    );
  }

  return result as ApiResponse<MeResponse>;
}

/*
|--------------------------------------------------------------------------
| FORGOT PASSWORD
|--------------------------------------------------------------------------
*/

export async function forgotPassword(
  email: string
) {
  const response = await fetch(
    `${API_URL}/auth/forgot-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email.trim().toLowerCase(),
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Parolni tiklash so'rovini yuborishda xatolik yuz berdi."
    );
  }

  return result as {
    success: boolean;
    message: string;
  };
}


/*
|--------------------------------------------------------------------------
| RESET PASSWORD
|--------------------------------------------------------------------------
*/

export async function resetPassword(
  token: string,
  password: string,
  confirmPassword: string
) {
  const response = await fetch(
    `${API_URL}/auth/reset-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        token,
        password,
        confirmPassword,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Parolni tiklashda xatolik yuz berdi."
    );
  }

  return result as {
    success: boolean;
    message: string;
  };
}