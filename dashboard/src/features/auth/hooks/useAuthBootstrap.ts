import { useEffect } from "react";

import { me } from "../api/me";
import { useAuthStore } from "../store/auth.store";

export function useAuthBootstrap() {
  const {
    accessToken,
    setUser,
    logout,
    setLoading,
  } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        setLoading(true);

        const user = await me();

        setUser({
          id: user.userId,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        });

        setLoading(false);
      } catch {
        logout();
      }
    };

    loadUser();
  }, [
    accessToken,
    setUser,
    logout,
    setLoading,
  ]);
}