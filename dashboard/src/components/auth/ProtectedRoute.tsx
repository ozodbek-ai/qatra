import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth.store";

type UserRole =
  | "STUDENT"
  | "ADMIN"
  | "SUPER_ADMIN";

interface Props {
  children: React.ReactNode;

  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {
  const location = useLocation();

  const {
    user,
    isAuthenticated,
  } = useAuthStore();

  /*
   * Token yoki foydalanuvchi mavjud emas.
   */
  if (!isAuthenticated || !user) {
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
   * Role-based access control.
   */
  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.role as UserRole
    )
  ) {
    if (
      user.role === "ADMIN" ||
      user.role === "SUPER_ADMIN"
    ) {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <>{children}</>;
}