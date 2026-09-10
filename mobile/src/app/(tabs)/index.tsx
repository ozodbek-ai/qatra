import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { router } from "expo-router";

import { useAuth } from "@/context/AuthContext";

import {
  useNotifications,
} from "@/context/NotificationContext";

import {
  getCategories,
  type ReelCategory,
} from "@/services/reel-category.service";

import {
  getDashboard,
  type DashboardData,
} from "@/services/dashboard.service";


const CATEGORY_EMOJIS: Record<string, string> = {
  psychology: "🧠",
  history: "🏛️",
  science: "🔬",
  technology: "💻",
  business: "💼",
  education: "📚",
  language: "🌍",
  programming: "💻",
};


export default function ExploreScreen() {
  const { user } = useAuth();

  const { unreadCount } =
    useNotifications();


  const [categories, setCategories] =
    useState<ReelCategory[]>([]);

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [dashboardLoading, setDashboardLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [refreshing, setRefreshing] =
    useState(false);


  const loadCategories =
    useCallback(async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getCategories();

        setCategories(response.data);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Kategoriyalarni yuklashda xatolik yuz berdi.";

        setError(message);
      } finally {
        setLoading(false);
      }
    }, []);


  const loadDashboard =
    useCallback(async (): Promise<void> => {
      try {
        setDashboardLoading(true);

        const response =
          await getDashboard();

        setDashboard(response.data);
      } catch (error: unknown) {
        console.log(
          "Dashboard yuklashda xatolik:",
          error
        );
      } finally {
        setDashboardLoading(false);
      }
    }, []);


  const refreshAll =
    useCallback(async (): Promise<void> => {
      await Promise.all([
        loadCategories(),
        loadDashboard(),
      ]);
    }, [
      loadCategories,
      loadDashboard,
    ]);


  const handleRefresh =
    async (): Promise<void> => {
      try {
        setRefreshing(true);

        await refreshAll();
      } finally {
        setRefreshing(false);
      }
    };


  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);


  const getCategoryEmoji = (
    category: ReelCategory
  ): string => {
    return (
      CATEGORY_EMOJIS[
        category.slug.toLowerCase()
      ] || "📚"
    );
  };


  const handleCategoryPress = (
    category: ReelCategory
  ): void => {
    router.push({
      pathname: "/category/[slug]",
      params: {
        slug: category.slug,
      },
    });
  };


  const handleContinueLearning =
    (): void => {
      if (!dashboard?.continueLearning) {
        router.push("/(tabs)/courses");
        return;
      }

      router.push({
        pathname: "/lesson/[id]",
        params: {
          id: dashboard.continueLearning.lessonId,
        },
      });
    };


  const handleCoursePress = (
    slug: string
  ): void => {
    router.push({
      pathname: "/course/[slug]",
      params: {
        slug,
      },
    });
  };


  const displayName =
    dashboard?.user?.fullName ||
    user?.fullName ||
    "Foydalanuvchi";


  const avatarUrl =
    dashboard?.user?.avatarUrl ||
    user?.avatarUrl ||
    null;


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              void handleRefresh();
            }}
            tintColor="#2563EB"
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerUser}>
            <Text style={styles.greeting}>
              Assalomu alaykum 👋
            </Text>

            <Text style={styles.name}>
              {displayName}
            </Text>
          </View>


          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.8}
              onPress={() =>
                router.push("/notification")
              }
            >
              <Text style={styles.notificationIcon}>
                🔔
              </Text>

              {unreadCount > 0 ? (
                <View
                  style={styles.notificationBadge}
                >
                  <Text
                    style={
                      styles.notificationBadgeText
                    }
                  >
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>


            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push("/(tabs)/profile")
              }
            >
              <View style={styles.avatar}>
                {avatarUrl ? (
                  <Image
                    source={{
                      uri: avatarUrl,
                    }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {displayName
                      .charAt(0)
                      .toUpperCase()}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.hero}>
          <Text style={styles.heroSmall}>
            BUGUNGI O'RGANISH
          </Text>

          <Text style={styles.heroTitle}>
            {dashboard?.continueLearning
              ? "O'rganishni davom ettiring"
              : "Bilimingizni kengaytiring"}
          </Text>

          <Text style={styles.heroDescription}>
            {dashboard?.continueLearning
              ? `${dashboard.continueLearning.courseTitle} kursidagi ${dashboard.continueLearning.lessonTitle} darsidan davom eting.`
              : "Qatra bilan har kuni yangi bilimlarga ega bo'ling."}
          </Text>

          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.8}
            onPress={handleContinueLearning}
          >
            <Text style={styles.continueButtonText}>
              {dashboard?.continueLearning
                ? "Davom ettirish →"
                : "Kurslarni ko'rish →"}
            </Text>
          </TouchableOpacity>
        </View>


        {!dashboardLoading && dashboard ? (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {dashboard.stats.enrolledCourses}
              </Text>

              <Text style={styles.statLabel}>
                Kurslar
              </Text>
            </View>


            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {dashboard.stats.completedLessons}
              </Text>

              <Text style={styles.statLabel}>
                Darslar
              </Text>
            </View>


            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {dashboard.stats.averageProgress}%
              </Text>

              <Text style={styles.statLabel}>
                Progress
              </Text>
            </View>
          </View>
        ) : null}


        {!dashboardLoading &&
        dashboard &&
        dashboard.recentCourses.length > 0 ? (
          <View style={styles.coursesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Mening kurslarim
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push("/(tabs)/courses")
                }
              >
                <Text style={styles.seeAll}>
                  Barchasi
                </Text>
              </TouchableOpacity>
            </View>


            {dashboard.recentCourses
              .slice(0, 3)
              .map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={styles.courseCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    handleCoursePress(course.slug)
                  }
                >
                  <View style={styles.courseInfo}>
                    <Text
                      style={styles.courseTitle}
                      numberOfLines={2}
                    >
                      {course.title}
                    </Text>

                    <Text style={styles.courseLessons}>
                      {course.completedLessons} /{" "}
                      {course.totalLessons} dars
                    </Text>

                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(
                              Math.max(
                                course.progress,
                                0
                              ),
                              100
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <Text style={styles.courseProgress}>
                    {course.progress}%
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        ) : null}


        {!dashboardLoading &&
        dashboard &&
        dashboard.recommendedCourses.length > 0 ? (
          <View
            style={
              styles.recommendedCoursesSection
            }
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Siz uchun
              </Text>
            </View>


            {dashboard.recommendedCourses
              .slice(0, 3)
              .map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={
                    styles.recommendedCourseCard
                  }
                  activeOpacity={0.8}
                  onPress={() =>
                    handleCoursePress(course.slug)
                  }
                >
                  {course.imageUrl ? (
                    <Image
                      source={{
                        uri: course.imageUrl,
                      }}
                      style={styles.courseImage}
                    />
                  ) : (
                    <View
                      style={
                        styles.courseImagePlaceholder
                      }
                    >
                      <Text
                        style={
                          styles.courseImageEmoji
                        }
                      >
                        📚
                      </Text>
                    </View>
                  )}

                  <Text
                    style={
                      styles.recommendedCourseTitle
                    }
                    numberOfLines={2}
                  >
                    {course.title}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        ) : null}


        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Mavzular
          </Text>

          <TouchableOpacity
            onPress={() => {
              void refreshAll();
            }}
          >
            <Text style={styles.seeAll}>
              Yangilash
            </Text>
          </TouchableOpacity>
        </View>


        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#2563EB"
            />

            <Text style={styles.loadingText}>
              Mavzular yuklanmoqda...
            </Text>
          </View>
        ) : null}


        {!loading && error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>
              Xatolik yuz berdi
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                void refreshAll();
              }}
            >
              <Text style={styles.retryButtonText}>
                Qayta urinish
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}


        {!loading &&
        !error &&
        categories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>
              📚
            </Text>

            <Text style={styles.emptyTitle}>
              Hozircha mavzular yo'q
            </Text>

            <Text style={styles.emptyText}>
              Tez orada yangi mavzular qo'shiladi.
            </Text>
          </View>
        ) : null}


        {!loading &&
        !error &&
        categories.length > 0 ? (
          <View style={styles.categories}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                activeOpacity={0.8}
                onPress={() =>
                  handleCategoryPress(category)
                }
              >
                <View style={styles.categoryIcon}>
                  <Text style={styles.categoryEmoji}>
                    {getCategoryEmoji(category)}
                  </Text>
                </View>


                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>
                    {category.name}
                  </Text>

                  <Text
                    style={
                      styles.categoryDescription
                    }
                    numberOfLines={2}
                  >
                    {category.description ||
                      "Ushbu mavzu bo'yicha darslarni o'rganing"}
                  </Text>

                  {category._count ? (
                    <Text style={styles.lessonCount}>
                      {category._count.reels} ta dars
                    </Text>
                  ) : null}
                </View>

                <Text style={styles.arrow}>
                  ›
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  headerUser: {
    flex: 1,
    paddingRight: 12,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  greeting: {
    color: "#94A3B8",
    fontSize: 14,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },

  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    position: "relative",
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  notificationIcon: {
    fontSize: 21,
  },

  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#020617",
  },

  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  hero: {
    backgroundColor: "#172554",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1E40AF",
  },

  heroSmall: {
    color: "#93C5FD",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 10,
  },

  heroDescription: {
    color: "#BFDBFE",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },

  continueButton: {
    alignSelf: "flex-start",
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },

  statLabel: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 5,
  },

  coursesSection: {
    marginBottom: 28,
  },

  recommendedCoursesSection: {
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  seeAll: {
    color: "#60A5FA",
    fontSize: 13,
    fontWeight: "700",
  },

  courseCard: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  courseInfo: {
    flex: 1,
    marginRight: 12,
  },

  courseTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  courseLessons: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 7,
  },

  progressBar: {
    height: 6,
    backgroundColor: "#1E293B",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 10,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 3,
  },

  courseProgress: {
    color: "#60A5FA",
    fontSize: 15,
    fontWeight: "800",
  },

  recommendedCourseCard: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  courseImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
  },

  courseImagePlaceholder: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    backgroundColor: "#172554",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  courseImageEmoji: {
    fontSize: 42,
  },

  recommendedCourseTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },

  loadingText: {
    color: "#94A3B8",
    marginTop: 14,
    fontSize: 14,
  },

  errorContainer: {
    backgroundColor: "#1F1117",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },

  errorTitle: {
    color: "#FCA5A5",
    fontSize: 17,
    fontWeight: "800",
  },

  errorText: {
    color: "#CBD5E1",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  retryButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 16,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: 14,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  emptyText: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },

  categories: {
    gap: 10,
  },

  categoryCard: {
    backgroundColor: "#0F172A",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#172554",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  categoryEmoji: {
    fontSize: 26,
  },

  categoryContent: {
    flex: 1,
  },

  categoryTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  categoryDescription: {
    color: "#94A3B8",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  lessonCount: {
    color: "#60A5FA",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
  },

  arrow: {
    color: "#64748B",
    fontSize: 28,
    marginLeft: 10,
  },
});