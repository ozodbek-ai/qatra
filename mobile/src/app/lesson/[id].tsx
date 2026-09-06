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

import {
  useEffect,
  useState,
} from "react";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  VideoView,
  useVideoPlayer,
} from "expo-video";

import {
  getLessonById,
  type Lesson,
} from "@/services/lesson.service";

import {
  completeLesson,
} from "@/services/progress.service";


function formatDuration(
  seconds?: number | null
) {
  if (!seconds) {
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
      allowsFullscreen
      allowsPictureInPicture
    />
  );
}


export default function LessonPlayerScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

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


  const loadLesson = async () => {
    if (!id) {
      setError("Dars ID topilmadi.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response =
        await getLessonById(id);

      setLesson(response.data);

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Darsni yuklashda xatolik yuz berdi.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };


  const handleCompleteLesson = async () => {
    if (!id || completing || completed) {
      return;
    }

    try {
      setCompleting(true);

      await completeLesson(id);

      setCompleted(true);

      Alert.alert(
        "Tabriklaymiz! 🎉",
        "Dars muvaffaqiyatli yakunlandi."
      );

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Darsni yakunlashda xatolik yuz berdi.";

      Alert.alert(
        "Xatolik",
        message
      );

    } finally {
      setCompleting(false);
    }
  };


  useEffect(() => {
    loadLesson();
  }, [id]);


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
            <Text style={styles.backButtonSecondaryText}>
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
        contentContainerStyle={styles.scrollContent}
      >

        {/* HEADER */}

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
            <Text style={styles.lessonNumberText}>
              DARS {lesson.order || 1}
            </Text>
          </View>
        </View>


        {/* VIDEO PLAYER */}

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


        {/* CONTENT */}

        <View style={styles.content}>

          {lesson.course && (
            <Text style={styles.courseName}>
              {lesson.course.title}
            </Text>
          )}


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


            {duration && (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>
                  ◷
                </Text>

                <Text style={styles.metaText}>
                  {duration}
                </Text>
              </View>
            )}

          </View>


          {lesson.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>
                Dars haqida
              </Text>

              <Text style={styles.description}>
                {lesson.description}
              </Text>
            </View>
          )}


          <TouchableOpacity
            style={[
              styles.completeButton,
              completed &&
                styles.completedButton,
            ]}
            onPress={handleCompleteLesson}
            disabled={
              completing || completed
            }
            activeOpacity={0.8}
          >
            {completing ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.completeButtonText}>
                {completed
                  ? "✓ Dars yakunlandi"
                  : "✓ Darsni tugatdim"}
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
    color: "#93C5FD",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  videoContainer: {
    marginHorizontal: 20,
    height: 230,

    borderRadius: 24,
    overflow: "hidden",

    backgroundColor: "#000000",

    borderWidth: 1,
    borderColor: "#1E293B",
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
  },

  noVideoText: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 14,
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
    gap: 20,
    marginTop: 18,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
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