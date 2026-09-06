import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { useEffect } from "react";

import {
  useSegments,
  useRouter,
} from "expo-router";

import { useAuth } from "@/context/AuthContext";

export function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    user,
    isLoading,
  } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const currentRoute = segments[0];

    const isLoginRoute =
      currentRoute === "login";

    const isRegisterRoute =
      currentRoute === "register";

    const isAuthRoute =
      isLoginRoute || isRegisterRoute;

    const isWelcomeRoute =
      currentRoute === undefined;

    const isOnboardingRoute =
      currentRoute === "onboarding";

    const isAuthScreen =
      currentRoute === "auth";

    // LOGIN QILGAN USER
    if (user) {
      // Login/Register sahifasida bo'lsa
      if (isAuthRoute) {
        router.replace("/explore");
        return;
      }

      // Welcome sahifasida bo'lsa
      if (isWelcomeRoute) {
        router.replace("/explore");
        return;
      }

      return;
    }

    // LOGIN QILMAGAN USER

    const isPublicRoute =
      isWelcomeRoute ||
      isOnboardingRoute ||
      isAuthScreen ||
      isAuthRoute;

    // Protected sahifaga kirishga urinsa
    if (!isPublicRoute) {
      router.replace("/auth");
    }
  }, [
    user,
    isLoading,
    segments,
    router,
  ]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",

    justifyContent: "center",
    alignItems: "center",
  },
});