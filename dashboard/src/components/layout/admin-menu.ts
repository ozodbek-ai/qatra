import {
  LayoutDashboard,
  BookOpen,
  BookCopy,
  FileQuestion,
  Users,
  MessageSquare,
  Award,
  Settings,
} from "lucide-react";

export const adminMenu = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Kurslar",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Darslar",
    href: "/admin/lessons",
    icon: BookCopy,
  },
  {
    title: "Quizlar",
    href: "/admin/quizzes",
    icon: FileQuestion,
  },
  {
    title: "Foydalanuvchilar",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Sharhlar",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    title: "Sertifikatlar",
    href: "/admin/certificates",
    icon: Award,
  },
  {
    title: "Sozlamalar",
    href: "/admin/settings",
    icon: Settings,
  },
];