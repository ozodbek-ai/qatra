import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm, useWatch} from "react-hook-form";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";

import { useResetPassword } from "@/features/auth/hooks/useResetPassword";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [searchParams] =
    useSearchParams();

  const resetPasswordMutation =
    useResetPassword();

  const token = useMemo(
    () =>
      searchParams.get("token") ?? "",
    [searchParams],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } =
    useForm<ResetPasswordForm>({
      mode: "onSubmit",
    });

  const password = useWatch({
  control,
  name: "password",
});

  const onSubmit = (
    data: ResetPasswordForm,
  ) => {
    if (!token) {
      return;
    }

    resetPasswordMutation.mutate({
      token,
      password: data.password,
      confirmPassword:
        data.confirmPassword,
    });
  };

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              Noto'g'ri havola
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="mb-5 text-sm text-red-500">
              Parolni tiklash havolasi
              mavjud emas yoki noto'g'ri.
            </p>

            <Link to="/forgot-password">
              <Button className="w-full">
                Yangi havola olish
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            Yangi parol yarating
          </CardTitle>

          <p className="text-sm text-[var(--color-muted)]">
            Yangi parolingizni kiriting va
            tasdiqlang.
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Yangi parol
              </label>

              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Kamida 8 ta belgi"
                variant={
                  errors.password
                    ? "error"
                    : "default"
                }
                {...register(
                  "password",
                  {
                    required:
                      "Iltimos, yangi parol kiriting",
                    minLength: {
                      value: 8,
                      message:
                        "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
                    },
                  },
                )}
              />

              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium"
              >
                Parolni tasdiqlang
              </label>

              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Parolni qayta kiriting"
                variant={
                  errors.confirmPassword
                    ? "error"
                    : "default"
                }
                {...register(
                  "confirmPassword",
                  {
                    required:
                      "Iltimos, parolni tasdiqlang",
                    validate: (value) =>
                      value === password ||
                      "Parollar bir xil emas",
                  },
                )}
              />

              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {
                    errors.confirmPassword
                      .message
                  }
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={
                resetPasswordMutation.isPending
              }
            >
              Yangi parolni saqlash
            </Button>

            <div className="text-center text-sm text-[var(--color-muted)]">
              <Link
                to="/login"
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Login sahifasiga qaytish
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}