import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  useEffect,
  useState,
} from "react";

import {
  Course,
  CourseLesson,
  getCourseBySlug,
} from "@/services/course.service";


type CourseData = Course & {
  lessons?: CourseLesson[];
};


export default function CourseDetailScreen() {
  const { slug } =
    useLocalSearchParams<{
      slug: string;
    }>();

  const router = useRouter();

  const [course, setCourse] =
    useState<CourseData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  const loadCourse = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!slug) {
        throw new Error(
          "Kurs manzili topilmadi."
        );
      }

      const response =
        await getCourseBySlug(slug);

      setCourse(response.data);

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Kursni yuklashda xatolik yuz berdi.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadCourse();
  }, [slug]);


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />

          <Text style={styles.loadingText}>
            Kurs yuklanmoqda...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  if (error || !course) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            Xatolik yuz berdi
          </Text>

          <Text style={styles.errorText}>
            {error ||
              "Kurs ma'lumotlari topilmadi."}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadCourse}
          >
            <Text style={styles.retryButtonText}>
              Qayta urinish
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButtonSimple}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonSimpleText}>
              Orqaga qaytish
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }


  const lessons =
    course.lessons || [];


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* BACK */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ←
          </Text>
        </TouchableOpacity>


        {/* COURSE HEADER */}

        <View style={styles.courseHeader}>
          <View style={styles.courseIcon}>
            <Text style={styles.courseIconText}>
              📚
            </Text>
          </View>

          <Text style={styles.courseTitle}>
            {course.title}
          </Text>

          {course.description ? (
            <Text
              style={
                styles.courseDescription
              }
            >
              {course.description}
            </Text>
          ) : null}
        </View>


        {/* COURSE INFO */}

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>
              {lessons.length}
            </Text>

            <Text style={styles.infoLabel}>
              Dars
            </Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>
              {course.isPublished
                ? "✓"
                : "—"}
            </Text>

            <Text style={styles.infoLabel}>
              Holati
            </Text>
          </View>
        </View>


        {/* LESSONS */}

        <View style={styles.lessonsHeader}>
          <Text style={styles.lessonsTitle}>
            Darslar
          </Text>

          <Text style={styles.lessonsCount}>
            {lessons.length} ta dars
          </Text>
        </View>


        {lessons.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>
              📭
            </Text>

            <Text style={styles.emptyTitle}>
              Hozircha darslar yo'q
            </Text>

            <Text style={styles.emptyText}>
              Bu kursga darslar tez orada
              qo'shiladi.
            </Text>
          </View>
        ) : (
          <View style={styles.lessons}>
            {lessons.map(
              (lesson, index) => (
                <TouchableOpacity
                  key={lesson.id}
                  style={styles.lessonCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    console.log(
                      "LESSON:",
                      lesson
                    );

                    /*
                     * Keyingi bosqichda
                     * lesson player sahifasiga
                     * o'tkazamiz.
                     */
                  }}
                >
                  <View
                    style={
                      styles.lessonNumber
                    }
                  >
                    <Text
                      style={
                        styles.lessonNumberText
                      }
                    >
                      {index + 1}
                    </Text>
                  </View>


                  <View
                    style={
                      styles.lessonContent
                    }
                  >
                    <Text
                      style={
                        styles.lessonTitle
                      }
                      numberOfLines={2}
                    >
                      {lesson.title}
                    </Text>


                    {lesson.description ? (
                      <Text
                        style={
                          styles.lessonDescription
                        }
                        numberOfLines={2}
                      >
                        {lesson.description}
                      </Text>
                    ) : null}


                    <View
                      style={
                        styles.lessonMeta
                      }
                    >
                      <Text
                        style={
                          styles.lessonMetaText
                        }
                      >
                        🎬 Video dars
                      </Text>

                      {lesson.duration ? (
                        <Text
                          style={
                            styles.lessonMetaText
                          }
                        >
                          • {lesson.duration} daqiqa
                        </Text>
                      ) : null}
                    </View>
                  </View>


                  <View
                    style={
                      styles.playButton
                    }
                  >
                    <Text
                      style={
                        styles.playText
                      }
                    >
                      ▶
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            )}
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


  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 50,
  },


  center: {
    flex: 1,
    paddingHorizontal: 30,

    justifyContent: "center",
    alignItems: "center",
  },


  loadingText: {
    color: "#94A3B8",
    fontSize: 15,
    marginTop: 16,
  },


  errorTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },


  errorText: {
    color: "#94A3B8",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },


  retryButton: {
    marginTop: 24,

    backgroundColor: "#2563EB",

    paddingHorizontal: 22,
    paddingVertical: 13,

    borderRadius: 14,
  },


  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },


  backButtonSimple: {
    marginTop: 18,
  },


  backButtonSimpleText: {
    color: "#3B82F6",
    fontSize: 15,
    fontWeight: "700",
  },


  backButton: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor: "#0F172A",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 24,
  },


  backText: {
    color: "#FFFFFF",
    fontSize: 27,
  },


  courseHeader: {
    marginBottom: 26,
  },


  courseIcon: {
    width: 72,
    height: 72,

    borderRadius: 22,

    backgroundColor: "#172554",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 18,
  },


  courseIconText: {
    fontSize: 34,
  },


  courseTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 38,
  },


  courseDescription: {
    color: "#94A3B8",
    fontSize: 15,

    lineHeight: 23,

    marginTop: 12,
  },


  infoRow: {
    height: 86,

    flexDirection: "row",

    backgroundColor: "#0F172A",

    borderRadius: 20,

    borderWidth: 1,
    borderColor: "#1E293B",

    marginBottom: 34,
  },


  infoItem: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },


  infoDivider: {
    width: 1,
    height: 42,

    backgroundColor: "#1E293B",

    alignSelf: "center",
  },


  infoNumber: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },


  infoLabel: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 5,
  },


  lessonsHeader: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 16,
  },


  lessonsTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },


  lessonsCount: {
    color: "#64748B",
    fontSize: 14,
  },


  lessons: {
    gap: 12,
  },


  lessonCard: {
    backgroundColor: "#0F172A",

    borderWidth: 1,
    borderColor: "#1E293B",

    borderRadius: 20,

    padding: 16,

    flexDirection: "row",
    alignItems: "center",
  },


  lessonNumber: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: "#172554",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 13,
  },


  lessonNumberText: {
    color: "#60A5FA",
    fontSize: 16,
    fontWeight: "800",
  },


  lessonContent: {
    flex: 1,
  },


  lessonTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",

    lineHeight: 22,
  },


  lessonDescription: {
    color: "#94A3B8",
    fontSize: 13,

    lineHeight: 18,

    marginTop: 4,
  },


  lessonMeta: {
    flexDirection: "row",
    marginTop: 8,
  },


  lessonMetaText: {
    color: "#64748B",
    fontSize: 12,
  },


  playButton: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    marginLeft: 10,
  },


  playText: {
    color: "#FFFFFF",
    fontSize: 14,

    marginLeft: 2,
  },


  emptyContainer: {
    backgroundColor: "#0F172A",

    borderWidth: 1,
    borderColor: "#1E293B",

    borderRadius: 20,

    paddingVertical: 45,
    paddingHorizontal: 25,

    alignItems: "center",
  },


  emptyEmoji: {
    fontSize: 42,
    marginBottom: 14,
  },


  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },


  emptyText: {
    color: "#64748B",
    fontSize: 14,

    textAlign: "center",

    lineHeight: 21,

    marginTop: 8,
  },
});