import { createBrowserRouter } from "react-router-dom";
import AdminCoursesPage from "@/pages/admin/CoursesPage";
import StudentCoursesPage from "@/pages/student/CoursesPage";
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
import StudentLayout from "@/components/layout/StudentLayout";

import CreateCoursePage from "@/pages/admin/CreateCoursePage";
import EditCoursePage from "@/pages/admin/EditCoursePage";

import LessonsPage from "@/features/lessons/pages/LessonsPage";
import AllLessonsPage from "@/features/lessons/pages/AllLessonsPage";
import EditLessonPage from "@/features/lessons/pages/EditLessonPage";
import CreateLessonPage from "@/features/lessons/pages/CreateLessonPage";

import CreateQuizPage from "@/features/quiz/pages/CreateQuizPage";
import AdminQuizPage from "@/features/quiz/pages/AdminQuizPage";

import StudentsPage from "@/pages/admin/StudentsPage";
import StudentDetailsPage from "@/pages/admin/StudentDetailsPage";

import UsersPage from "@/pages/admin/UsersPage";
import UserDetailsPage from "@/pages/admin/UserDetailsPage";

import EnrollmentsPage from "@/pages/admin/EnrollmentsPage";
import ProgressPage from "@/pages/admin/ProgressPage";

import QuizzesPage from "@/pages/admin/QuizzesPage";
import QuizDetailsPage from "@/pages/admin/QuizDetailsPage";

import AdminReviewsPage from "@/features/reviews/pages/AdminReviewsPage";

import SettingsPage from "@/features/settings/pages/SettingsPage";

export const router = createBrowserRouter([
  /*
   * PUBLIC ROUTES
   */

  {
    path: "/",
    element: <LandingPage />,
  },
// {
//   path: "/courses/:slug",
//   element: <CourseDetailsPage />,
// },

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
    path: "/quiz/:quizId",
    element: (
      <ProtectedRoute>
        <QuizPage />
      </ProtectedRoute>
    ),
  },

  /*
   * STUDENT ROUTES
   */

{
  element: <StudentLayout />,
  children: [
    {
      path: "/courses",
      element: <StudentCoursesPage />,
    },

    {
      path: "/courses/:slug",
      element: <CourseDetailsPage />,
    },

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

    {
      path: "/certificates",
      element: (
        <ProtectedRoute>
          <CertificatesPage />
        </ProtectedRoute>
      ),
    },

    {
      path: "/settings",
      element: (
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      ),
    },
  ],
},

  /*
   * ADMIN ROUTES
   */

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
    path: "dashboard",
    element: <AdminDashboardPage />,
  },
  {
  path: "courses",
  element: <AdminCoursesPage />,
},

      /*
       * Courses
       */
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
       * Quiz
       */

      {
        path: "courses/:courseId/lessons/:lessonId/quiz/new",
        element: <CreateQuizPage />,
      },

      {
        path: "courses/:courseId/lessons/:lessonId/quiz/:quizId",
        element: <AdminQuizPage />,
      },

      {
        path: "quizzes",
        element: <QuizzesPage />,
      },

      {
        path: "quizzes/:quizId",
        element: <QuizDetailsPage />,
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
       * Progress
       */

      {
        path: "progress",
        element: <ProgressPage />,
      },

      /*
       * Reviews
       */

      {
        path: "reviews",
        element: <AdminReviewsPage />,
      },

      /*
       * Admin Settings
       */

      
    ],
  },

  /*
   * 404
   */

  {
    path: "*",

    element: (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] text-[var(--color-text)]">
        <h1 className="text-3xl font-bold">
          404 | Page Not Found
        </h1>
      </div>
    ),
  },
]);