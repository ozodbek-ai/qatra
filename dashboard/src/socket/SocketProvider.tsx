import {
  useEffect,
  type ReactNode,
} from "react";

import {
  connectSocket,
  disconnectSocket,
} from "./socket";

import { useAuthStore } from
  "@/features/auth/store/auth.store";

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({
  children,
}: SocketProviderProps) {
  const accessToken =
    useAuthStore(
      (state) => state.accessToken
    );

  const isAuthenticated =
    useAuthStore(
      (state) => state.isAuthenticated
    );

  useEffect(() => {
    /*
     * User login qilmagan bo'lsa,
     * Socket ishlamasligi kerak.
     */
    if (
      !isAuthenticated ||
      !accessToken
    ) {
      disconnectSocket();

      return;
    }

    /*
     * User authenticated bo'lsa,
     * Socket serverga ulanadi.
     */
    const socket =
      connectSocket();

    const handleConnect = () => {
      console.log(
        "Socket connected:",
        socket.id
      );
    };

    const handleDisconnect = (
      reason: string
    ) => {
      console.log(
        "Socket disconnected:",
        reason
      );
    };

    const handleConnectError = (
      error: Error
    ) => {
      console.error(
        "Socket connection error:",
        error.message
      );
    };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "connect_error",
      handleConnectError
    );

    return () => {
      /*
       * Event listenerlarni tozalaymiz.
       *
       * Socket singleton bo'lgani uchun
       * har safar component cleanup'da
       * disconnect qilish shart emas.
       */
      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "connect_error",
        handleConnectError
      );
    };
  }, [
    accessToken,
    isAuthenticated,
  ]);

  return <>{children}</>;
}