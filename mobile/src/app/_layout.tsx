import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <StatusBar style="light" />

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </AuthGuard>
    </AuthProvider>
  );
}