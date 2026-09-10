import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { Redirect } from "expo-router";

import { useAuth } from "@/context/AuthContext";

export default function IndexScreen() {
  const { user, isLoading } = useAuth();

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

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/welcome" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },
});