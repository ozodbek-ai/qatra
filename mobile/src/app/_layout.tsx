import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

import { AuthGuard } from "@/components/AuthGuard";


export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AuthGuard>
          <StatusBar style="light" />

          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </AuthGuard>
      </NotificationProvider>
    </AuthProvider>
  );
}