import { useEffect } from "react";

import { useMe } from "@/features/auth/hooks/useMe";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({
  children,
}: Props) {
  const token =
    useAuthStore(
      (state) => state.accessToken
    );

  const setUser =
    useAuthStore(
      (state) => state.setUser
    );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  const { data, isError } =
    useMe();

  useEffect(() => {
    if (!token) return;

   if (data) {
  setUser({
    id: data.data.userId,
    fullName: data.data.fullName,
    email: data.data.email,
    role: data.data.role,
    avatarUrl: data.data.avatarUrl,
  });
}

    if (isError) {
      logout();
    }
  }, [
    token,
    data,
    isError,
    logout,
    setUser,
  ]);

  return children;
}