import { useEffect } from "react";

import { useMe } from "@/features/auth/hooks/useMe";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface Props {
  children: React.ReactNode;
}

export default function AuthInitializer({
  children,
}: Props) {
  const token = useAuthStore(
    (state) => state.accessToken
  );

  const setUser = useAuthStore(
    (state) => state.setUser
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const { data: response, isError } = useMe();

  useEffect(() => {
    if (!token) return;

    if (response) {
      setUser({
        id: response.userId,
        fullName: response.fullName,
        email: response.email,
        role: response.role,
        avatarUrl: response.avatarUrl,
      });
    }

    if (isError) {
      logout();
    }
  }, [
    token,
    response,
    isError,
    logout,
    setUser,
  ]);

  return <>{children}</>;
}