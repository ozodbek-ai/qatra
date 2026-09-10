import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  createReview,
  deleteReview,
  getCourseReviews,
  updateReview,
  type Review,
} from "@/services/review.service";


export default function CourseReviewsScreen() {
  const router = useRouter();

  const {
    courseId,
    courseTitle,
    completed,
  } = useLocalSearchParams<{
    courseId: string;
    courseTitle?: string;
    completed?: string;
  }>();


  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  const [modalVisible, setModalVisible] =
    useState(false);

  const [rating, setRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

const [myReview, setMyReview] =
  useState<Review | null>(null);

const [editing, setEditing] =
  useState(false);


  const isCompleted =
    completed === "true";


  const loadReviews =
    useCallback(
      async (isRefresh = false) => {
        if (!courseId) {
          setError("Course ID topilmadi.");
          setLoading(false);
          return;
        }

        try {
          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);

          const response =
            await getCourseReviews(courseId);

          setReviews(response.data);

        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Reviewlarni yuklashda xatolik yuz berdi."
          );

        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [courseId]
    );


  useEffect(() => {
    loadReviews();
  }, [loadReviews]);


  const getAverageRating = () => {
    if (reviews.length === 0) {
      return "0.0";
    }

    const total =
      reviews.reduce(
        (sum, review) =>
          sum + review.rating,
        0
      );

    return (
      total / reviews.length
    ).toFixed(1);
  };


const handleSubmit = async () => {
  if (rating < 1) {
    Alert.alert(
      "Baho tanlanmagan",
      "Iltimos, 1 dan 5 gacha baho bering."
    );

    return;
  }

  try {
    setSubmitting(true);

    let response;

    if (editing && myReview) {
      response = await updateReview(
        courseId,
        {
          rating,
          comment:
            comment.trim() || undefined,
        }
      );
    } else {
      response = await createReview({
        courseId,
        rating,
        comment:
          comment.trim() || undefined,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | BACKEND CREATE / UPDATE RESPONSE
    |--------------------------------------------------------------------------
    */

    setMyReview(response.data);

    setModalVisible(false);

    setEditing(false);

    setRating(0);

    setComment("");

    await loadReviews();

    Alert.alert(
      "Muvaffaqiyatli",
      editing
        ? "Reviewingiz yangilandi."
        : "Reviewingiz muvaffaqiyatli qo'shildi."
    );

  } catch (error) {
    Alert.alert(
      "Xatolik",
      error instanceof Error
        ? error.message
        : "Review yuborishda xatolik yuz berdi."
    );

  } finally {
    setSubmitting(false);
  }
};

const handleEditReview = () => {
  if (!myReview) {
    return;
  }

  setEditing(true);

  setRating(myReview.rating);

  setComment(
    myReview.comment || ""
  );

  setModalVisible(true);
};

const handleDeleteReview = () => {
  if (!myReview) {
    return;
  }

  Alert.alert(
    "Reviewni o'chirish",
    "Reviewingizni o'chirishni xohlaysizmi?",
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
            setSubmitting(true);

            await deleteReview(courseId);

            setMyReview(null);

            await loadReviews();

            Alert.alert(
              "Muvaffaqiyatli",
              "Reviewingiz o'chirildi."
            );

          } catch (error) {
            Alert.alert(
              "Xatolik",
              error instanceof Error
                ? error.message
                : "Reviewni o'chirishda xatolik yuz berdi."
            );

          } finally {
            setSubmitting(false);
          }
        },
      },
    ]
  );
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
            Reviewlar yuklanmoqda...
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

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadReviews()}
          >
            <Text style={styles.retryText}>
              Qayta urinish
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>
            ←
          </Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>
            Kurs baholari
          </Text>

          {courseTitle ? (
            <Text
              style={styles.subtitle}
              numberOfLines={1}
            >
              {courseTitle}
            </Text>
          ) : null}
        </View>
      </View>


      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadReviews(true)
            }
          />
        }
      >

        <View style={styles.summaryCard}>

          <Text style={styles.averageRating}>
            ★ {getAverageRating()}
          </Text>

          <Text style={styles.reviewCount}>
            {reviews.length} ta baho
          </Text>

        </View>


        {isCompleted ? (

  myReview ? (

    <View style={styles.myReviewActions}>

      <View style={styles.myReviewInfo}>
        <Text style={styles.myReviewTitle}>
          Siz kursga baho bergansiz
        </Text>

        <Text style={styles.myReviewRating}>
          ★ {myReview.rating} / 5
        </Text>
      </View>


      <View style={styles.reviewButtons}>

        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditReview}
        >
          <Text style={styles.editButtonText}>
            Tahrirlash
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteReview}
        >
          <Text style={styles.deleteButtonText}>
            O'chirish
          </Text>
        </TouchableOpacity>

      </View>

    </View>

  ) : (

    <TouchableOpacity
      style={styles.addReviewButton}
      onPress={() => {
        setEditing(false);
        setRating(0);
        setComment("");
        setModalVisible(true);
      }}
    >
      <Text style={styles.addReviewText}>
        ★ Kursga baho berish
      </Text>
    </TouchableOpacity>

  )

) : (

  <View style={styles.infoCard}>
    <Text style={styles.infoText}>
      Kursni to'liq tugatganingizdan keyin
      unga baho bera olasiz.
    </Text>
  </View>

)}


        <View style={styles.reviewsContainer}>

          {reviews.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Hali reviewlar mavjud emas.
              </Text>
            </View>
          ) : (
            reviews.map((review) => {

              const reviewDate =
                new Date(
                  review.createdAt
                ).toLocaleDateString("uz-UZ");


              return (
                <View
                  key={review.id}
                  style={styles.reviewCard}
                >

                  <View style={styles.reviewHeader}>

                    <View
                      style={styles.avatar}
                    >
                      <Text
                        style={styles.avatarText}
                      >
                        {review.user.fullName
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </Text>
                    </View>


                    <View
                      style={styles.userInfo}
                    >
                      <Text
                        style={styles.userName}
                      >
                        {review.user.fullName}
                      </Text>

                      <Text
                        style={styles.date}
                      >
                        {reviewDate}
                      </Text>
                    </View>


                    <Text
                      style={styles.rating}
                    >
                      ★ {review.rating}
                    </Text>

                  </View>


                  {review.comment ? (
                    <Text
                      style={styles.comment}
                    >
                      {review.comment}
                    </Text>
                  ) : null}

                </View>
              );
            })
          )}

        </View>

      </ScrollView>


      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModalVisible(false)
        }
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>
  {editing
    ? "Reviewni tahrirlash"
    : "Kursga baho bering"}
</Text>


            <Text style={styles.modalSubtitle}>
              Sizning fikringiz boshqa
              o'quvchilarga yordam beradi.
            </Text>


            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() =>
                      setRating(star)
                    }
                  >
                    <Text
                      style={[
                        styles.star,

                        star <= rating &&
                          styles.starSelected,
                      ]}
                    >
                      ★
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>


            <TextInput
              style={styles.commentInput}
              placeholder="Fikringizni yozing (ixtiyoriy)"
              placeholderTextColor="#64748B"
              multiline
              maxLength={1000}
              value={comment}
              onChangeText={setComment}
            />


            <TouchableOpacity
              disabled={submitting}
              style={[
                styles.submitButton,

                submitting &&
                  styles.disabledButton,
              ]}
              onPress={handleSubmit}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>
  {editing
    ? "Yangilash"
    : "Review yuborish"}
</Text>
              )}
            </TouchableOpacity>


            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                setModalVisible(false)
              }
            >
              <Text style={styles.cancelText}>
                Bekor qilish
              </Text>
            </TouchableOpacity>

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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    color: "#94A3B8",
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
    textAlign: "center",
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#2563EB",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
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
    fontSize: 22,
    fontWeight: "800",
  },

  subtitle: {
    color: "#64748B",
    marginTop: 3,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  summaryCard: {
    backgroundColor: "#172554",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },

  averageRating: {
    color: "#FACC15",
    fontSize: 28,
    fontWeight: "800",
  },

  reviewCount: {
    color: "#93C5FD",
    marginTop: 5,
  },

  addReviewButton: {
    marginTop: 16,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },

  addReviewText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  infoCard: {
    marginTop: 16,
    backgroundColor: "#0F172A",
    padding: 16,
    borderRadius: 14,
  },

  infoText: {
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 21,
  },

  reviewsContainer: {
    marginTop: 20,
    gap: 12,
  },

  emptyContainer: {
    paddingVertical: 35,
    alignItems: "center",
  },

  emptyText: {
    color: "#64748B",
  },

  reviewCard: {
    backgroundColor: "#0F172A",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  userInfo: {
    flex: 1,
    marginLeft: 12,
  },

  userName: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  date: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 3,
  },

  rating: {
    color: "#FACC15",
    fontWeight: "700",
  },

  comment: {
    color: "#CBD5E1",
    lineHeight: 21,
    marginTop: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#0F172A",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 24,
    paddingBottom: 40,
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },

  modalSubtitle: {
    color: "#94A3B8",
    lineHeight: 20,
    marginTop: 8,
  },

  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 24,
  },

  star: {
    color: "#475569",
    fontSize: 42,
    marginHorizontal: 4,
  },

  starSelected: {
    color: "#FACC15",
  },

  commentInput: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 14,
    padding: 14,
    color: "#FFFFFF",
    textAlignVertical: "top",
  },

  submitButton: {
    marginTop: 16,
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  cancelButton: {
    paddingVertical: 16,
    alignItems: "center",
  },

  cancelText: {
    color: "#94A3B8",
    fontWeight: "600",
  },
  myReviewActions: {
  marginTop: 16,
  backgroundColor: "#0F172A",
  borderRadius: 16,
  padding: 16,
  borderWidth: 1,
  borderColor: "#1E293B",
},

myReviewInfo: {
  alignItems: "center",
},

myReviewTitle: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "700",
},

myReviewRating: {
  color: "#FACC15",
  fontSize: 16,
  fontWeight: "700",
  marginTop: 6,
},

reviewButtons: {
  flexDirection: "row",
  gap: 10,
  marginTop: 16,
},

editButton: {
  flex: 1,
  backgroundColor: "#2563EB",
  paddingVertical: 13,
  borderRadius: 12,
  alignItems: "center",
},

editButtonText: {
  color: "#FFFFFF",
  fontWeight: "700",
},

deleteButton: {
  flex: 1,
  backgroundColor: "#3F1111",
  borderWidth: 1,
  borderColor: "#7F1D1D",
  paddingVertical: 13,
  borderRadius: 12,
  alignItems: "center",
},

deleteButtonText: {
  color: "#FCA5A5",
  fontWeight: "700",
},

});