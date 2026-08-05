import { createBrowserRouter } from "react-router-dom";

import LoginPage from "@/pages/auth/LoginPage";
import PlaygroundPage from "@/pages/dev/PlaygroundPage";
import LandingPage from "@/pages/public/LandingPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import StudentDashboardPage from "@/pages/student/DashboardPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestRoute from "@/components/auth/GuestRoute";
import MyCoursesPage from "@/pages/student/MyCoursesPage";

export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/playground",
    element: <PlaygroundPage />,
  },

  {
  path: "/login",
  element: (
    <GuestRoute>
      <LoginPage />
    </GuestRoute>
  ),
},

  // Student Routes
  {
  path: "/dashboard",
  element: (
    <ProtectedRoute>
      <StudentDashboardPage />
    </ProtectedRoute>
  ),
},
{
  path: "/my-courses",
  element: (
    <ProtectedRoute>
      <MyCoursesPage />
    </ProtectedRoute>
  ),
},

  // Admin Routes
 {
  path: "/admin",
  element: (
    <ProtectedRoute>
      <AdminDashboardPage />
    </ProtectedRoute>
  ),
},

  // 404
  {
    path: "*",
    element: (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] text-[var(--color-text)]">
        <h1 className="text-3xl font-bold">404 | Page Not Found</h1>
      </div>
    ),
  },
]);