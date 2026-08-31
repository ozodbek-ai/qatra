import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  /*
   * FormData yuborilayotgan requestlarda
   * Content-Type'ni browser/axios o'zi
   * boundary bilan belgilaydi.
   */
  if (
    typeof FormData !== "undefined" &&
    config.data instanceof FormData
  ) {
    delete config.headers[
      "Content-Type"
    ];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (!error.response) {
      toast.error(
        "Server bilan bog'lanib bo'lmadi."
      );

      return Promise.reject(error);
    }

    const status =
      error.response.status;

    const message =
      error.response.data?.message ??
      "Noma'lum xatolik yuz berdi.";

    const requestUrl =
      error.config?.url ?? "";

    /*
     * LOGIN REQUEST
     *
     * Login vaqtida 401/403 kelishi
     * sessiya tugaganini anglatmaydi.
     *
     * Bu xatoni useLogin hook'i
     * o'zi foydalanuvchiga ko'rsatadi.
     *
     * Eng muhimi:
     * - redirect qilmaymiz
     * - accessToken o'chirmaymiz
     * - LoginPage qayta mount bo'lmaydi
     * - inputlar saqlanib qoladi
     */
    const isLoginRequest =
      requestUrl.includes(
        "/auth/login"
      );

    if (
      isLoginRequest &&
      (status === 401 ||
        status === 403)
    ) {
      return Promise.reject(
        error
      );
    }

    switch (status) {
      case 400:
        toast.error(message);
        break;

      case 401:
        localStorage.removeItem(
          "accessToken"
        );

        toast.error(
          "Sessiya tugadi. Qayta tizimga kiring."
        );

        window.location.href =
          "/login";

        break;

      case 403:
        toast.error(
          "Sizda bu amal uchun ruxsat yo'q."
        );

        break;

      case 404:
        toast.error(message);
        break;

      case 500:
        toast.error(
          "Serverda xatolik yuz berdi."
        );

        break;

      default:
        toast.error(message);
    }

    return Promise.reject(
      error
    );
  }
);