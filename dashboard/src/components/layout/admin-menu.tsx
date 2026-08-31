import {
  LayoutDashboard,
  BookOpen,
  BookCopy,
  FileQuestion,
  Users,
  MessageSquare,
  Settings,
  Clapperboard,
  UserCog,
  BarChart3,
  Tags,
} from "lucide-react";

import type { UserRole } from "@/types/auth";

export interface AdminMenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  allowedRoles: UserRole[];
}

export const adminMenu: AdminMenuItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },

  {
    title: "Kurslar",
    href: "/admin/courses",
    icon: BookOpen,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },

  {
    title: "Darslar",
    href: "/admin/lessons",
    icon: BookCopy,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },

  {
    title: "Quizlar",
    href: "/admin/quizzes",
    icon: FileQuestion,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },

  {
    title: "Reels",
    href: "/admin/reels",
    icon: Clapperboard,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },

  {
  title: "Reel kategoriyalari",
  href: "/admin/reels/categories",
  icon: Tags,
  allowedRoles: ["ADMIN", "SUPER_ADMIN"],
},

  {
    title: "Foydalanuvchilar",
    href: "/admin/users",
    icon: Users,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },

  {
    title: "Faollik va statistika",
    href: "/admin/progress",
    icon: BarChart3,
    allowedRoles: ["SUPER_ADMIN"],
  },

  {
    title: "Sharhlar",
    href: "/admin/reviews",
    icon: MessageSquare,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },

  {
    title: "Sozlamalar",
    href: "/admin/settings",
    icon: Settings,
    allowedRoles: ["ADMIN", "SUPER_ADMIN"],
  },

  /*
   * Faqat bosh admin boshqa
   * foydalanuvchilarni admin qiladi.
   */
  {
    title: "Adminlarni boshqarish",
    href: "/admin/settings/admins",
    icon: UserCog,
    allowedRoles: ["SUPER_ADMIN"],
  },
];