import { Image } from "react-native";

import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "expo-router";

import { useAuth } from "@/context/AuthContext";

import {
  getMyProfile,
  updateMyAvatar,
  type ProfileUser,
} from "@/services/profile.service";


export default function ProfileScreen() {
  const router = useRouter();

  const {
    user: authUser,
    logout,
    refreshUser,
  } = useAuth();

  const [profile, setProfile] =
    useState<ProfileUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [avatarLoading, setAvatarLoading] =
  useState(false);


  const loadProfile =
    useCallback(async () => {
      try {
        setError(null);

        const response =
          await getMyProfile();

        setProfile(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Profil ma'lumotlarini yuklashda xatolik yuz berdi."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);


  useEffect(() => {
    loadProfile();
  }, [loadProfile]);


  const handleRefresh = () => {
    setRefreshing(true);

    loadProfile();
  };


  const handleLogout = () => {
    Alert.alert(
      "Chiqish",
      "Hisobingizdan chiqmoqchimisiz?",
      [
        {
          text: "Bekor qilish",
          style: "cancel",
        },
        {
          text: "Chiqish",
          style: "destructive",

          onPress: async () => {
            try {
              setLoggingOut(true);

              await logout();

              router.replace("/login");
            } catch {
              Alert.alert(
                "Xatolik",
                "Hisobdan chiqishda xatolik yuz berdi."
              );
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const handleChangeAvatar = async () => {
  try {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Ruxsat kerak",
        "Profil rasmini tanlash uchun galereyaga ruxsat bering."
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        allowsEditing: true,

        aspect: [1, 1],

        quality: 0.8,
      });

    if (result.canceled) {
      return;
    }

    const imageUri =
      result.assets[0].uri;

    setAvatarLoading(true);

    await updateMyAvatar(imageUri);

    await refreshUser();

    await loadProfile();

    Alert.alert(
      "Muvaffaqiyatli",
      "Profil rasmi yangilandi."
    );

  } catch (error) {
    Alert.alert(
      "Xatolik",
      error instanceof Error
        ? error.message
        : "Profil rasmini yangilashda xatolik yuz berdi."
    );
  } finally {
    setAvatarLoading(false);
  }
};


  const getInitials = (
    fullName?: string
  ) => {
    if (!fullName) {
      return "?";
    }

    return fullName
      .split(" ")
      .filter(Boolean)
      .map(
        (part) => part[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };


  const getRoleName = (
    role?: string
  ) => {
    switch (role) {
      case "ADMIN":
        return "Administrator";

      case "STUDENT":
        return "Talaba";

      default:
        return role || "Foydalanuvchi";
    }
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#3B82F6"
        />

        <Text style={styles.loadingText}>
          Profil yuklanmoqda...
        </Text>
      </View>
    );
  }


  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Xatolik yuz berdi
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);

            loadProfile();
          }}
        >
          <Text style={styles.retryText}>
            Qayta urinish
          </Text>
        </Pressable>
      </View>
    );
  }


  const displayUser =
    profile || authUser;


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#3B82F6"
        />
      }
    >
      <Text style={styles.pageTitle}>
        Profil
      </Text>


      {/* PROFILE HEADER */}

      <View style={styles.profileHeader}>
        <Pressable
  style={styles.avatarWrapper}
  onPress={handleChangeAvatar}
  disabled={avatarLoading}
>
  <View style={styles.avatar}>
    {displayUser?.avatarUrl ? (
      <Image
        source={{
          uri: displayUser.avatarUrl,
        }}
        style={styles.avatarImage}
      />
    ) : (
      <Text style={styles.avatarText}>
        {getInitials(
          displayUser?.fullName
        )}
      </Text>
    )}

    {avatarLoading && (
      <View style={styles.avatarLoading}>
        <ActivityIndicator
          color="#FFFFFF"
        />
      </View>
    )}
  </View>

  <View style={styles.avatarEditBadge}>
    <Text style={styles.avatarEditText}>
      ✎
    </Text>
  </View>
</Pressable>

        <Text style={styles.fullName}>
          {displayUser?.fullName ||
            "Foydalanuvchi"}
        </Text>

        <Text style={styles.email}>
          {displayUser?.email || ""}
        </Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {getRoleName(
              displayUser?.role
            )}
          </Text>
        </View>
      </View>


      {/* ACCOUNT */}

      <Text style={styles.sectionTitle}>
        Hisob
      </Text>

      <View style={styles.card}>
        <Pressable
          style={styles.menuItem}
          onPress={() =>
            router.push("/profile/edit")
          }
        >
          <View style={styles.menuIcon}>
            <Text style={styles.menuIconText}>
              👤
            </Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>
              Profilni tahrirlash
            </Text>

            <Text style={styles.menuSubtitle}>
              Ismingizni o'zgartiring
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>


        <View style={styles.divider} />


        <Pressable
          style={styles.menuItem}
          onPress={() =>
            router.push("/profile/password")
          }
        >
          <View style={styles.menuIcon}>
            <Text style={styles.menuIconText}>
              🔒
            </Text>
          </View>

          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>
              Parolni o'zgartirish
            </Text>

            <Text style={styles.menuSubtitle}>
              Hisobingiz xavfsizligini yangilang
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>
        <Pressable
  style={styles.menuItem}
  onPress={() =>
    router.push("/my-courses")
  }
>
  <View style={styles.menuIcon}>
    <Text style={styles.menuIconText}>
      📚
    </Text>
  </View>

  <View style={styles.menuContent}>
    <Text style={styles.menuTitle}>
      Mening kurslarim
    </Text>

    <Text style={styles.menuSubtitle}>
      Yozilgan va davom etayotgan kurslar
    </Text>
  </View>

  <Text style={styles.arrow}>
    ›
  </Text>
</Pressable>

<View style={styles.divider} />

<Pressable
  style={styles.menuItem}
  onPress={() =>
    router.push("/certificates")
  }
>
  <View style={styles.menuIcon}>
    <Text style={styles.menuIconText}>
      🏆
    </Text>
  </View>

  <View style={styles.menuContent}>
    <Text style={styles.menuTitle}>
      Sertifikatlar
    </Text>

    <Text style={styles.menuSubtitle}>
      Olingan sertifikatlaringiz
    </Text>
  </View>

  <Text style={styles.arrow}>
    ›
  </Text>
</Pressable>

<View style={styles.divider} />

<Pressable
  style={styles.menuItem}
  onPress={() => router.push("/challenges")}
>
  <View style={styles.menuIcon}>
    <Text style={styles.menuIconText}>
      ⚔️
    </Text>
  </View>

  <View style={styles.menuContent}>
    <Text style={styles.menuTitle}>
      Challenges
    </Text>

    <Text style={styles.menuSubtitle}>
      Boshqa foydalanuvchilar bilan bellashing
    </Text>
  </View>

  <Text style={styles.arrow}>
    ›
  </Text>
</Pressable>

<View style={styles.divider} />
      </View>


      {/* INFORMATION */}

      <Text style={styles.sectionTitle}>
        Ma'lumotlar
      </Text>

      <View style={styles.card}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>
            Email
          </Text>

          <Text
            style={styles.infoValue}
            numberOfLines={1}
          >
            {displayUser?.email || "-"}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>
            Rol
          </Text>

          <Text style={styles.infoValue}>
            {getRoleName(
              displayUser?.role
            )}
          </Text>
        </View>
      </View>


      {/* LOGOUT */}

      <Pressable
        style={[
          styles.logoutButton,

          loggingOut &&
            styles.logoutButtonDisabled,
        ]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator
            color="#F87171"
          />
        ) : (
          <Text style={styles.logoutText}>
            Hisobdan chiqish
          </Text>
        )}
      </Pressable>


      <Text style={styles.version}>
        Qatra Mobile
      </Text>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  content: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor: "#020617",

    justifyContent: "center",
    alignItems: "center",

    padding: 24,
  },

  loadingText: {
    marginTop: 14,
    color: "#94A3B8",
    fontSize: 15,
  },

  pageTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  profileHeader: {
    alignItems: "center",
    paddingVertical: 34,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,

    backgroundColor: "#1E293B",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 2,
    borderColor: "#3B82F6",
  },

  avatarText: {
    color: "#60A5FA",
    fontSize: 30,
    fontWeight: "800",
  },

  fullName: {
    color: "#F8FAFC",
    fontSize: 23,
    fontWeight: "800",

    marginTop: 16,
  },

  email: {
    color: "#94A3B8",
    fontSize: 14,

    marginTop: 6,
  },

  roleBadge: {
    marginTop: 14,

    paddingHorizontal: 13,
    paddingVertical: 6,

    borderRadius: 20,

    backgroundColor: "#172554",
  },

  roleText: {
    color: "#60A5FA",
    fontSize: 12,
    fontWeight: "700",
  },

  sectionTitle: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",

    textTransform: "uppercase",

    marginBottom: 10,
    marginTop: 22,
  },

  card: {
    backgroundColor: "#0F172A",

    borderRadius: 18,

    borderWidth: 1,
    borderColor: "#1E293B",

    overflow: "hidden",
  },

  menuItem: {
    minHeight: 76,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
  },

  menuIcon: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor: "#1E293B",

    justifyContent: "center",
    alignItems: "center",
  },

  menuIconText: {
    fontSize: 18,
  },

  menuContent: {
    flex: 1,
    marginLeft: 13,
  },

  menuTitle: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
  },

  menuSubtitle: {
    color: "#64748B",
    fontSize: 12,

    marginTop: 4,
  },

  arrow: {
    color: "#64748B",
    fontSize: 28,
    fontWeight: "300",
  },

  divider: {
    height: 1,

    backgroundColor: "#1E293B",

    marginLeft: 16,
  },

  infoItem: {
    paddingHorizontal: 16,
    paddingVertical: 15,
  },

  infoLabel: {
    color: "#64748B",
    fontSize: 12,
  },

  infoValue: {
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "600",

    marginTop: 5,
  },

  logoutButton: {
    height: 56,

    marginTop: 34,

    borderRadius: 15,

    backgroundColor: "#1F1117",

    borderWidth: 1,
    borderColor: "#7F1D1D",

    justifyContent: "center",
    alignItems: "center",
  },

  logoutButtonDisabled: {
    opacity: 0.6,
  },

  logoutText: {
    color: "#F87171",
    fontSize: 16,
    fontWeight: "700",
  },

  errorTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
  },

  errorText: {
    color: "#F87171",
    fontSize: 14,

    textAlign: "center",

    marginTop: 10,
  },

  retryButton: {
    marginTop: 22,

    paddingHorizontal: 20,
    paddingVertical: 12,

    backgroundColor: "#3B82F6",

    borderRadius: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  version: {
    color: "#475569",
    fontSize: 12,

    textAlign: "center",

    marginTop: 28,
  },

  avatarWrapper: {
  position: "relative",
},

avatarImage: {
  width: "100%",
  height: "100%",
  borderRadius: 48,
},

avatarLoading: {
  position: "absolute",

  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  borderRadius: 48,

  backgroundColor: "rgba(0,0,0,0.55)",

  justifyContent: "center",
  alignItems: "center",
},

avatarEditBadge: {
  position: "absolute",

  right: -2,
  bottom: -2,

  width: 30,
  height: 30,

  borderRadius: 15,

  backgroundColor: "#2563EB",

  borderWidth: 2,
  borderColor: "#020617",

  justifyContent: "center",
  alignItems: "center",
},

avatarEditText: {
  color: "#FFFFFF",
  fontSize: 17,
  fontWeight: "800",
},
});