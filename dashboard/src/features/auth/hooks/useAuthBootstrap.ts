import { useEffect } from "react";

import { me } from "../api/me";
import { useAuthStore } from "../store/auth.store";

import {
  connectSocket,
  disconnectSocket,
} from "@/lib/socket";

export function useAuthBootstrap() {
  const {
    accessToken,
    setUser,
    logout,
    setLoading,
  } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      disconnectSocket();

      setLoading(false);

      return;
    }

    let isMounted = true;

    const loadUser = async () => {
      try {
        setLoading(true);

        const user = await me();

        if (!isMounted) {
          return;
        }

        setUser({
          id: user.userId,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        });

        /*
         * User JWT orqali tasdiqlandi.
         * Endi Socket.IO connection ochamiz.
         */
        connectSocket(accessToken);

        setLoading(false);
      } catch {
        if (!isMounted) {
          return;
        }

        disconnectSocket();

        logout();
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [
    accessToken,
    setUser,
    logout,
    setLoading,
  ]);
}