import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";

import { router } from "expo-router";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

 const handleLogin = async () => {
  if (!email.trim()) {
    Alert.alert(
      "Xatolik",
      "Email manzilingizni kiriting."
    );
    return;
  }

  if (!email.includes("@")) {
    Alert.alert(
      "Xatolik",
      "Email manzili noto'g'ri."
    );
    return;
  }

  if (!password) {
    Alert.alert(
      "Xatolik",
      "Parolingizni kiriting."
    );
    return;
  }

  setLoading(true);

  try {
    await login(
  email.trim(),
  password
);

router.replace("/");

  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Kirish vaqtida xatolik yuz berdi.";

    Alert.alert(
      "Xatolik",
      message
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Back */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ←
          </Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              Q
            </Text>
          </View>

          <Text style={styles.title}>
            Xush kelibsiz
          </Text>

          <Text style={styles.subtitle}>
            Davom etish uchun hisobingizga kiring
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email
            </Text>

            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>
                Parol
              </Text>

              <TouchableOpacity
  onPress={() =>
    router.push("/forgot-password")
  }
>
  <Text style={styles.forgotPassword}>
    Parolni unutdingizmi?
  </Text>
</TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Parolingizni kiriting"
                placeholderTextColor="#64748B"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowPassword(!showPassword)
                }
              >
                <Text style={styles.eyeText}>
                  {showPassword
                    ? "Yashirish"
                    : "Ko'rsatish"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.loginButtonText}>
                Kirish
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Hisobingiz yo'qmi?
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push("/register")
            }
          >
            <Text style={styles.registerLink}>
              Ro'yxatdan o'ting
            </Text>
          </TouchableOpacity>
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
    paddingTop: 16,
    paddingBottom: 30,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#0F172A",

    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 26,
  },

  header: {
    alignItems: "center",
    marginTop: 40,
  },

  logoContainer: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 28,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 46,
    fontWeight: "800",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },

  form: {
    marginTop: 48,
  },

  inputGroup: {
    marginBottom: 22,
  },

  label: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 9,
  },

  input: {
    height: 58,
    borderRadius: 15,

    backgroundColor: "#0F172A",

    borderWidth: 1,
    borderColor: "#1E293B",

    color: "#FFFFFF",
    fontSize: 16,

    paddingHorizontal: 17,
  },

  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  forgotPassword: {
    color: "#3B82F6",
    fontSize: 13,
    fontWeight: "600",
  },

  passwordContainer: {
    height: 58,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#0F172A",

    borderWidth: 1,
    borderColor: "#1E293B",

    borderRadius: 15,
  },

  passwordInput: {
    flex: 1,
    height: "100%",

    color: "#FFFFFF",
    fontSize: 16,

    paddingHorizontal: 17,
  },

  eyeButton: {
    paddingHorizontal: 16,
  },

  eyeText: {
    color: "#3B82F6",
    fontSize: 13,
    fontWeight: "600",
  },

  loginButton: {
    height: 58,
    borderRadius: 16,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  registerContainer: {
    marginTop: "auto",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  registerText: {
    color: "#94A3B8",
    fontSize: 14,
    marginRight: 5,
  },

  registerLink: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "700",
  },
});