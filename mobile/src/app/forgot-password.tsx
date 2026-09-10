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

import { router } from "expo-router";

import {
  forgotPassword,
} from "@/services/auth.service";


export default function ForgotPasswordScreen() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleForgotPassword = async () => {
    const trimmedEmail =
      email.trim().toLowerCase();

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

    try {
      setLoading(true);

      const response =
        await forgotPassword(
          trimmedEmail
        );

      Alert.alert(
        "Email yuborildi",
        response.message ||
          "Parolni tiklash havolasi emailingizga yuborildi.",
        [
          {
            text: "Login sahifasiga qaytish",
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
          : "Parolni tiklash so'rovini yuborishda xatolik yuz berdi.";

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

        {/* BACK */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.backText}>
            ←
          </Text>
        </TouchableOpacity>


        {/* HEADER */}

        <View style={styles.header}>

          <View style={styles.iconContainer}>
            <Text style={styles.icon}>
              🔐
            </Text>
          </View>

          <Text style={styles.title}>
            Parolni tiklash
          </Text>

          <Text style={styles.subtitle}>
            Email manzilingizni kiriting. Sizga parolni tiklash uchun havola yuboramiz.
          </Text>

        </View>


        {/* FORM */}

        <View style={styles.form}>

          <Text style={styles.label}>
            Email manzili
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


          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleForgotPassword}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.submitButtonText}>
                Havolani yuborish
              </Text>
            )}
          </TouchableOpacity>

        </View>


        {/* LOGIN */}

        <View style={styles.loginContainer}>

          <Text style={styles.loginText}>
            Parolingiz esingizdami?
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.replace("/login")
            }
            disabled={loading}
          >
            <Text style={styles.loginLink}>
              Kirish
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
    marginTop: 55,
  },

  iconContainer: {
    width: 82,
    height: 82,

    borderRadius: 24,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 28,
  },

  icon: {
    fontSize: 36,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "800",
  },

  subtitle: {
    color: "#94A3B8",

    fontSize: 15,

    lineHeight: 22,

    textAlign: "center",

    marginTop: 12,

    paddingHorizontal: 10,
  },

  form: {
    marginTop: 48,
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

  submitButton: {
    height: 58,

    borderRadius: 16,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    marginTop: 24,
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "700",
  },

  loginContainer: {
    marginTop: "auto",

    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    color: "#94A3B8",

    fontSize: 14,

    marginRight: 6,
  },

  loginLink: {
    color: "#3B82F6",

    fontSize: 14,
    fontWeight: "700",
  },
});