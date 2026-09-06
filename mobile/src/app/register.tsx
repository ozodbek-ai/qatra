import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { registerUser } from "@/services/auth.service";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      Alert.alert(
        "Xatolik",
        "Ism va familiyangizni kiriting."
      );
      return;
    }

    if (!trimmedEmail) {
      Alert.alert(
        "Xatolik",
        "Email manzilingizni kiriting."
      );
      return;
    }

    if (!trimmedEmail.includes("@")) {
      Alert.alert(
        "Xatolik",
        "Email manzili noto'g'ri."
      );
      return;
    }

    if (!password) {
      Alert.alert(
        "Xatolik",
        "Parolni kiriting."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Xatolik",
        "Parol kamida 6 ta belgidan iborat bo'lishi kerak."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Xatolik",
        "Parollar bir xil emas."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(
  trimmedName,
  trimmedEmail,
  password
);

      Alert.alert(
        "Muvaffaqiyatli",
        response.message ||
          "Hisobingiz muvaffaqiyatli yaratildi.",
        [
          {
            text: "Kirish",
            onPress: () => {
              router.replace("/login");
            },
          },
        ]
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ro'yxatdan o'tishda xatolik yuz berdi.";

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ←
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              Q
            </Text>
          </View>

          <Text style={styles.title}>
            Hisob yarating
          </Text>

          <Text style={styles.subtitle}>
            Qatra bilan o'rganishni bugundan boshlang
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              To'liq ism
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ism va familiya"
              placeholderTextColor="#64748B"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

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
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Parol
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Kamida 6 ta belgi"
                placeholderTextColor="#64748B"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />

              <TouchableOpacity
                style={styles.showButton}
                onPress={() =>
                  setShowPassword((value) => !value)
                }
                disabled={loading}
              >
                <Text style={styles.showButtonText}>
                  {showPassword
                    ? "Yashirish"
                    : "Ko'rsatish"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Parolni tasdiqlang
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Parolni qayta kiriting"
                placeholderTextColor="#64748B"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />

              <TouchableOpacity
                style={styles.showButton}
                onPress={() =>
                  setShowConfirmPassword(
                    (value) => !value
                  )
                }
                disabled={loading}
              >
                <Text style={styles.showButtonText}>
                  {showConfirmPassword
                    ? "Yashirish"
                    : "Ko'rsatish"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>
                Ro'yxatdan o'tish
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Hisobingiz bormi?
          </Text>

          <TouchableOpacity
            disabled={loading}
            onPress={() =>
              router.replace("/login")
            }
          >
            <Text style={styles.loginLink}>
              Kirish
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 35,
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
    marginTop: 25,
  },

  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 23,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "800",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 15,

    textAlign: "center",
    marginTop: 10,
  },

  form: {
    marginTop: 35,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",

    marginBottom: 8,
  },

  input: {
    height: 56,
    borderRadius: 15,

    backgroundColor: "#0F172A",

    borderWidth: 1,
    borderColor: "#1E293B",

    paddingHorizontal: 16,

    color: "#FFFFFF",
    fontSize: 16,
  },

  passwordContainer: {
    height: 56,

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

    paddingHorizontal: 16,

    color: "#FFFFFF",
    fontSize: 16,
  },

  showButton: {
    paddingHorizontal: 15,
  },

  showButtonText: {
    color: "#3B82F6",
    fontSize: 13,
    fontWeight: "600",
  },

  registerButton: {
    height: 58,

    borderRadius: 16,
    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    marginTop: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  loginContainer: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    marginTop: 30,
  },

  loginText: {
    color: "#94A3B8",
    fontSize: 14,

    marginRight: 5,
  },

  loginLink: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "700",
  },
});