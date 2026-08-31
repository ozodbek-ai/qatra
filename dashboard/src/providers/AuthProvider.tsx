import { useEffect } from "react";

import { useMe } from "@/features/auth/hooks/useMe";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({
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

  const setLoading = useAuthStore(
    (state) => state.setLoading
  );

  const {
    data,
    isError,
    isLoading,
  } = useMe();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(isLoading);

    if (data) {
      setUser({
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        avatarUrl: data.avatarUrl,
      });
    }

    if (isError) {
      logout();
    }
  }, [
    token,
    data,
    isError,
    isLoading,
    setUser,
    logout,
    setLoading,
  ]);

  return <>{children}</>;
}