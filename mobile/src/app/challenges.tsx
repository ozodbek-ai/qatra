import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  acceptChallenge,
  Challenge,
  createChallenge,
  declineChallenge,
  deleteChallenge,
  getMyChallenges,
} from "@/services/challenge.service";

import {
  searchChallengeUsers,
  type ChallengeUser,
} from "@/services/challenge-user.service";

import {
  getCourses,
  type Course,
} from "@/services/course.service";


export default function ChallengesScreen() {
  const [challenges, setChallenges] =
    useState<Challenge[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);


  /*
  |--------------------------------------------------------------------------
  | CREATE CHALLENGE MODAL
  |--------------------------------------------------------------------------
  */

  const [createModalVisible, setCreateModalVisible] =
    useState(false);

  const [courses, setCourses] =
    useState<Course[]>([]);

  const [coursesLoading, setCoursesLoading] =
    useState(false);

  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);

  const [searchText, setSearchText] =
    useState("");

  const [users, setUsers] =
    useState<ChallengeUser[]>([]);

  const [usersLoading, setUsersLoading] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<ChallengeUser | null>(null);

  const [creating, setCreating] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | LOAD CHALLENGES
  |--------------------------------------------------------------------------
  */

  const loadChallenges =
    useCallback(async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response =
          await getMyChallenges();

        setChallenges(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.log(
          "Challenge yuklashda xatolik:",
          error
        );

        Alert.alert(
          "Xatolik",
          error instanceof Error
            ? error.message
            : "Challenge'larni yuklashda xatolik yuz berdi."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);


  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);


  /*
  |--------------------------------------------------------------------------
  | LOAD COURSES
  |--------------------------------------------------------------------------
  */

  const loadCourses =
    async () => {
      try {
        setCoursesLoading(true);

        const response =
          await getCourses();

        setCourses(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        Alert.alert(
          "Xatolik",
          error instanceof Error
            ? error.message
            : "Kurslarni yuklashda xatolik yuz berdi."
        );
      } finally {
        setCoursesLoading(false);
      }
    };


  /*
  |--------------------------------------------------------------------------
  | OPEN CREATE MODAL
  |--------------------------------------------------------------------------
  */

  const openCreateModal =
    async () => {
      setSelectedCourse(null);
      setSelectedUser(null);
      setSearchText("");
      setUsers([]);

      setCreateModalVisible(true);

      await loadCourses();
    };


  /*
  |--------------------------------------------------------------------------
  | SEARCH USER
  |--------------------------------------------------------------------------
  */

  const handleSearchUser =
    async () => {
      const search = searchText.trim();

      if (!search) {
        setUsers([]);

        return;
      }

      try {
        setUsersLoading(true);

        const response =
          await searchChallengeUsers(search);

        setUsers(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        Alert.alert(
          "Xatolik",
          error instanceof Error
            ? error.message
            : "Foydalanuvchilarni qidirishda xatolik yuz berdi."
        );
      } finally {
        setUsersLoading(false);
      }
    };


  /*
  |--------------------------------------------------------------------------
  | CREATE CHALLENGE
  |--------------------------------------------------------------------------
  */

  const handleCreateChallenge =
    async () => {
      if (!selectedCourse) {
        Alert.alert(
          "Kurs tanlanmagan",
          "Avval kursni tanlang."
        );

        return;
      }

      if (!selectedUser) {
        Alert.alert(
          "Raqib tanlanmagan",
          "Challenge uchun foydalanuvchini tanlang."
        );

        return;
      }

      try {
        setCreating(true);

        await createChallenge({
          courseId: selectedCourse.id,
          opponentId: selectedUser.id,
        });

        setCreateModalVisible(false);

        Alert.alert(
          "Muvaffaqiyatli",
          "Challenge muvaffaqiyatli yaratildi."
        );

        await loadChallenges(true);
      } catch (error) {
        Alert.alert(
          "Xatolik",
          error instanceof Error
            ? error.message
            : "Challenge yaratishda xatolik yuz berdi."
        );
      } finally {
        setCreating(false);
      }
    };


  /*
  |--------------------------------------------------------------------------
  | ACCEPT
  |--------------------------------------------------------------------------
  */

  const handleAccept =
    async (challengeId: string) => {
      try {
        setActionLoading(challengeId);

        await acceptChallenge(challengeId);

        await loadChallenges(true);
      } catch (error) {
        Alert.alert(
          "Xatolik",
          error instanceof Error
            ? error.message
            : "Challenge qabul qilishda xatolik yuz berdi."
        );
      } finally {
        setActionLoading(null);
      }
    };


  /*
  |--------------------------------------------------------------------------
  | DECLINE
  |--------------------------------------------------------------------------
  */

  const handleDecline =
    (challengeId: string) => {
      Alert.alert(
        "Challenge'ni rad etish",
        "Haqiqatan ham bu challenge'ni rad etmoqchimisiz?",
        [
          {
            text: "Bekor qilish",
            style: "cancel",
          },

          {
            text: "Rad etish",
            style: "destructive",

            onPress: async () => {
              try {
                setActionLoading(challengeId);

                await declineChallenge(challengeId);

                await loadChallenges(true);
              } catch (error) {
                Alert.alert(
                  "Xatolik",
                  error instanceof Error
                    ? error.message
                    : "Challenge rad etishda xatolik yuz berdi."
                );
              } finally {
                setActionLoading(null);
              }
            },
          },
        ]
      );
    };


  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete =
    (challengeId: string) => {
      Alert.alert(
        "Challenge'ni o'chirish",
        "Haqiqatan ham bu challenge'ni o'chirmoqchimisiz?",
        [
          {
            text: "Bekor qilish",
            style: "cancel",
          },

          {
            text: "O'chirish",
            style: "destructive",

            onPress: async () => {
              try {
                setActionLoading(challengeId);

                await deleteChallenge(challengeId);

                await loadChallenges(true);
              } catch (error) {
                Alert.alert(
                  "Xatolik",
                  error instanceof Error
                    ? error.message
                    : "Challenge o'chirishda xatolik yuz berdi."
                );
              } finally {
                setActionLoading(null);
              }
            },
          },
        ]
      );
    };


  /*
  |--------------------------------------------------------------------------
  | STATUS
  |--------------------------------------------------------------------------
  */

  const getStatusText =
    (status: string) => {
      switch (status) {
        case "PENDING":
          return "Kutilmoqda";

        case "ACCEPTED":
          return "Faol";

        case "DECLINED":
          return "Rad etilgan";

        case "COMPLETED":
          return "Tugallangan";

        default:
          return status;
      }
    };


  const getStatusStyle =
    (status: string) => {
      switch (status) {
        case "PENDING":
          return styles.statusPending;

        case "ACCEPTED":
          return styles.statusAccepted;

        case "DECLINED":
          return styles.statusDeclined;

        case "COMPLETED":
          return styles.statusCompleted;

        default:
          return styles.statusPending;
      }
    };


  /*
  |--------------------------------------------------------------------------
  | CHALLENGE CARD
  |--------------------------------------------------------------------------
  */

  const renderChallenge =
    ({ item }: { item: Challenge }) => {
      const isLoading =
        actionLoading === item.id;

      return (
        <Pressable
  style={styles.card}
  onPress={() =>
    router.push({
      pathname: "/challenge/[id]",
      params: {
        id: item.id,
      },
    })
  }
>
          <View style={styles.cardHeader}>
            <View style={styles.courseContainer}>
              <Text style={styles.courseLabel}>
                Kurs
              </Text>

              <Text style={styles.courseTitle}>
                {item.course?.title ||
                  "Noma'lum kurs"}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                getStatusStyle(item.status),
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>


          <View style={styles.divider} />


          <View style={styles.usersContainer}>
            <View style={styles.userBox}>
              <Text style={styles.userLabel}>
                Challenger
              </Text>

              <Text style={styles.userName}>
                {item.challenger?.fullName ||
                  "Foydalanuvchi"}
              </Text>
            </View>

            <Text style={styles.vsText}>
              VS
            </Text>

            <View style={styles.userBox}>
              <Text style={styles.userLabel}>
                Raqib
              </Text>

              <Text style={styles.userName}>
                {item.opponent?.fullName ||
                  "Foydalanuvchi"}
              </Text>
            </View>
          </View>


          {item.status === "PENDING" && (
            <View style={styles.actions}>
              <Pressable
                style={[
                  styles.acceptButton,
                  isLoading &&
                    styles.buttonDisabled,
                ]}
                disabled={isLoading}
                onPress={() =>
                  handleAccept(item.id)
                }
              >
                {isLoading ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                  />
                ) : (
                  <Text
                    style={
                      styles.acceptButtonText
                    }
                  >
                    Qabul qilish
                  </Text>
                )}
              </Pressable>


              <Pressable
                style={[
                  styles.declineButton,
                  isLoading &&
                    styles.buttonDisabled,
                ]}
                disabled={isLoading}
                onPress={() =>
                  handleDecline(item.id)
                }
              >
                <Text
                  style={
                    styles.declineButtonText
                  }
                >
                  Rad etish
                </Text>
              </Pressable>
            </View>
          )}


          {(item.status === "DECLINED" ||
            item.status === "COMPLETED") && (
            <Pressable
              style={[
                styles.deleteButton,
                isLoading &&
                  styles.buttonDisabled,
              ]}
              disabled={isLoading}
              onPress={() =>
                handleDelete(item.id)
              }
            >
              {isLoading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text
                  style={
                    styles.deleteButtonText
                  }
                >
                  O'chirish
                </Text>
              )}
            </Pressable>
          )}
        </Pressable>
      );
    };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#3B82F6"
        />

        <Text style={styles.loadingText}>
          Challenge'lar yuklanmoqda...
        </Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Challenges
          </Text>

          <Text style={styles.subtitle}>
            Boshqa foydalanuvchilar bilan bellashing
          </Text>
        </View>

        <Pressable
          style={styles.createButton}
          onPress={openCreateModal}
        >
          <Text style={styles.createButtonText}>
            +
          </Text>
        </Pressable>
      </View>


      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={renderChallenge}
        contentContainerStyle={
          challenges.length === 0
            ? styles.emptyList
            : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadChallenges(true)
            }
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>
              🏆
            </Text>

            <Text style={styles.emptyTitle}>
              Hozircha challenge yo'q
            </Text>

            <Text style={styles.emptyText}>
              Yangi challenge yaratish uchun yuqoridagi +
              tugmasini bosing.
            </Text>
          </View>
        }
      />


      {/* CREATE CHALLENGE MODAL */}

      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() =>
          setCreateModalVisible(false)
        }
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() =>
              setCreateModalVisible(false)
            }
          />

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Yangi Challenge
              </Text>

              <Pressable
                onPress={() =>
                  setCreateModalVisible(false)
                }
              >
                <Text style={styles.closeText}>
                  ✕
                </Text>
              </Pressable>
            </View>


            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              {/* COURSE */}

              <Text style={styles.formLabel}>
                Kursni tanlang
              </Text>

              {coursesLoading ? (
                <ActivityIndicator
                  color="#3B82F6"
                  style={styles.formLoader}
                />
              ) : (
                <View style={styles.courseList}>
                  {courses.map((course) => {
                    const selected =
                      selectedCourse?.id === course.id;

                    return (
                      <Pressable
                        key={course.id}
                        style={[
                          styles.selectItem,
                          selected &&
                            styles.selectItemActive,
                        ]}
                        onPress={() =>
                          setSelectedCourse(course)
                        }
                      >
                        <Text
                          style={[
                            styles.selectItemText,
                            selected &&
                              styles.selectItemTextActive,
                          ]}
                        >
                          {course.title}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}


              {/* USER */}

              <Text style={styles.formLabel}>
                Raqib emailini kiriting
              </Text>

              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="example@email.com"
                  placeholderTextColor="#64748B"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <Pressable
                  style={styles.searchButton}
                  onPress={handleSearchUser}
                >
                  <Text style={styles.searchButtonText}>
                    Qidirish
                  </Text>
                </Pressable>
              </View>


              {usersLoading && (
                <ActivityIndicator
                  color="#3B82F6"
                  style={styles.formLoader}
                />
              )}


              {users.map((user) => {
                const selected =
                  selectedUser?.id === user.id;

                return (
                  <Pressable
                    key={user.id}
                    style={[
                      styles.userSelectItem,
                      selected &&
                        styles.selectItemActive,
                    ]}
                    onPress={() =>
                      setSelectedUser(user)
                    }
                  >
                    <View>
                      <Text
                        style={[
                          styles.userSelectName,
                          selected &&
                            styles.selectItemTextActive,
                        ]}
                      >
                        {user.fullName}
                      </Text>

                      <Text
                        style={styles.userSelectEmail}
                      >
                        {user.email}
                      </Text>
                    </View>

                    {selected && (
                      <Text style={styles.check}>
                        ✓
                      </Text>
                    )}
                  </Pressable>
                );
              })}


              <Pressable
                style={[
                  styles.submitButton,
                  creating &&
                    styles.buttonDisabled,
                ]}
                disabled={creating}
                onPress={handleCreateChallenge}
              >
                {creating ? (
                  <ActivityIndicator
                    color="#FFFFFF"
                  />
                ) : (
                  <Text style={styles.submitButtonText}>
                    Challenge yaratish
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,

    backgroundColor: "#FFFFFF",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
  },

  createButton: {
    width: 46,
    height: 46,

    borderRadius: 23,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "400",
  },

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    padding: 18,

    marginBottom: 14,

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  courseContainer: {
    flex: 1,
    paddingRight: 10,
  },

  courseLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
  },

  courseTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusPending: {
    backgroundColor: "#FEF3C7",
  },

  statusAccepted: {
    backgroundColor: "#DCFCE7",
  },

  statusDeclined: {
    backgroundColor: "#FEE2E2",
  },

  statusCompleted: {
    backgroundColor: "#DBEAFE",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 18,
  },

  usersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userBox: {
    flex: 1,
  },

  userLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 5,
  },

  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },

  vsText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2563EB",
    marginHorizontal: 10,
  },

  actions: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },

  acceptButton: {
    flex: 1,
    height: 46,

    backgroundColor: "#2563EB",

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",
  },

  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  declineButton: {
    flex: 1,
    height: 46,

    backgroundColor: "#F1F5F9",

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",
  },

  declineButtonText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
  },

  deleteButton: {
    height: 46,

    backgroundColor: "#EF4444",

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 18,
  },

  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  center: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#F8FAFC",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 40,
  },

  emptyEmoji: {
    fontSize: 54,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },

  emptyText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    position: "absolute",

    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    maxHeight: "85%",

    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    padding: 20,
    paddingBottom: 35,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 22,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },

  closeText: {
    fontSize: 24,
    color: "#64748B",
  },

  formLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",

    marginBottom: 10,
    marginTop: 10,
  },

  formLoader: {
    marginVertical: 20,
  },

  courseList: {
    gap: 8,
  },

  selectItem: {
    paddingHorizontal: 15,
    paddingVertical: 14,

    borderWidth: 1,
    borderColor: "#E2E8F0",

    borderRadius: 12,
  },

  selectItemActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },

  selectItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  selectItemTextActive: {
    color: "#2563EB",
  },

  searchContainer: {
    flexDirection: "row",
    gap: 8,
  },

  searchInput: {
    flex: 1,

    height: 48,

    borderWidth: 1,
    borderColor: "#CBD5E1",

    borderRadius: 12,

    paddingHorizontal: 14,

    color: "#0F172A",
  },

  searchButton: {
    height: 48,

    paddingHorizontal: 16,

    backgroundColor: "#2563EB",

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",
  },

  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  userSelectItem: {
    marginTop: 10,

    padding: 14,

    borderWidth: 1,
    borderColor: "#E2E8F0",

    borderRadius: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userSelectName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
  },

  userSelectEmail: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  check: {
    fontSize: 20,
    color: "#2563EB",
    fontWeight: "800",
  },

  submitButton: {
    height: 54,

    marginTop: 25,

    backgroundColor: "#2563EB",

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});