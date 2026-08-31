import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth.store";

import type { UserRole } from "@/types/auth";

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleRoute({
  children,
  allowedRoles,
}: RoleRouteProps) {
  const location = useLocation();

  const { user } = useAuthStore();

  /*
   * Foydalanuvchi login qilmagan bo'lsa
   */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />
    );
  }

  /*
   * Foydalanuvchi rolida ruxsat bo'lmasa
   */
  if (!allowedRoles.includes(user.role)) {
    /*
     * Student admin sahifasiga kirishga
     * harakat qilsa dashboardga qaytadi.
     */
    if (user.role === "STUDENT") {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }

    /*
     * Admin boshqa taqiqlangan sahifaga
     * kirsa admin dashboardga qaytadi.
     */
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return <>{children}</>;
}