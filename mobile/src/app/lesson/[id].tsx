import { useCallback, useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { VideoView, useVideoPlayer } from "expo-video";

import {
  getLessonById,
  getLessonsByCourse,
  type Lesson,
} from "@/services/lesson.service";

import { completeLesson } from "@/services/progress.service";

import {
  getQuizById,
  type Quiz,
} from "@/services/quiz.service";

import {
  addLessonViewDuration,
  markLessonAsViewed,
} from "@/services/player.service";


function formatDuration(
  seconds?: number | null
): string | null {
  if (
    seconds === null ||
    seconds === undefined ||
    seconds <= 0
  ) {
    return null;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}


type LessonVideoProps = {
  videoUrl: string;
};


function LessonVideo({
  videoUrl,
}: LessonVideoProps) {
  const player = useVideoPlayer(
    videoUrl,
    (player) => {
      player.loop = false;
    }
  );

  return (
    <VideoView
      player={player}
      style={styles.video}
      nativeControls
      allowsPictureInPicture
    />
  );
}


export default function LessonPlayerScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    id?: string | string[];
    courseSlug?: string | string[];
  }>();

  const lessonId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const courseSlug = Array.isArray(params.courseSlug)
    ? params.courseSlug[0]
    : params.courseSlug;


  const [lesson, setLesson] =
    useState<Lesson | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [completing, setCompleting] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const [quiz, setQuiz] =
    useState<Quiz | null>(null);

  const [quizLoading, setQuizLoading] =
    useState(false);


  /*
   * VIEW TRACKING REFS
   */

  const activityIdRef =
    useRef<string | null>(null);

  const lessonStartedAtRef =
    useRef<number | null>(null);

  const hasTrackedViewRef =
    useRef(false);


  const loadLesson = useCallback(
    async () => {
      if (!lessonId) {
        setError("Dars ID topilmadi.");
        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError(null);

        setQuiz(null);
        setCompleted(false);


        /*
         * LESSONNI YUKLASH
         */

        const lessonResponse =
          await getLessonById(lessonId);

        const currentLesson =
          lessonResponse.data;

        setLesson(currentLesson);


        /*
         * LESSON VIEW TRACKING
         */

        if (!hasTrackedViewRef.current) {
          hasTrackedViewRef.current = true;

          try {
            const viewResponse =
              await markLessonAsViewed(lessonId);

            const newActivityId =
              viewResponse.data.activityId;

            activityIdRef.current =
              newActivityId;

            lessonStartedAtRef.current =
              Date.now();

          } catch (trackingError) {
            console.log(
              "Lesson view tracking xatosi:",
              trackingError
            );

            hasTrackedViewRef.current = false;
          }
        }


        /*
         * QUIZNI ANIQLASH
         */

        if (currentLesson.courseId) {
          const lessonsResponse =
            await getLessonsByCourse(
              currentLesson.courseId
            );

          const lessonWithQuiz =
            lessonsResponse.data.find(
              (item) => item.id === lessonId
            );

          if (lessonWithQuiz?.quiz?.id) {
            setQuizLoading(true);

            try {
              const quizResponse =
                await getQuizById(
                  lessonWithQuiz.quiz.id
                );

              setQuiz(quizResponse.data);

              if (
                quizResponse.data.attempt?.passed
              ) {
                setCompleted(true);
              }
            } catch (quizError) {
              console.log(
                "Quiz yuklashda xatolik:",
                quizError
              );

              setQuiz(null);
            } finally {
              setQuizLoading(false);
            }
          }
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Darsni yuklashda xatolik yuz berdi.";

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [lessonId]
  );


  /*
   * LESSONNI YAKUNLASH
   */

  const handleCompleteLesson =
    async () => {
      if (
        !lessonId ||
        completing ||
        completed
      ) {
        return;
      }


      /*
       * QUIZ BO'LSA
       */

      if (
        quiz &&
        !quiz.attempt?.passed
      ) {
        router.push({
          pathname: "/quiz/[id]",
          params: {
            id: quiz.id,

            ...(courseSlug
              ? { courseSlug }
              : {}),
          },
        });

        return;
      }


      try {
        setCompleting(true);

        await completeLesson(lessonId);

        setCompleted(true);

        Alert.alert(
          "Tabriklaymiz! 🎉",
          "Dars muvaffaqiyatli yakunlandi.",
          [
            {
              text: "Kursga qaytish",

              onPress: () => {
                if (courseSlug) {
                  router.replace({
                    pathname:
                      "/course/[slug]",

                    params: {
                      slug: courseSlug,
                    },
                  });

                  return;
                }

                router.back();
              },
            },
          ]
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Darsni yakunlashda xatolik yuz berdi.";

        Alert.alert(
          "Xatolik",
          message
        );
      } finally {
        setCompleting(false);
      }
    };


  /*
   * LESSON YUKLANISHI
   */

  useEffect(() => {
    hasTrackedViewRef.current = false;
    activityIdRef.current = null;
    lessonStartedAtRef.current = null;

    loadLesson();
  }, [loadLesson]);


  /*
   * LESSON VIEW DURATION TRACKING
   *
   * Component unmount bo'lganda
   * backendga ko'rilgan vaqt yuboriladi.
   */

  useEffect(() => {
    return () => {
      const sendDuration = async () => {
        const currentActivityId =
          activityIdRef.current;

        const startedAt =
          lessonStartedAtRef.current;

        if (
          !currentActivityId ||
          !startedAt
        ) {
          return;
        }

        const durationSeconds =
          Math.floor(
            (Date.now() - startedAt) / 1000
          );

        if (durationSeconds <= 0) {
          return;
        }

        try {
          await addLessonViewDuration(
            currentActivityId,
            durationSeconds
          );

          console.log(
            "Lesson duration saqlandi:",
            durationSeconds,
            "sekund"
          );
        } catch (durationError) {
          console.log(
            "Lesson duration tracking xatosi:",
            durationError
          );
        }
      };

      void sendDuration();
    };
  }, []);


  /*
   * LOADING
   */

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />

          <Text style={styles.loadingText}>
            Dars yuklanmoqda...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  /*
   * ERROR
   */

  if (error || !lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            Xatolik yuz berdi
          </Text>

          <Text style={styles.errorText}>
            {error || "Dars topilmadi."}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadLesson}
          >
            <Text style={styles.retryButtonText}>
              Qayta urinish
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButtonSecondary}
            onPress={() => router.back()}
          >
            <Text
              style={
                styles.backButtonSecondaryText
              }
            >
              Orqaga qaytish
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }


  const duration =
    formatDuration(lesson.duration);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>
              ←
            </Text>
          </TouchableOpacity>

          <View style={styles.lessonNumber}>
            <Text
              style={styles.lessonNumberText}
            >
              DARS {lesson.order || 1}
            </Text>
          </View>
        </View>


        <View style={styles.videoContainer}>
          {lesson.videoUrl ? (
            <LessonVideo
              videoUrl={lesson.videoUrl}
            />
          ) : (
            <View style={styles.noVideoContainer}>
              <Text style={styles.noVideoIcon}>
                🎓
              </Text>

              <Text style={styles.noVideoText}>
                Bu dars uchun video mavjud emas
              </Text>
            </View>
          )}
        </View>


        <View style={styles.content}>
          {lesson.course ? (
            <Text style={styles.courseName}>
              {lesson.course.title}
            </Text>
          ) : null}


          <Text style={styles.title}>
            {lesson.title}
          </Text>


          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>
                ▶
              </Text>

              <Text style={styles.metaText}>
                Video dars
              </Text>
            </View>


            {duration ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>
                  ◷
                </Text>

                <Text style={styles.metaText}>
                  {duration}
                </Text>
              </View>
            ) : null}
          </View>


          {lesson.description ? (
            <View
              style={styles.descriptionSection}
            >
              <Text style={styles.sectionTitle}>
                Dars haqida
              </Text>

              <Text style={styles.description}>
                {lesson.description}
              </Text>
            </View>
          ) : null}


          {quizLoading ? (
            <View
              style={styles.quizLoadingContainer}
            >
              <ActivityIndicator
                size="small"
                color="#2563EB"
              />

              <Text
                style={styles.quizLoadingText}
              >
                Quiz yuklanmoqda...
              </Text>
            </View>
          ) : null}


          <TouchableOpacity
            style={[
              styles.completeButton,

              (
                completed ||
                quiz?.attempt?.passed
              ) &&
                styles.completedButton,
            ]}
            onPress={handleCompleteLesson}
            disabled={
              completing ||
              completed ||
              quizLoading ||
              quiz?.attempt?.passed === true
            }
            activeOpacity={0.8}
          >
            {completing ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : completed ||
              quiz?.attempt?.passed ? (
              <Text
                style={styles.completeButtonText}
              >
                ✓ Dars yakunlandi
              </Text>
            ) : quiz ? (
              <Text
                style={styles.completeButtonText}
              >
                📝 Quizni topshirish
              </Text>
            ) : (
              <Text
                style={styles.completeButtonText}
              >
                ✓ Darsni tugatdim
              </Text>
            )}
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
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
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
    marginTop: 25,
    backgroundColor: "#2563EB",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  backButtonSecondary: {
    marginTop: 18,
  },

  backButtonSecondaryText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "700",
  },

  topBar: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    color: "#FFFFFF",
    fontSize: 26,
  },

  lessonNumber: {
    backgroundColor: "#172554",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  lessonNumberText: {
    color: "#60A5FA",
    fontSize: 12,
    fontWeight: "800",
  },

  videoContainer: {
    marginHorizontal: 20,
    height: 230,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#000000",
  },

  video: {
    width: "100%",
    height: "100%",
  },

  noVideoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },

  noVideoIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  noVideoText: {
    color: "#94A3B8",
    fontSize: 14,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  courseName: {
    color: "#3B82F6",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 9,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 36,
  },

  metaContainer: {
    flexDirection: "row",
    marginTop: 18,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },

  metaIcon: {
    color: "#64748B",
    fontSize: 15,
    marginRight: 7,
  },

  metaText: {
    color: "#94A3B8",
    fontSize: 14,
  },

  descriptionSection: {
    marginTop: 32,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },

  description: {
    color: "#94A3B8",
    fontSize: 15,
    lineHeight: 24,
  },

  quizLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },

  quizLoadingText: {
    color: "#94A3B8",
    fontSize: 14,
    marginLeft: 10,
  },

  completeButton: {
    marginTop: 32,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  completedButton: {
    backgroundColor: "#16A34A",
  },

  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});