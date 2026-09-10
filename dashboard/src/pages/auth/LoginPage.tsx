import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { useLogin } from "@/features/auth/hooks/useLogin";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { SmoothInput } from "@/components/ui/input/SmoothInput";

import type { LoginRequest } from "@/types/auth";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    mode: "onSubmit",
  });

  const loginMutation = useLogin();

  const {
    isAuthenticated,
    user,
  } = useAuthStore();

  if (isAuthenticated) {
    const isAdmin =
      user?.role === "ADMIN" ||
      user?.role === "SUPER_ADMIN";

    return (
      <Navigate
        to={isAdmin ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  const onSubmit = (
    data: LoginRequest
  ) => {
    loginMutation.mutate(data);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            Qatra Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div className="space-y-2">
              <SmoothInput
  placeholder="Email"
  type="email"
  autoComplete="email"
  variant={
    errors.email
      ? "error"
      : "default"
  }
  aria-invalid={Boolean(
    errors.email,
  )}
  aria-describedby={
    errors.email
      ? "email-error"
      : undefined
  }
  {...register("email", {
    required:
      "Iltimos, emailni kiriting",
  })}
/>

              {errors.email && (
                <p
                  id="email-error"
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <SmoothInput
  placeholder="Parol"
  type="password"
  autoComplete="current-password"
  variant={
    errors.password
      ? "error"
      : "default"
  }
  aria-invalid={Boolean(
    errors.password,
  )}
  aria-describedby={
    errors.password
      ? "password-error"
      : undefined
  }
  {...register("password", {
    required:
      "Iltimos, parolni kiriting",
  })}
/>

              {errors.password && (
                <p
                  id="password-error"
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loginMutation.isPending}
            >
              Tizimga kirish
            </Button>

            <div className="flex items-center justify-between text-sm">
              <Link
                to="/register"
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Hisobingiz yo'qmi?
              </Link>

              <Link
                to="/forgot-password"
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Parolni unutdingizmi?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}