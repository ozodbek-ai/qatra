import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";

import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [error, setError] =
    useState("");

  const forgotPasswordMutation =
    useForgotPassword();

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError(
        "Iltimos, login yoki emailingizni kiriting",
      );

      return;
    }

    forgotPasswordMutation.mutate({
      email: email.trim(),
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            Parolni tiklash
          </CardTitle>

          <p className="text-sm text-[var(--color-muted)]">
            Hisobingizga bog'langan email
            manzilni kiriting. Parolni tiklash
            havolasi emailingizga yuboriladi.
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
          >
            <div className="space-y-2">
              <label
                htmlFor="forgot-password-email"
                className="text-sm font-medium"
              >
                Login / Email
              </label>

              <Input
                id="forgot-password-email"
                type="email"
                placeholder="example@gmail.com"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value,
                  );

                  setError("");
                }}
                variant={
                  error
                    ? "error"
                    : "default"
                }
                aria-invalid={Boolean(
                  error,
                )}
              />

              {error && (
                <p
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={
                forgotPasswordMutation.isPending
              }
            >
              Parolni tiklash
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