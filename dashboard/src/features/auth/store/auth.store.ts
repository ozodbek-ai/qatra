import { create } from "zustand";

import type { User } from "@/types/auth";

interface AuthState {
  accessToken: string | null;

  user: User | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  login: (
    accessToken: string,
    user: User
  ) => void;

  logout: () => void;

  setUser: (
    user: User | null
  ) => void;

  setLoading: (
    isLoading: boolean
  ) => void;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    accessToken:
      localStorage.getItem(
        "accessToken"
      ),

    user: null,

    isAuthenticated:
      !!localStorage.getItem(
        "accessToken"
      ),

    isLoading: !!localStorage.getItem(
      "accessToken"
    ),

    login: (
      accessToken,
      user
    ) => {
      localStorage.setItem(
        "accessToken",
        accessToken
      );

      set({
        accessToken,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    },

    logout: () => {
      localStorage.removeItem(
        "accessToken"
      );

      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    },

    setUser: (user) =>
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      }),

    setLoading: (isLoading) =>
      set({
        isLoading,
      }),
  }));