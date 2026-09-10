import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            Q
          </Text>
        </View>

        {/* Title */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            QATRA
          </Text>

          <Text style={styles.subtitle}>
            Har bir qatra bilim —
            katta o‘zgarish sari.
          </Text>
        </View>

        {/* Bottom */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => {
              router.push("/onboarding");
            }}
          >
            <Text style={styles.buttonText}>
              Boshlash
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Bilim olishni bugundan boshlang
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
    paddingTop: 80,
    paddingBottom: 40,
  },

  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    alignSelf: "center",

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "700",
  },

  textContainer: {
    alignItems: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 6,
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 26,
    marginTop: 16,
    paddingHorizontal: 20,
  },

  bottomContainer: {
    width: "100%",
  },

  button: {
    height: 58,
    borderRadius: 16,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  footerText: {
    color: "#64748B",
    fontSize: 13,
    textAlign: "center",
    marginTop: 18,
  },
});