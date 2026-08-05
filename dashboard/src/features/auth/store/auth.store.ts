import { create } from "zustand";

import type { User } from "@/types/auth";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  login: (
    accessToken: string,
    user: User
  ) => void;

  logout: () => void;

  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("accessToken"),

  user: null,

  isAuthenticated: !!localStorage.getItem("accessToken"),

  login: (accessToken, user) => {
    localStorage.setItem("accessToken", accessToken);

    set({
      accessToken,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");

    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) =>
    set({
      user,
    }),
}));