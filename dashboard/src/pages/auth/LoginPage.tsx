import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useAuthStore } from "@/features/auth/store/auth.store";

import type { LoginRequest } from "@/types/auth";

export default function LoginPage() {
  const { register, handleSubmit } =
    useForm<LoginRequest>();

  const loginMutation = useLogin();

  const isAuthenticated =
    useAuthStore(
      (state) => state.isAuthenticated
    );

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
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
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="space-y-5"
          >
            <Input
              placeholder="Email"
              type="email"
              {...register("email")}
            />

            <Input
              placeholder="Password"
              type="password"
              {...register(
                "password"
              )}
            />

            <Button
              type="submit"
              className="w-full"
              loading={
                loginMutation.isPending
              }
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}