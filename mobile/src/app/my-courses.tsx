import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
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

import {
  useRouter,
} from "expo-router";

import {
  getMyCourses,
  type MyCourse,
} from "@/services/enrollment.service";


export default function MyCoursesScreen() {
  const router = useRouter();


  const [courses, setCourses] =
    useState<MyCourse[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  const loadCourses =
    useCallback(
      async (isRefresh = false) => {
        try {
          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);

          const response =
            await getMyCourses();

          setCourses(response.data);

        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Kurslarni yuklashda xatolik yuz berdi."
          );

        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );


  useEffect(() => {
    loadCourses();
  }, [loadCourses]);


  const getProgressColor = (
    progress: number
  ) => {
    if (progress >= 100) {
      return "#22C55E";
    }

    return "#3B82F6";
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#3B82F6"
          />

          <Text style={styles.loadingText}>
            Kurslar yuklanmoqda...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            Xatolik yuz berdi
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => loadCourses()}
          >
            <Text style={styles.retryText}>
              Qayta urinish
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <Pressable
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >
          <Text style={styles.backIcon}>
            ←
          </Text>
        </Pressable>


        <View style={styles.headerContent}>
          <Text style={styles.title}>
            Mening kurslarim
          </Text>

          <Text style={styles.subtitle}>
            Siz yozilgan kurslar
          </Text>
        </View>

      </View>


      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadCourses(true)
            }
            tintColor="#3B82F6"
          />
        }
      >

        {/* EMPTY STATE */}

        {courses.length === 0 ? (
          <View style={styles.emptyContainer}>

            <Text style={styles.emptyIcon}>
              📚
            </Text>

            <Text style={styles.emptyTitle}>
              Hali kurslar yo'q
            </Text>

            <Text style={styles.emptyText}>
              Siz hali hech qanday kursga
              yozilmagansiz.
            </Text>

            <Pressable
              style={styles.exploreButton}
              onPress={() =>
                router.replace("/(tabs)/courses")
              }
            >
              <Text style={styles.exploreText}>
                Kurslarni ko'rish
              </Text>
            </Pressable>

          </View>
        ) : (

          <View style={styles.coursesContainer}>

            {courses.map((item) => {
              const {
                course,
              } = item;

              const isCompleted =
                course.progress >= 100 ||
                course.completions.length > 0;


              return (
                <Pressable
                  key={item.id}
                  style={styles.courseCard}
                  onPress={() =>
                    router.push({
                      pathname:
                        "/course/[slug]",
                      params: {
                        slug: course.slug,
                      },
                    })
                  }
                >

                  {/* IMAGE */}

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
                          styles.placeholderIcon
                        }
                      >
                        📖
                      </Text>
                    </View>
                  )}


                  {/* CONTENT */}

                  <View
                    style={styles.courseContent}
                  >

                    <View
                      style={styles.courseTop}
                    >
                      <Text
                        style={styles.courseTitle}
                        numberOfLines={2}
                      >
                        {course.title}
                      </Text>


                      {isCompleted ? (
                        <View
                          style={
                            styles.completedBadge
                          }
                        >
                          <Text
                            style={
                              styles.completedBadgeText
                            }
                          >
                            ✓ Tugallangan
                          </Text>
                        </View>
                      ) : null}

                    </View>


                    {course.description ? (
                      <Text
                        style={
                          styles.description
                        }
                        numberOfLines={2}
                      >
                        {course.description}
                      </Text>
                    ) : null}


                    {/* LESSON INFO */}

                    <View
                      style={styles.lessonInfo}
                    >
                      <Text
                        style={
                          styles.lessonInfoText
                        }
                      >
                        {course.completedLessons} /{" "}
                        {course.totalLessons} dars
                      </Text>

                      <Text
                        style={
                          styles.progressText
                        }
                      >
                        {course.progress}%
                      </Text>
                    </View>


                    {/* PROGRESS BAR */}

                    <View
                      style={
                        styles.progressBackground
                      }
                    >
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width:
                              `${Math.min(
                                Math.max(
                                  course.progress,
                                  0
                                ),
                                100
                              )}%`,

                            backgroundColor:
                              getProgressColor(
                                course.progress
                              ),
                          },
                        ]}
                      />
                    </View>


                    {/* STATUS */}

                    <Text
                      style={[
                        styles.statusText,

                        isCompleted
                          ? styles.statusCompleted
                          : styles.statusActive,
                      ]}
                    >
                      {isCompleted
                        ? "Kurs muvaffaqiyatli yakunlangan"
                        : "Davom ettirish"}
                    </Text>

                  </View>

                </Pressable>
              );
            })}

          </View>
        )}

      </ScrollView>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#020617",
  },


  header: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingVertical: 16,
  },


  backButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: "#0F172A",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },


  backIcon: {
    color: "#FFFFFF",
    fontSize: 24,
  },


  headerContent: {
    flex: 1,
  },


  title: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },


  subtitle: {
    color: "#64748B",
    fontSize: 13,

    marginTop: 3,
  },


  content: {
    padding: 20,
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
    color: "#94A3B8",
    fontSize: 15,

    marginTop: 14,
  },


  errorTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",

    marginBottom: 10,
  },


  errorText: {
    color: "#94A3B8",
    fontSize: 15,

    textAlign: "center",

    lineHeight: 22,
  },


  retryButton: {
    marginTop: 22,

    backgroundColor: "#2563EB",

    paddingHorizontal: 24,
    paddingVertical: 14,

    borderRadius: 12,
  },


  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },


  emptyContainer: {
    alignItems: "center",

    paddingTop: 100,
    paddingHorizontal: 30,
  },


  emptyIcon: {
    fontSize: 55,

    marginBottom: 18,
  },


  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
  },


  emptyText: {
    color: "#94A3B8",
    fontSize: 15,

    textAlign: "center",

    lineHeight: 22,

    marginTop: 10,
  },


  exploreButton: {
    marginTop: 24,

    backgroundColor: "#2563EB",

    paddingHorizontal: 22,
    paddingVertical: 14,

    borderRadius: 14,
  },


  exploreText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },


  coursesContainer: {
    gap: 16,
  },


  courseCard: {
    backgroundColor: "#0F172A",

    borderRadius: 20,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#1E293B",
  },


  courseImage: {
    width: "100%",
    height: 150,
  },


  courseImagePlaceholder: {
    width: "100%",
    height: 150,

    backgroundColor: "#172554",

    justifyContent: "center",
    alignItems: "center",
  },


  placeholderIcon: {
    fontSize: 42,
  },


  courseContent: {
    padding: 16,
  },


  courseTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },


  courseTitle: {
    flex: 1,

    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",

    lineHeight: 25,

    paddingRight: 10,
  },


  completedBadge: {
    backgroundColor: "#052E16",

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 8,
  },


  completedBadgeText: {
    color: "#86EFAC",
    fontSize: 10,
    fontWeight: "700",
  },


  description: {
    color: "#94A3B8",
    fontSize: 14,

    lineHeight: 20,

    marginTop: 10,
  },


  lessonInfo: {
    flexDirection: "row",

    justifyContent: "space-between",

    marginTop: 18,
    marginBottom: 8,
  },


  lessonInfoText: {
    color: "#94A3B8",
    fontSize: 13,
  },


  progressText: {
    color: "#60A5FA",
    fontSize: 13,
    fontWeight: "700",
  },


  progressBackground: {
    width: "100%",
    height: 8,

    backgroundColor: "#1E293B",

    borderRadius: 10,

    overflow: "hidden",
  },


  progressFill: {
    height: "100%",

    borderRadius: 10,
  },


  statusText: {
    marginTop: 14,

    fontSize: 13,
    fontWeight: "600",
  },


  statusActive: {
    color: "#60A5FA",
  },


  statusCompleted: {
    color: "#4ADE80",
  },

});