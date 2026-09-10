import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { useEffect } from "react";

import {
  useRouter,
  useSegments,
} from "expo-router";

import { useAuth } from "@/context/AuthContext";

export function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inTabsGroup =
      segments[0] === "(tabs)";

    const currentRoute =
      segments[0];

    const isPublicRoute =
      !currentRoute ||
      currentRoute === "welcome" ||
      currentRoute === "onboarding" ||
      currentRoute === "auth" ||
      currentRoute === "login" ||
      currentRoute === "register";

    // User login qilmagan bo'lsa
    if (!user && !isPublicRoute) {
      router.replace("/auth");
      return;
    }

    // Login qilgan user auth sahifalarida qolmasligi kerak
    if (
      user &&
      !inTabsGroup &&
      (
        currentRoute === "auth" ||
        currentRoute === "login" ||
        currentRoute === "register"
      )
    ) {
      router.replace("/(tabs)");
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