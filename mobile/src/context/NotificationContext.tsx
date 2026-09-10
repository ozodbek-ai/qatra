import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getUnreadNotificationCount,
} from "@/services/notification.service";

import {
  connectSocket,
  getSocket,
} from "@/services/socket.service";

import { useAuth } from "@/context/AuthContext";


type NotificationContextType = {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  decreaseUnreadCount: () => void;
  resetUnreadCount: () => void;
};


const NotificationContext =
  createContext<NotificationContextType | undefined>(
    undefined
  );


export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isAuthenticated } =
    useAuth();

  const [unreadCount, setUnreadCount] =
    useState<number>(0);


  const refreshUnreadCount =
    useCallback(async (): Promise<void> => {
      if (!isAuthenticated) {
        setUnreadCount(0);
        return;
      }

      try {
        const response =
          await getUnreadNotificationCount();

        setUnreadCount(
          response.data.count
        );
      } catch (error: unknown) {
        console.log(
          "Notification unread count yuklashda xatolik:",
          error
        );
      }
    }, [isAuthenticated]);


  const decreaseUnreadCount =
    useCallback((): void => {
      setUnreadCount((currentCount) =>
        Math.max(0, currentCount - 1)
      );
    }, []);


  const resetUnreadCount =
    useCallback((): void => {
      setUnreadCount(0);
    }, []);


  useEffect(() => {
    if (!isAuthenticated || !user) {
      setUnreadCount(0);
      return;
    }

    void refreshUnreadCount();
  }, [
    isAuthenticated,
    user,
    refreshUnreadCount,
  ]);


  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isActive = true;

    const handleNewNotification =
      (): void => {
        if (!isActive) {
          return;
        }

        setUnreadCount((currentCount) =>
          currentCount + 1
        );
      };


    const setupSocket = async (): Promise<void> => {
      try {
        let socket = getSocket();

        if (!socket) {
          socket = await connectSocket();
        }

        if (!socket || !isActive) {
          return;
        }

        socket.off(
          "notification:new",
          handleNewNotification
        );

        socket.on(
          "notification:new",
          handleNewNotification
        );
      } catch (error: unknown) {
        console.log(
          "Notification socket listener xatoligi:",
          error
        );
      }
    };


    void setupSocket();


    return () => {
      isActive = false;

      const socket = getSocket();

      socket?.off(
        "notification:new",
        handleNewNotification
      );
    };
  }, [isAuthenticated]);


  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        decreaseUnreadCount,
        resetUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}


export function useNotifications() {
  const context =
    useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications NotificationProvider ichida ishlatilishi kerak."
    );
  }

  return context;
}