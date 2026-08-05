import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth.store";

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({
  children,
}: GuestRouteProps) {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <>{children}</>;
}