import { useAuth } from "@/context/AuthContext";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Course,
  CourseLesson,
  getCourseBySlug,
} from "@/services/course.service";

import {
  continueLearning,
  getCourseProgress,
  type ContinueLearningResponse,
  type CourseProgress,
  type NextLesson,
} from "@/services/progress.service";

import {
  enrollToCourse,
  getMyCourses,
} from "@/services/enrollment.service";

import {
  createReview,
  deleteReview,
  getCourseReviews,
  type Review,
  updateReview,
} from "@/services/review.service";


type CourseData = Course & {
  lessons?: CourseLesson[];
};


type ContinueLesson = NextLesson;



export default function CourseDetailScreen() {
  const { slug } =
    useLocalSearchParams<{
      slug: string;
    }>();

  const { user } = useAuth();

  const router = useRouter();

  const [course, setCourse] =
    useState<CourseData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [progress, setProgress] =
    useState<CourseProgress | null>(null);

  const [continueLesson, setContinueLesson] =
    useState<ContinueLesson | null>(null);

  const [progressLoading, setProgressLoading] =
    useState(false);

  const [enrolled, setEnrolled] =
  useState(false);

const [enrollmentLoading, setEnrollmentLoading] =
  useState(false);

  const [reviews, setReviews] =
  useState<Review[]>([]);

const [reviewsLoading, setReviewsLoading] =
  useState(false);

const [reviewModalVisible, setReviewModalVisible] =
  useState(false);

const [rating, setRating] =
  useState(5);

const [comment, setComment] =
  useState("");

const [submittingReview, setSubmittingReview] =
  useState(false);

const [myReview, setMyReview] =
  useState<Review | null>(null);

const [editingReview, setEditingReview] =
  useState<Review | null>(null);

const [deletingReview, setDeletingReview] =
  useState(false);


  const loadCourse = useCallback(async () => {
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
  }, [slug]);


const loadProgress = useCallback(
  async (courseId: string) => {
    try {
      setProgressLoading(true);

      const [
        progressResponse,
        continueResponse,
      ] = await Promise.all([
        getCourseProgress(courseId),
        continueLearning(courseId),
      ]);

      setProgress(
        progressResponse.data
      );

      const continueData:
        ContinueLearningResponse =
          continueResponse.data;

      setContinueLesson(
        continueData.nextLesson
      );

    } catch (error) {
      console.log(
        "Progress yuklashda xatolik:",
        error
      );

      setProgress(null);
      setContinueLesson(null);

    } finally {
      setProgressLoading(false);
    }
  },
  []
);

const loadEnrollment = useCallback(
  async (courseId: string) => {
    try {
      const response =
        await getMyCourses();

      const isEnrolled =
        response.data.some(
          (item) =>
            item.course.id === courseId
        );

      setEnrolled(isEnrolled);

    } catch (error) {
      console.log(
        "Enrollment tekshirishda xatolik:",
        error
      );

      setEnrolled(false);
    }
  },
  []
);

const loadReviews = useCallback(
  async (courseId: string) => {
    try {
      setReviewsLoading(true);

      const response =
        await getCourseReviews(courseId);

      const reviewList = Array.isArray(response.data)
        ? response.data
        : [];

      setReviews(reviewList);

      if (user?.id) {
        const currentUserReview =
          reviewList.find(
            (review) =>
              review.user?.id === user.id
          ) || null;

        setMyReview(currentUserReview);
      } else {
        setMyReview(null);
      }

    } catch (error) {
      console.log(
        "Review yuklashda xatolik:",
        error
      );

      setReviews([]);
      setMyReview(null);
    } finally {
      setReviewsLoading(false);
    }
  },
  [user?.id]
);


  useEffect(() => {
    loadCourse();
  }, [loadCourse]);


useEffect(() => {
  if (!course?.id) {
    return;
  }

  loadEnrollment(course.id);
}, [
  course?.id,
  loadEnrollment,
]);

useEffect(() => {
  if (!course?.id) {
    return;
  }

  loadReviews(course.id);
}, [
  course?.id,
  loadReviews,
]);

useEffect(() => {
  if (!course?.id || !enrolled) {
    setProgress(null);
    setContinueLesson(null);
    return;
  }

  loadProgress(course.id);
}, [
  course?.id,
  enrolled,
  loadProgress,
]);


  const openLesson = (
    lessonId: string
  ) => {
    router.push({
      pathname: "/lesson/[id]",
      params: {
        id: lessonId,
        courseSlug: slug,
      },
    });
  };


  const handleEnrollment = async () => {
  if (!course || enrollmentLoading) {
    return;
  }

  try {
    setEnrollmentLoading(true);

    await enrollToCourse(course.id);

    setEnrolled(true);

    await loadProgress(course.id);

  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Kursga yozilishda xatolik yuz berdi.";

    setError(message);

  } finally {
    setEnrollmentLoading(false);
  }
};

const handleContinue = () => {
  if (!enrolled) {
    return;
  }

  if (continueLesson?.id) {
    openLesson(continueLesson.id);
    return;
  }

  if (course?.lessons?.length) {
    openLesson(course.lessons[0].id);
  }
};

const handleEditReview = (
  review: Review
) => {
  setEditingReview(review);

  setRating(review.rating);

  setComment(review.comment || "");

  setReviewModalVisible(true);
};

const handleDeleteReview = () => {
  if (!course || !myReview) {
    return;
  }

  Alert.alert(
    "Sharhni o'chirish",
    "Sharhingizni o'chirishni xohlaysizmi?",
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
            setDeletingReview(true);

            await deleteReview(course.id);

            setMyReview(null);

            await loadReviews(course.id);

            Alert.alert(
              "Muvaffaqiyatli",
              "Sharhingiz o'chirildi."
            );

          } catch (error) {
            Alert.alert(
              "Xatolik",
              error instanceof Error
                ? error.message
                : "Sharhni o'chirishda xatolik yuz berdi."
            );
          } finally {
            setDeletingReview(false);
          }
        },
      },
    ]
  );
};

const handleSubmitReview = async () => {
  if (!course) {
    return;
  }

  try {
    setSubmittingReview(true);

    if (editingReview) {
      await updateReview(
        course.id,
        {
          rating,
          comment: comment.trim() || "",
        }
      );
    } else {
      await createReview({
        courseId: course.id,
        rating,
        comment: comment.trim() || undefined,
      });
    }

    setReviewModalVisible(false);

    setRating(5);
    setComment("");

    setEditingReview(null);

    await loadReviews(course.id);

    Alert.alert(
      "Muvaffaqiyatli",
      editingReview
        ? "Sharhingiz yangilandi."
        : "Sharhingiz yuborildi."
    );

  } catch (error) {
    Alert.alert(
      "Xatolik",
      error instanceof Error
        ? error.message
        : "Sharh yuborishda xatolik yuz berdi."
    );
  } finally {
    setSubmittingReview(false);
  }
};


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

  const progressPercent =
    progress?.progress || 0;

  const completedLessons =
    progress?.completedLessons || 0;

  const totalLessons =
    progress?.totalLessons || lessons.length;

  const isCompleted =
    totalLessons > 0 &&
    completedLessons >= totalLessons;


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


        {/* COURSE PROGRESS */}

{enrolled && lessons.length > 0 && (
  <View style={styles.progressCard}>
    <View style={styles.progressHeader}>
      <View>
        <Text style={styles.progressTitle}>
          {isCompleted
            ? "Kurs yakunlandi 🎉"
            : "Sizning progressingiz"}
        </Text>

        <Text style={styles.progressSubtitle}>
          {completedLessons} / {totalLessons} dars tugallandi
        </Text>
      </View>

      <Text style={styles.progressPercent}>
        {progressLoading
          ? "..."
          : `${progressPercent}%`}
      </Text>
    </View>

    <View style={styles.progressBar}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(
              Math.max(progressPercent, 0),
              100
            )}%`,
          },
        ]}
      />
    </View>

    {!isCompleted && (
      <TouchableOpacity
        style={styles.continueButton}
        activeOpacity={0.8}
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>
          {completedLessons === 0
            ? "Kursni boshlash →"
            : "Davom ettirish →"}
        </Text>
      </TouchableOpacity>
    )}
  </View>
)}


{/* ENROLLMENT */}

{!enrolled && lessons.length > 0 && (
  <View style={styles.enrollmentCard}>
    <Text style={styles.enrollmentTitle}>
      Bu kursni boshlash uchun avval kursga yoziling
    </Text>

    <TouchableOpacity
      style={[
        styles.enrollmentButton,
        enrollmentLoading && styles.disabledButton,
      ]}
      activeOpacity={0.8}
      onPress={handleEnrollment}
      disabled={enrollmentLoading}
    >
      {enrollmentLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.enrollmentButtonText}>
          Kursga yozilish
        </Text>
      )}
    </TouchableOpacity>
  </View>
)}

        


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
              {isCompleted
                ? "✓"
                : course.isPublished
                ? "✓"
                : "—"}
            </Text>

            <Text style={styles.infoLabel}>
              {isCompleted
                ? "Yakunlandi"
                : "Holati"}
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
  if (enrolled) {
    openLesson(lesson.id);
  }
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

        {/* REVIEWS */}

<View style={styles.reviewsHeader}>
  <View>
    <Text style={styles.reviewsTitle}>
      Sharhlar
    </Text>

    <Text style={styles.reviewsCount}>
      {reviews.length} ta sharh
    </Text>
  </View>

  {myReview ? (
  <View style={styles.myReviewActions}>
    <TouchableOpacity
      style={styles.editReviewButton}
      onPress={() =>
        handleEditReview(myReview)
      }
    >
      <Text style={styles.editReviewButtonText}>
        Tahrirlash
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.deleteReviewButton,
        deletingReview &&
          styles.disabledButton,
      ]}
      disabled={deletingReview}
      onPress={handleDeleteReview}
    >
      {deletingReview ? (
        <ActivityIndicator
          size="small"
          color="#FFFFFF"
        />
      ) : (
        <Text style={styles.deleteReviewButtonText}>
          O'chirish
        </Text>
      )}
    </TouchableOpacity>
  </View>
) : (
  <TouchableOpacity
    style={styles.addReviewButton}
    onPress={() => {
      setEditingReview(null);
      setRating(5);
      setComment("");
      setReviewModalVisible(true);
    }}
  >
    <Text style={styles.addReviewButtonText}>
      + Sharh
    </Text>
  </TouchableOpacity>
)}
</View>


{reviewsLoading ? (
  <ActivityIndicator
    size="small"
    color="#2563EB"
    style={{ marginVertical: 20 }}
  />
) : reviews.length === 0 ? (
  <View style={styles.emptyReviews}>
    <Text style={styles.emptyReviewsText}>
      Hozircha bu kurs uchun sharhlar yo'q.
    </Text>
  </View>
) : (
  <View style={styles.reviewsList}>
    {reviews.map((review) => (
      <View
        key={review.id}
        style={styles.reviewCard}
      >
        <View style={styles.reviewTop}>
          <View style={styles.reviewAvatar}>
            <Text style={styles.reviewAvatarText}>
              {review.user?.fullName
                ?.charAt(0)
                .toUpperCase() || "U"}
            </Text>
          </View>

          <View style={styles.reviewUserInfo}>
            <Text style={styles.reviewUserName}>
              {review.user?.fullName ||
                "Foydalanuvchi"}
            </Text>

            <Text style={styles.reviewStars}>
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </Text>
          </View>
        </View>

        {review.comment ? (
          <Text style={styles.reviewComment}>
            {review.comment}
          </Text>
        ) : null}
      </View>
    ))}
  </View>
)}

      </ScrollView>

      <Modal
  visible={reviewModalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => {
  setReviewModalVisible(false);
  setEditingReview(null);
}}
>
  <View style={styles.modalOverlay}>
    <View style={styles.reviewModal}>
      <Text style={styles.modalTitle}>
  {editingReview
    ? "Sharhni tahrirlash"
    : "Kursga baho bering"}
</Text>

      <Text style={styles.modalSubtitle}>
        Sizning fikringiz boshqa foydalanuvchilarga yordam beradi.
      </Text>


      <Text style={styles.ratingLabel}>
        Baho
      </Text>

      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map(
          (item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setRating(item)}
            >
              <Text
                style={[
                  styles.starButton,
                  item <= rating &&
                    styles.starButtonActive,
                ]}
              >
                ★
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>


      <Text style={styles.ratingLabel}>
        Sharh
      </Text>

      <TextInput
        style={styles.commentInput}
        value={comment}
        onChangeText={setComment}
        placeholder="Fikringizni yozing..."
        placeholderTextColor="#64748B"
        multiline
        textAlignVertical="top"
      />


      <View style={styles.modalActions}>
        <TouchableOpacity
          style={styles.cancelReviewButton}
          onPress={() => {
  setReviewModalVisible(false);
  setEditingReview(null);
}}
        >
          <Text
            style={styles.cancelReviewButtonText}
          >
            Bekor qilish
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={[
            styles.submitReviewButton,
            submittingReview &&
              styles.disabledButton,
          ]}
          disabled={submittingReview}
          onPress={handleSubmitReview}
        >
          {submittingReview ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text
              style={
                styles.submitReviewButtonText
              }
            >
              Yuborish
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
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

  progressCard: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  progressTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  progressSubtitle: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 5,
  },

  progressPercent: {
    color: "#60A5FA",
    fontSize: 20,
    fontWeight: "800",
  },

  progressBar: {
    height: 8,
    backgroundColor: "#1E293B",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 18,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 8,
  },

  continueButton: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
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
  enrollmentCard: {
  backgroundColor: "#0F172A",
  borderWidth: 1,
  borderColor: "#1E293B",
  borderRadius: 20,
  padding: 20,
  marginBottom: 20,
},

enrollmentTitle: {
  color: "#E2E8F0",
  fontSize: 15,
  lineHeight: 22,
  textAlign: "center",
  marginBottom: 16,
},

enrollmentButton: {
  backgroundColor: "#2563EB",
  minHeight: 52,
  borderRadius: 14,
  justifyContent: "center",
  alignItems: "center",
},

enrollmentButtonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "700",
},

disabledButton: {
  opacity: 0.6,
},

reviewsHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 35,
  marginBottom: 18,
},

reviewsTitle: {
  color: "#FFFFFF",
  fontSize: 22,
  fontWeight: "800",
},

reviewsCount: {
  color: "#64748B",
  fontSize: 13,
  marginTop: 4,
},

addReviewButton: {
  backgroundColor: "#2563EB",
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 12,
},

addReviewButtonText: {
  color: "#FFFFFF",
  fontSize: 13,
  fontWeight: "700",
},

reviewsList: {
  gap: 12,
},

reviewCard: {
  backgroundColor: "#0F172A",
  borderWidth: 1,
  borderColor: "#1E293B",
  borderRadius: 18,
  padding: 16,
},

reviewTop: {
  flexDirection: "row",
  alignItems: "center",
},

reviewAvatar: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#172554",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 12,
},

reviewAvatarText: {
  color: "#60A5FA",
  fontSize: 17,
  fontWeight: "800",
},

reviewUserInfo: {
  flex: 1,
},

reviewUserName: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "700",
},

reviewStars: {
  color: "#FBBF24",
  fontSize: 15,
  marginTop: 3,
},

reviewComment: {
  color: "#CBD5E1",
  fontSize: 14,
  lineHeight: 21,
  marginTop: 14,
},

emptyReviews: {
  backgroundColor: "#0F172A",
  borderWidth: 1,
  borderColor: "#1E293B",
  borderRadius: 18,
  padding: 20,
},

emptyReviewsText: {
  color: "#64748B",
  textAlign: "center",
  fontSize: 14,
},

modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.65)",
  justifyContent: "flex-end",
},

reviewModal: {
  backgroundColor: "#0F172A",
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  padding: 22,
  paddingBottom: 35,
  borderWidth: 1,
  borderColor: "#1E293B",
},

modalTitle: {
  color: "#FFFFFF",
  fontSize: 22,
  fontWeight: "800",
},

modalSubtitle: {
  color: "#94A3B8",
  fontSize: 14,
  lineHeight: 20,
  marginTop: 7,
  marginBottom: 22,
},

ratingLabel: {
  color: "#E2E8F0",
  fontSize: 14,
  fontWeight: "700",
  marginBottom: 10,
},

ratingRow: {
  flexDirection: "row",
  marginBottom: 22,
},

starButton: {
  fontSize: 34,
  color: "#334155",
  marginRight: 8,
},

starButtonActive: {
  color: "#FBBF24",
},

commentInput: {
  minHeight: 120,
  borderWidth: 1,
  borderColor: "#334155",
  borderRadius: 14,
  color: "#FFFFFF",
  padding: 14,
  fontSize: 14,
  marginBottom: 20,
},

modalActions: {
  flexDirection: "row",
  gap: 10,
},

cancelReviewButton: {
  flex: 1,
  height: 52,
  borderRadius: 14,
  backgroundColor: "#1E293B",
  justifyContent: "center",
  alignItems: "center",
},

cancelReviewButtonText: {
  color: "#CBD5E1",
  fontWeight: "700",
},

submitReviewButton: {
  flex: 1,
  height: 52,
  borderRadius: 14,
  backgroundColor: "#2563EB",
  justifyContent: "center",
  alignItems: "center",
},

submitReviewButtonText: {
  color: "#FFFFFF",
  fontWeight: "800",
},

myReviewActions: {
  flexDirection: "row",
  gap: 8,
},

editReviewButton: {
  backgroundColor: "#1D4ED8",
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 10,
},

editReviewButtonText: {
  color: "#FFFFFF",
  fontSize: 12,
  fontWeight: "700",
},

deleteReviewButton: {
  backgroundColor: "#DC2626",
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

deleteReviewButtonText: {
  color: "#FFFFFF",
  fontSize: 12,
  fontWeight: "700",
},
});