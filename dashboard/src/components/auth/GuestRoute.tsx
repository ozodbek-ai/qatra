import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth.store";

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({
  children,
}: GuestRouteProps) {
  const {
    isAuthenticated,
    user,
  } = useAuthStore();

  if (isAuthenticated) {
    const isAdmin =
      user?.role === "ADMIN" ||
      user?.role === "SUPER_ADMIN";

    return (
      <Navigate
        to={
          isAdmin
            ? "/admin"
            : "/dashboard"
        }
        replace
      />
    );
  }

  return <>{children}</>;
}