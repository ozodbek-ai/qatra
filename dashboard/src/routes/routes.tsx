import { createBrowserRouter } from "react-router-dom";

import LandingPage from "@/pages/public/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import StudentDashboardPage from "@/pages/student/DashboardPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/dashboard",
    element: <StudentDashboardPage />,
  },

  {
    path: "/admin",
    element: <AdminDashboardPage />,
  },
]);