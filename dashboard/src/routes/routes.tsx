import { createBrowserRouter } from "react-router-dom";

/*
 * Public pages
 */
import LandingPage from "@/pages/public/LandingPage";
import CourseDetailsPage from "@/pages/public/CourseDetailsPage";
import CertificateVerifyPage from "@/features/certificate/pages/CertificateVerifyPage";
import PlaygroundPage from "@/pages/dev/PlaygroundPage";

/*
 * Auth pages
 */
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

/*
 * Auth guards
 */
import GuestRoute from "@/components/auth/GuestRoute";
import RoleRoute from "@/components/auth/RoleRoute";

/*
 * Layouts
 */
import AdminLayout from "@/components/layout/AdminLayout";
import StudentLayout from "@/components/layout/StudentLayout";

/*
 * Student pages
 */
import StudentDashboardPage from "@/pages/student/DashboardPage";
import StudentCoursesPage from "@/pages/student/CoursesPage";
import MyCoursesPage from "@/pages/student/MyCoursesPage";
import PlayerPage from "@/pages/student/PlayerPage";

import QuizPage from "@/features/quiz/pages/QuizPage";
import CertificatesPage from "@/features/certificate/pages/CertificatesPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

import ReelsPage from "@/features/reels/pages/ReelsPage";
import ReelDetailPage from "@/features/reels/pages/ReelDetailPage";

import ChatPage from "@/features/chat/pages/ChatPage";

/*
 * Admin pages
 */
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminCoursesPage from "@/pages/admin/CoursesPage";
import CreateCoursePage from "@/pages/admin/CreateCoursePage";
import EditCoursePage from "@/pages/admin/EditCoursePage";

import LessonsPage from "@/features/lessons/pages/LessonsPage";
import AllLessonsPage from "@/features/lessons/pages/AllLessonsPage";
import CreateLessonPage from "@/features/lessons/pages/CreateLessonPage";
import EditLessonPage from "@/features/lessons/pages/EditLessonPage";

import CreateQuizPage from "@/features/quiz/pages/CreateQuizPage";
import AdminQuizPage from "@/features/quiz/pages/AdminQuizPage";

import QuizzesPage from "@/pages/admin/QuizzesPage";
import QuizDetailsPage from "@/pages/admin/QuizDetailsPage";

import StudentsPage from "@/pages/admin/StudentsPage";
import StudentDetailsPage from "@/pages/admin/StudentDetailsPage";

import UsersPage from "@/pages/admin/UsersPage";
import UserDetailsPage from "@/pages/admin/UserDetailsPage";

import EnrollmentsPage from "@/pages/admin/EnrollmentsPage";
import ProgressPage from "@/pages/admin/ProgressPage";

import AdminReviewsPage from "@/features/reviews/pages/AdminReviewsPage";

import AdminManagementPage from "@/features/settings/pages/AdminManagementPage";

import AdminReelsPage from "@/features/reels/pages/AdminReelsPage";

import ChallengePage from "@/features/challenge/pages/ChallengePage";

// CATEGORIES
import CategoryReelsPage from "@/pages/student/CategoryReelsPage";


import AdminReelCategoriesPage from "@/features/reels/pages/AdminReelCategoriesPage";



export const router = createBrowserRouter([
  /*
   * =========================
   * PUBLIC ROUTES
   * =========================
   */

  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/playground",
    element: <PlaygroundPage />,
  },

  {
    path: "/certificates/verify",
    element: <CertificateVerifyPage />,
  },

  /*
   * =========================
   * AUTH ROUTES
   * =========================
   */

  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },

  {
    path: "/register",
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },

  {
    path: "/forgot-password",
    element: (
      <GuestRoute>
        <ForgotPasswordPage />
      </GuestRoute>
    ),
  },

  {
    path: "/reset-password",
    element: (
      <GuestRoute>
        <ResetPasswordPage />
      </GuestRoute>
    ),
  },

  /*
   * =========================
   * QUIZ
   * STUDENT ONLY
   * =========================
   */

  {
    path: "/quiz/:quizId",
    element: (
      <RoleRoute allowedRoles={["STUDENT"]}>
        <QuizPage />
      </RoleRoute>
    ),
  },

  /*
   * =========================
   * STUDENT ROUTES
   * =========================
   */

  {
    element: (
      <RoleRoute allowedRoles={["STUDENT"]}>
        <StudentLayout />
      </RoleRoute>
    ),

    children: [
      {
        path: "/dashboard",
        element: <StudentDashboardPage />,
      },

      {
        path: "/courses",
        element: <StudentCoursesPage />,
      },
      
      {
        path: "/courses/category/:slug",
        element: <CategoryReelsPage />,
      },
      
      {
        path: "/courses/:slug",
        element: <CourseDetailsPage />,
      },

      {
        path: "/my-courses",
        element: <MyCoursesPage />,
      },

      {
        path: "/player/:courseId",
        element: <PlayerPage />,
      },
  

      /*
       * Reels
       */

      {
        path: "/reels",
        element: <ReelsPage />,
      },

      {
        path: "/reels/:id",
        element: <ReelDetailPage />,
      },

      /*
       * Chat
       */

      {
        path: "/chat",
        element: <ChatPage />,
      },

      {
  path: "/challenges",
  element: <ChallengePage />,
},

      /*
       * Certificates
       */

      {
        path: "/certificates",
        element: <CertificatesPage />,
      },

      /*
       * Settings
       */

      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },

  /*
   * =========================
   * ADMIN ROUTES
   * ADMIN + SUPER_ADMIN
   * =========================
   */

  {
    path: "/admin",

    element: (
      <RoleRoute
        allowedRoles={[
          "ADMIN",
          "SUPER_ADMIN",
        ]}
      >
        <AdminLayout />
      </RoleRoute>
    ),

    children: [
      /*
       * Dashboard
       */

      {
        index: true,
        element: <AdminDashboardPage />,
      },

      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },

      /*
       * Courses
       */

      {
        path: "courses",
        element: <AdminCoursesPage />,
      },

      {
        path: "courses/new",
        element: <CreateCoursePage />,
      },

      {
        path: "courses/:id/edit",
        element: <EditCoursePage />,
      },

      /*
       * Lessons
       */

      {
        path: "lessons",
        element: <AllLessonsPage />,
      },

      {
        path: "courses/:courseId/lessons",
        element: <LessonsPage />,
      },

      {
        path: "courses/:courseId/lessons/new",
        element: <CreateLessonPage />,
      },

      {
        path: "courses/:courseId/lessons/:lessonId/edit",
        element: <EditLessonPage />,
      },

      /*
       * Quiz management
       */

      {
        path: "quizzes",
        element: <QuizzesPage />,
      },

      {
        path: "quizzes/:quizId",
        element: <QuizDetailsPage />,
      },

      {
        path:
          "courses/:courseId/lessons/:lessonId/quiz/new",

        element: <CreateQuizPage />,
      },

      {
        path:
          "courses/:courseId/lessons/:lessonId/quiz/:quizId",

        element: <AdminQuizPage />,
      },

      /*
       * Reels management
       */

      {
        path: "reels",
        element: <AdminReelsPage />,
      },
      {
        path: "reels/categories",
        element: <AdminReelCategoriesPage />,
      },

      /*
       * Students
       */

      {
        path: "students",
        element: <StudentsPage />,
      },

      {
        path: "students/:id",
        element: <StudentDetailsPage />,
      },

      /*
       * Users
       */

      {
        path: "users",
        element: <UsersPage />,
      },

      {
        path: "users/:id",
        element: <UserDetailsPage />,
      },

      /*
       * Enrollments
       */

      {
        path: "enrollments",
        element: <EnrollmentsPage />,
      },

      /*
       * Reviews
       */

      {
        path: "reviews",
        element: <AdminReviewsPage />,
      },

      /*
       * Settings
       * ADMIN + SUPER_ADMIN
       */

      {
        path: "settings",
        element: <SettingsPage />,
      },

      /*
       * =========================
       * SUPER_ADMIN ONLY
       * =========================
       */

      {
  path: "progress",
  element: (
    <RoleRoute
      allowedRoles={["SUPER_ADMIN"]}
    >
      <ProgressPage />
    </RoleRoute>
  ),
},

      {
        path: "settings/admins",

        element: (
          <RoleRoute
            allowedRoles={[
              "SUPER_ADMIN",
            ]}
          >
            <AdminManagementPage />
          </RoleRoute>
        ),
      },
    ],
  },

  /*
   * =========================
   * 404
   * =========================
   */

  {
    path: "*",

    element: (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] text-[var(--color-text)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            404
          </h1>

          <p className="mt-2 text-[var(--color-muted)]">
            Sahifa topilmadi
          </p>
        </div>
      </div>
    ),
  },
]);