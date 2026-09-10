import { useRef, useState } from "react";
import {
  useForm,
  useWatch,
} from "react-hook-form";
import {
  Camera,
  Lock,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
} from "@/components/ui";

import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useChangePassword } from "../hooks/useChangePassword";
import { useUploadAvatar } from "../hooks/useUploadAvatar";
import { useAuthStore } from "@/features/auth/store/auth.store";

type ProfileFormData = {
  fullName: string;
};

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    data: profile,
    isLoading,
    isError,
  } = useProfile();

  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const uploadAvatar = useUploadAvatar();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] =
    useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
  } = useForm<ProfileFormData>();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    control: passwordControl,
    formState: {
      errors: passwordErrors,
    },
  } = useForm<PasswordFormData>();

  const currentPassword = useWatch({
    control: passwordControl,
    name: "currentPassword",
  });

  const newPassword = useWatch({
    control: passwordControl,
    name: "newPassword",
  });

  if (isLoading) {
    return (
      <div className="p-8">
        Yuklanmoqda...
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="p-8 text-red-500">
        Profil ma'lumotlarini yuklab bo'lmadi.
      </div>
    );
  }

  const onProfileSubmit = (
    data: ProfileFormData
  ) => {
    updateProfile.mutate(data.fullName);
  };

  const onPasswordSubmit = (
    data: PasswordFormData
  ) => {
    changePassword.mutate(data, {
      onSuccess: () => {
        resetPassword();
      },
    });
  };

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setAvatarPreview(previewUrl);

    uploadAvatar.mutate(file);
  };

  const avatar =
    avatarPreview ?? profile.avatarUrl;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Sozlamalar
          </h1>

          <p className="mt-1 text-slate-500">
            Profil va xavfsizlik sozlamalarini boshqaring.
          </p>
        </div>

        {/* Profile */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <User size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Profil
              </h2>

              <p className="text-sm text-slate-500">
                Shaxsiy ma'lumotlaringiz
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[180px_1fr]">

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">

                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profil rasmi"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-200 text-4xl font-bold text-slate-500">
                    {profile.fullName
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={
                    uploadAvatar.isPending
                  }
                  className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 disabled:opacity-50"
                >
                  <Camera size={18} />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <p className="text-center text-xs text-slate-500">
                JPG, PNG yoki WEBP
                <br />
                Maksimum 5 MB
              </p>
            </div>

            {/* Profile form */}
            <form
              className="space-y-5"
              onSubmit={handleProfileSubmit(
                onProfileSubmit
              )}
              noValidate
            >
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Ism va familiya
                </label>

                <Input
                  defaultValue={
                    profile.fullName
                  }
                  {...registerProfile(
                    "fullName",
                    {
                      required:
                        "Iltimos, ism va familiyangizni kiriting",
                    }
                  )}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <Input
                  value={profile.email}
                  disabled
                />

                <p className="mt-1 text-xs text-slate-500">
                  Email manzilini hozircha o'zgartirib bo'lmaydi.
                </p>
              </div>

              <Button
                type="submit"
                loading={
                  updateProfile.isPending
                }
              >
                Profilni saqlash
              </Button>
            </form>
          </div>
        </section>

        {/* Admin management */}
        {user?.role === "SUPER_ADMIN" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                  <User size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Adminlarni boshqarish
                  </h2>

                  <p className="text-sm text-slate-500">
                    Foydalanuvchilarni admin qilish
                    yoki adminlikdan chiqarish.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/settings/admins"
                  )
                }
                className="inline-flex min-h-12 items-center justify-center rounded-[14px] bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
              >
                Adminlarni boshqarish
              </button>
            </div>
          </section>
        )}

        {/* Password */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
              <Lock size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Parolni o'zgartirish
              </h2>

              <p className="text-sm text-slate-500">
                Hisobingiz xavfsizligini saqlang.
              </p>
            </div>
          </div>

          <form
            className="max-w-xl space-y-5"
            onSubmit={handlePasswordSubmit(
              onPasswordSubmit
            )}
            noValidate
          >
            {/* Current password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-medium"
              >
                Joriy parol
              </label>

              <Input
                id="currentPassword"
                type="password"
                placeholder="Joriy parolingiz"
                autoComplete="current-password"
                variant={
                  passwordErrors.currentPassword
                    ? "error"
                    : "default"
                }
                aria-invalid={Boolean(
                  passwordErrors.currentPassword
                )}
                {...registerPassword(
                  "currentPassword",
                  {
                    required:
                      "Iltimos, joriy parolingizni kiriting",
                  }
                )}
              />

              {passwordErrors.currentPassword && (
                <p
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {
                    passwordErrors.currentPassword
                      .message
                  }
                </p>
              )}
            </div>

            {/* New password */}
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium"
              >
                Yangi parol
              </label>

              <Input
                id="newPassword"
                type="password"
                placeholder="Yangi parol"
                autoComplete="new-password"
                variant={
                  passwordErrors.newPassword
                    ? "error"
                    : "default"
                }
                aria-invalid={Boolean(
                  passwordErrors.newPassword
                )}
                {...registerPassword(
                  "newPassword",
                  {
                    required:
                      "Iltimos, yangi parol kiriting",

                    minLength: {
                      value: 8,
                      message:
                        "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak",
                    },

                    validate: (value) =>
                      value !== currentPassword ||
                      "Yangi parol joriy paroldan farq qilishi kerak",
                  }
                )}
              />

              {passwordErrors.newPassword && (
                <p
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {
                    passwordErrors.newPassword
                      .message
                  }
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Yangi parolni tasdiqlang
              </label>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="Yangi parolni qayta kiriting"
                autoComplete="new-password"
                variant={
                  passwordErrors.confirmPassword
                    ? "error"
                    : "default"
                }
                aria-invalid={Boolean(
                  passwordErrors.confirmPassword
                )}
                {...registerPassword(
                  "confirmPassword",
                  {
                    required:
                      "Iltimos, yangi parolni tasdiqlang",

                    validate: (value) =>
                      value === newPassword ||
                      "Parollar bir xil emas",
                  }
                )}
              />

              {passwordErrors.confirmPassword && (
                <p
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {
                    passwordErrors.confirmPassword
                      .message
                  }
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={
                  changePassword.isPending
                }
                className="inline-flex min-h-12 min-w-[220px] items-center justify-center rounded-[14px] bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {changePassword.isPending ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saqlanmoqda...
                  </>
                ) : (
                  "Parolni o'zgartirish"
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  resetPassword()
                }
                disabled={
                  changePassword.isPending
                }
                className="inline-flex min-h-12 items-center justify-center rounded-[14px] border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </section>

      </div>
    </main>
  );
}