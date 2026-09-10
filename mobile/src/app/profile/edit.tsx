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
  useEffect,
  useState,
} from "react";

import { router } from "expo-router";

import {
  getMyProfile,
  updateMyProfile,
} from "@/services/profile.service";

import {
  useAuth,
} from "@/context/AuthContext";


export default function EditProfileScreen() {
  const { refreshUser } =
    useAuth();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  useEffect(() => {
    loadProfile();
  }, []);


  const loadProfile = async () => {
    try {
      setLoading(true);

      const response =
        await getMyProfile();

      setFullName(
        response.data.fullName || ""
      );

      setEmail(
        response.data.email || ""
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Profilni yuklashda xatolik yuz berdi.";

      Alert.alert(
        "Xatolik",
        message
      );
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert(
        "Xatolik",
        "Ism va familiyangizni kiriting."
      );

      return;
    }


    try {
      setSaving(true);

      await updateMyProfile({
  fullName: fullName.trim(),
});

      await refreshUser();

      Alert.alert(
        "Muvaffaqiyatli",
        "Profilingiz yangilandi.",
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
          : "Profilni yangilashda xatolik yuz berdi.";

      Alert.alert(
        "Xatolik",
        message
      );
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#3B82F6"
          />

          <Text style={styles.loadingText}>
            Profil yuklanmoqda...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


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
            Profilni tahrirlash
          </Text>

          <View
            style={styles.headerSpace}
          />
        </View>


        <View style={styles.form}>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              To'liq ism
            </Text>

            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ismingizni kiriting"
              placeholderTextColor="#64748B"
              autoCapitalize="words"
            />
          </View>


          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.disabledInput,
              ]}
              value={email}
              editable={false}
              placeholderTextColor="#64748B"
            />

            <Text style={styles.helperText}>
              Email manzilini hozircha
              o'zgartirib bo'lmaydi.
            </Text>
          </View>


          <TouchableOpacity
            style={[
              styles.saveButton,

              saving &&
                styles.disabledButton,
            ]}
            onPress={handleSave}
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
                Saqlash
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

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    loadingText: {
      color: "#94A3B8",
      fontSize: 14,
      marginTop: 14,
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
      marginBottom: 24,
    },

    label: {
      color: "#E2E8F0",
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 9,
    },

    input: {
      height: 56,

      backgroundColor: "#0F172A",

      borderWidth: 1,
      borderColor: "#1E293B",

      borderRadius: 14,

      paddingHorizontal: 16,

      color: "#FFFFFF",
      fontSize: 16,
    },

    disabledInput: {
      opacity: 0.6,
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

      marginTop: 10,
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