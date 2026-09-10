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

import {
  useState,
} from "react";

import { router } from "expo-router";

import {
  changeMyPassword,
} from "@/services/profile.service";


export default function ChangePasswordScreen() {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  const handleChangePassword =
    async () => {

      if (!currentPassword) {
        Alert.alert(
          "Xatolik",
          "Joriy parolni kiriting."
        );

        return;
      }


      if (!newPassword) {
        Alert.alert(
          "Xatolik",
          "Yangi parolni kiriting."
        );

        return;
      }


      if (newPassword.length < 6) {
        Alert.alert(
          "Xatolik",
          "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak."
        );

        return;
      }


      if (
        newPassword !==
        confirmPassword
      ) {
        Alert.alert(
          "Xatolik",
          "Yangi parollar bir xil emas."
        );

        return;
      }


      if (
        currentPassword ===
        newPassword
      ) {
        Alert.alert(
          "Xatolik",
          "Yangi parol joriy paroldan farq qilishi kerak."
        );

        return;
      }


      try {
        setSaving(true);

        await changeMyPassword({
  currentPassword,
  newPassword,
  confirmPassword,
});

        Alert.alert(
          "Muvaffaqiyatli",
          "Parolingiz muvaffaqiyatli o'zgartirildi.",
          [
            {
              text: "OK",
              onPress: () =>
                router.back(),
            },
          ]
        );

      } catch (error) {

        const message =
          error instanceof Error
            ? error.message
            : "Parolni o'zgartirishda xatolik yuz berdi.";

        Alert.alert(
          "Xatolik",
          message
        );

      } finally {
        setSaving(false);
      }
    };


  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.content}>

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >
            <Text style={styles.backText}>
              ←
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            Parolni o'zgartirish
          </Text>

          <View
            style={styles.headerSpace}
          />
        </View>


        <View style={styles.form}>

          {/* CURRENT PASSWORD */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Joriy parol
            </Text>

            <View
              style={styles.passwordContainer}
            >
              <TextInput
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={
                  setCurrentPassword
                }
                placeholder="Joriy parolingiz"
                placeholderTextColor="#64748B"
                secureTextEntry={
                  !showCurrent
                }
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowCurrent(
                    !showCurrent
                  )
                }
              >
                <Text style={styles.eyeText}>
                  {showCurrent
                    ? "Yashirish"
                    : "Ko'rsatish"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>


          {/* NEW PASSWORD */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Yangi parol
            </Text>

            <View
              style={styles.passwordContainer}
            >
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={
                  setNewPassword
                }
                placeholder="Yangi parol"
                placeholderTextColor="#64748B"
                secureTextEntry={
                  !showNew
                }
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowNew(!showNew)
                }
              >
                <Text style={styles.eyeText}>
                  {showNew
                    ? "Yashirish"
                    : "Ko'rsatish"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.helperText}>
              Kamida 6 ta belgi.
            </Text>
          </View>


          {/* CONFIRM PASSWORD */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Yangi parolni tasdiqlang
            </Text>

            <View
              style={styles.passwordContainer}
            >
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={
                  setConfirmPassword
                }
                placeholder="Yangi parolni qayta kiriting"
                placeholderTextColor="#64748B"
                secureTextEntry={
                  !showConfirm
                }
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowConfirm(
                    !showConfirm
                  )
                }
              >
                <Text style={styles.eyeText}>
                  {showConfirm
                    ? "Yashirish"
                    : "Ko'rsatish"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>


          <TouchableOpacity
            style={[
              styles.saveButton,

              saving &&
                styles.disabledButton,
            ]}
            onPress={
              handleChangePassword
            }
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={styles.saveButtonText}
              >
                Parolni o'zgartirish
              </Text>
            )}
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}


const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#020617",
    },

    content: {
      flex: 1,
    },

    header: {
      height: 64,

      paddingHorizontal: 20,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      borderBottomWidth: 1,
      borderBottomColor: "#1E293B",
    },

    backButton: {
      width: 44,
      height: 44,

      justifyContent: "center",
      alignItems: "flex-start",
    },

    backText: {
      color: "#FFFFFF",
      fontSize: 28,
    },

    title: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "700",
    },

    headerSpace: {
      width: 44,
    },

    form: {
      padding: 20,
      paddingTop: 30,
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

    passwordContainer: {
      height: 56,

      flexDirection: "row",
      alignItems: "center",

      backgroundColor: "#0F172A",

      borderWidth: 1,
      borderColor: "#1E293B",

      borderRadius: 14,
    },

    passwordInput: {
      flex: 1,
      height: "100%",

      paddingHorizontal: 16,

      color: "#FFFFFF",
      fontSize: 16,
    },

    eyeButton: {
      paddingHorizontal: 16,
    },

    eyeText: {
      color: "#3B82F6",
      fontSize: 12,
      fontWeight: "600",
    },

    helperText: {
      color: "#64748B",
      fontSize: 12,
      marginTop: 7,
    },

    saveButton: {
      height: 56,

      backgroundColor: "#2563EB",

      borderRadius: 14,

      justifyContent: "center",
      alignItems: "center",

      marginTop: 8,
    },

    disabledButton: {
      opacity: 0.6,
    },

    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
  });