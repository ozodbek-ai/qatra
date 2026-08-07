import { createBrowserRouter } from "react-router-dom";
import CoursesPage from "@/pages/admin/CoursesPage";
import LoginPage from "@/pages/auth/LoginPage";
import PlaygroundPage from "@/pages/dev/PlaygroundPage";
import LandingPage from "@/pages/public/LandingPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import StudentDashboardPage from "@/pages/student/DashboardPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestRoute from "@/components/auth/GuestRoute";
import MyCoursesPage from "@/pages/student/MyCoursesPage";
import CourseDetailsPage from "@/pages/public/CourseDetailsPage";
import PlayerPage from "@/pages/student/PlayerPage";
import QuizPage from "@/features/quiz/pages/QuizPage";
import CertificatesPage from "@/features/certificate/pages/CertificatesPage";
import AdminLayout from "@/components/layout/AdminLayout";



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
{
  path: "/courses/:slug",
  element: <CourseDetailsPage />,
},
{
  path: "/quiz/:quizId",
  element: (
    <ProtectedRoute>
      <QuizPage />
    </ProtectedRoute>
  ),
},
{
  path: "/certificates",
  element: (
    <ProtectedRoute>
      <CertificatesPage />
    </ProtectedRoute>
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
{
  path: "/player/:courseId",
  element: (
    <ProtectedRoute>
      <PlayerPage />
    </ProtectedRoute>
  ),
},

  // Admin Routes
{
  path: "/admin",
  element: (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <AdminDashboardPage />,
    },
    {
      path: "courses",
      element: <CoursesPage />,
    },
    
  ],
  
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