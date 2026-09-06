import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

export default function AuthScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              Q
            </Text>
          </View>

          <Text style={styles.title}>
            QATRA ga xush kelibsiz
          </Text>

          <Text style={styles.description}>
            Bilim oling, rivojlaning va
            yangi marralarni zabt eting.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.primaryButtonText}>
              Kirish
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.secondaryButtonText}>
              Ro'yxatdan o'tish
            </Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            Davom etish orqali siz Qatra platformasidan
            foydalanish shartlariga rozilik bildirasiz.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 70,
    paddingBottom: 35,
  },

  topSection: {
    alignItems: "center",
  },

  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 30,
    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 40,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "800",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },

  description: {
    color: "#94A3B8",
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 20,
  },

  bottomSection: {
    width: "100%",
  },

  primaryButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  secondaryButton: {
    height: 58,
    borderRadius: 16,

    borderWidth: 1,
    borderColor: "#334155",

    justifyContent: "center",
    alignItems: "center",

    marginTop: 14,
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  footer: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 24,
    paddingHorizontal: 15,
  },
});