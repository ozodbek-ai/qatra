import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/routes";

export function AppRouter() {
  return <RouterProvider router={router} />;
}