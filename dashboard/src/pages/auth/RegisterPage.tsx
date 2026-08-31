import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";

import { useRegister } from "@/features/auth/hooks/useRegister";

import type { RegisterRequest } from "@/types/auth";

export default function RegisterPage() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest & { confirmPassword: string }>({
    mode: "onSubmit",
  });

  const password = watch("password");

  const onSubmit = (
    data: RegisterRequest & { confirmPassword: string }
  ) => {
    registerMutation.mutate({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Hisob yaratish</CardTitle>

          <p className="text-sm text-[var(--color-muted)]">
            Qatra tizimidan foydalanish uchun yangi hisob yarating.
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
                htmlFor="fullName"
                className="text-sm font-medium"
              >
                Ism va familiya
              </label>

              <Input
                id="fullName"
                type="text"
                placeholder="Ism va familiyangiz"
                autoComplete="name"
                variant={errors.fullName ? "error" : "default"}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={
                  errors.fullName ? "fullName-error" : undefined
                }
                {...register("fullName", {
                  required: "Iltimos, ism va familiyangizni kiriting",
                  minLength: {
                    value: 3,
                    message:
                      "Ism va familiya kamida 3 ta belgidan iborat bo'lishi kerak",
                  },
                })}
              />

              {errors.fullName && (
                <p
                  id="fullName-error"
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium"
              >
                Login / Email
              </label>

              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                autoComplete="email"
                variant={errors.email ? "error" : "default"}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "email-error" : undefined
                }
                {...register("email", {
                  required: "Iltimos, loginni kiriting",
                  pattern: {
                    value:
                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email noto'g'ri formatda",
                  },
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
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Parol
              </label>

              <Input
                id="password"
                type="password"
                placeholder="Kamida 8 ta belgi"
                autoComplete="new-password"
                variant={errors.password ? "error" : "default"}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password", {
                  required: "Iltimos, parol yarating",
                  minLength: {
                    value: 8,
                    message:
                      "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
                  },
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
                placeholder="Parolingizni qayta kiriting"
                autoComplete="new-password"
                variant={
                  errors.confirmPassword
                    ? "error"
                    : "default"
                }
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword
                    ? "confirm-password-error"
                    : undefined
                }
                {...register("confirmPassword", {
                  required: "Iltimos, parolni tasdiqlang",
                  validate: (value) =>
                    value === password ||
                    "Parollar bir xil emas",
                })}
              />

              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={registerMutation.isPending}
            >
              Hisob yaratish
            </Button>

            <div className="text-center text-sm text-[var(--color-muted)]">
              Hisobingiz allaqachon bormi?{" "}
              <Link
                to="/login"
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}