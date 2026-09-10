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
  useMemo,
  useState,
} from "react";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  getQuizById,
  submitQuiz,
  type Quiz,
  type QuizAnswer,
  type QuizQuestion,
  type QuizSubmitResult,
} from "@/services/quiz.service";

import {
  completeLesson,
} from "@/services/progress.service";


export default function QuizScreen() {
  const router = useRouter();

const { id, courseSlug, lessonId } =
  useLocalSearchParams<{
    id: string;
    courseSlug?: string;
    lessonId?: string;
  }>();


  const [quiz, setQuiz] =
    useState<Quiz | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [submitting, setSubmitting] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | USER ANSWERS
  |--------------------------------------------------------------------------
  |
  | {
  |   questionId: [
  |     optionId
  |   ]
  | }
  |
  */

  const [answers, setAnswers] =
    useState<Record<string, string[]>>(
      {}
    );


  const loadQuiz = async () => {
    if (!id) {
      setError("Quiz ID topilmadi.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response =
        await getQuizById(id);

      setQuiz(response.data);


      /*
      |--------------------------------------------------------------------------
      | AGAR QUIZ OLDIN PASSED BO'LGAN BO'LSA
      |--------------------------------------------------------------------------
      */

      if (response.data.attempt?.passed) {
        Alert.alert(
          "Quiz yakunlangan",
          "Siz bu quizni avval muvaffaqiyatli topshirgansiz."
        );
      }

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Quizni yuklashda xatolik yuz berdi.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadQuiz();
  }, [id]);


  /*
  |--------------------------------------------------------------------------
  | OPTION SELECT
  |--------------------------------------------------------------------------
  */

  const selectOption = (
    question: QuizQuestion,
    optionId: string
  ) => {
    setAnswers((previous) => {
      const currentAnswers =
        previous[question.id] || [];


      /*
      |--------------------------------------------------------------------------
      | MULTIPLE QUESTION
      |--------------------------------------------------------------------------
      */

      if (question.type === "MULTIPLE") {
        const alreadySelected =
          currentAnswers.includes(optionId);

        const updatedAnswers =
          alreadySelected
            ? currentAnswers.filter(
                (item) =>
                  item !== optionId
              )
            : [
                ...currentAnswers,
                optionId,
              ];

        return {
          ...previous,

          [question.id]:
            updatedAnswers,
        };
      }


      /*
      |--------------------------------------------------------------------------
      | SINGLE QUESTION
      |--------------------------------------------------------------------------
      */

      return {
        ...previous,

        [question.id]: [
          optionId,
        ],
      };
    });
  };


  /*
  |--------------------------------------------------------------------------
  | ALL QUESTIONS ANSWERED?
  |--------------------------------------------------------------------------
  */

  const allQuestionsAnswered =
    useMemo(() => {
      if (!quiz) {
        return false;
      }

      return quiz.questions.every(
        (question) => {
          const selected =
            answers[question.id];

          return (
            selected &&
            selected.length > 0
          );
        }
      );
    }, [
      quiz,
      answers,
    ]);


  /*
  |--------------------------------------------------------------------------
  | SUBMIT QUIZ
  |--------------------------------------------------------------------------
  */

  const handleSubmitQuiz =
    async () => {
      if (
        !quiz ||
        submitting
      ) {
        return;
      }


      if (quiz.attempt?.passed) {
        Alert.alert(
          "Quiz yakunlangan",
          "Siz bu quizni allaqachon muvaffaqiyatli topshirgansiz."
        );

        return;
      }


      /*
      |--------------------------------------------------------------------------
      | ALL QUESTIONS REQUIRED
      |--------------------------------------------------------------------------
      */

      if (!allQuestionsAnswered) {
        Alert.alert(
          "Javoblar to'liq emas",
          "Davom etish uchun barcha savollarga javob berishingiz kerak."
        );

        return;
      }


      /*
      |--------------------------------------------------------------------------
      | BACKEND PAYLOAD
      |--------------------------------------------------------------------------
      */

      const formattedAnswers:
        QuizAnswer[] =
          quiz.questions.map(
            (question) => ({
              questionId:
                question.id,

              optionIds:
                answers[
                  question.id
                ],
            })
          );


      try {
        setSubmitting(true);

        const response =
          await submitQuiz(
            quiz.id,
            formattedAnswers
          );

        const result:
          QuizSubmitResult =
            response.data;


        /*
        |--------------------------------------------------------------------------
        | PASSED
        |--------------------------------------------------------------------------
        */

        if (result.passed) {
  try {
    /*
    |--------------------------------------------------------------------------
    | QUIZ MUVAFFAQIYATLI TOPSHIRILDI
    | LESSON PROGRESSNI HAM BACKENDDA YANGILAYMIZ
    |--------------------------------------------------------------------------
    */

    if (lessonId) {
      await completeLesson(lessonId);
    }

    Alert.alert(
      "Tabriklaymiz! 🎉",
      `Siz quizni muvaffaqiyatli topshirdingiz.\n\nNatija: ${result.score}/${result.total}\n${result.percentage}%`,
      [
        {
          text: "Dars yakunlandi",

          onPress: () => {
            if (courseSlug) {
              router.replace({
                pathname: "/course/[slug]",
                params: {
                  slug: courseSlug,
                },
              });
            } else {
              router.back();
            }
          },
        },
      ]
    );

  } catch (progressError) {
    Alert.alert(
      "Xatolik",
      progressError instanceof Error
        ? progressError.message
        : "Quiz topshirildi, lekin dars progressini yangilashda xatolik yuz berdi."
    );
  }

  return;
}


        /*
        |--------------------------------------------------------------------------
        | FAILED
        |--------------------------------------------------------------------------
        |
        | Backend failed quizni
        | qayta topshirishga ruxsat beradi.
        |
        */

        Alert.alert(
          "Quizdan o'ta olmadingiz",
          `Natija: ${result.score}/${result.total}\n${result.percentage}%\n\nQayta urinib ko'rishingiz mumkin.`,
          [
            {
              text: "Qayta urinish",

              onPress: () => {
                setAnswers({});
              },
            },
          ]
        );

      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Quizni topshirishda xatolik yuz berdi.";

        Alert.alert(
          "Xatolik",
          message
        );

      } finally {
        setSubmitting(false);
      }
    };


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />

          <Text
            style={styles.loadingText}
          >
            Quiz yuklanmoqda...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error || !quiz) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.center}>
          <Text
            style={styles.errorTitle}
          >
            Xatolik yuz berdi
          </Text>

          <Text
            style={styles.errorText}
          >
            {error ||
              "Quiz topilmadi."}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadQuiz}
          >
            <Text
              style={styles.retryButtonText}
            >
              Qayta urinish
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={styles.backButtonText}
            >
              Orqaga qaytish
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }


  const alreadyPassed =
    quiz.attempt?.passed === true;


  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={styles.headerBackIcon}
            >
              ←
            </Text>
          </TouchableOpacity>

          <View
            style={styles.headerContent}
          >
            <Text
              style={styles.headerLabel}
            >
              QUIZ
            </Text>

            <Text
              style={styles.headerTitle}
            >
              {quiz.title}
            </Text>
          </View>
        </View>


        {/* DESCRIPTION */}

        {quiz.description ? (
          <View
            style={styles.descriptionCard}
          >
            <Text
              style={styles.descriptionText}
            >
              {quiz.description}
            </Text>
          </View>
        ) : null}


        {/* QUIZ INFO */}

        <View
          style={styles.infoContainer}
        >
          <View
            style={styles.infoItem}
          >
            <Text
              style={styles.infoValue}
            >
              {quiz.questions.length}
            </Text>

            <Text
              style={styles.infoLabel}
            >
              Savollar
            </Text>
          </View>

          <View
            style={styles.infoDivider}
          />

          <View
            style={styles.infoItem}
          >
            <Text
              style={styles.infoValue}
            >
              {quiz.passPercentage}%
            </Text>

            <Text
              style={styles.infoLabel}
            >
              O'tish bali
            </Text>
          </View>
        </View>


        {/* OLD RESULT */}

        {quiz.attempt ? (
          <View
            style={[
              styles.resultCard,

              quiz.attempt.passed
                ? styles.passedCard
                : styles.failedCard,
            ]}
          >
            <Text
              style={styles.resultTitle}
            >
              {quiz.attempt.passed
                ? "✓ Quiz muvaffaqiyatli topshirilgan"
                : "Oxirgi urinish natijasi"}
            </Text>

            <Text
              style={styles.resultScore}
            >
              {quiz.attempt.score}/
              {quiz.attempt.total}
              {" "}
              ({quiz.attempt.percentage}%)
            </Text>
          </View>
        ) : null}


        {/* QUESTIONS */}

        <View
          style={styles.questionsContainer}
        >
          {quiz.questions.map(
            (
              question,
              questionIndex
            ) => {
              const selectedOptions =
                answers[
                  question.id
                ] || [];


              return (
                <View
                  key={question.id}
                  style={
                    styles.questionCard
                  }
                >

                  {/* QUESTION */}

                  <Text
                    style={
                      styles.questionNumber
                    }
                  >
                    Savol{" "}
                    {questionIndex + 1}
                    {" "}
                    /{" "}
                    {quiz.questions.length}
                  </Text>

                  <Text
                    style={
                      styles.questionText
                    }
                  >
                    {question.question}
                  </Text>


                  {/* QUESTION TYPE */}

                  <Text
                    style={
                      styles.questionType
                    }
                  >
                    {question.type ===
                    "MULTIPLE"
                      ? "Bir nechta javob tanlash mumkin"
                      : "Bitta javobni tanlang"}
                  </Text>


                  {/* OPTIONS */}

                  <View
                    style={
                      styles.optionsContainer
                    }
                  >
                    {question.options.map(
                      (option) => {
                        const selected =
                          selectedOptions.includes(
                            option.id
                          );


                        return (
                          <TouchableOpacity
                            key={option.id}
                            activeOpacity={
                              0.8
                            }
                            disabled={
                              alreadyPassed
                            }
                            style={[
                              styles.option,

                              selected &&
                                styles.optionSelected,

                              alreadyPassed &&
                                styles.optionDisabled,
                            ]}
                            onPress={() =>
                              selectOption(
                                question,
                                option.id
                              )
                            }
                          >
                            <View
                              style={[
                                styles.optionIndicator,

                                selected &&
                                  styles.optionIndicatorSelected,
                              ]}
                            >
                              {selected ? (
                                <Text
                                  style={
                                    styles.optionCheck
                                  }
                                >
                                  ✓
                                </Text>
                              ) : null}
                            </View>

                            <Text
                              style={[
                                styles.optionText,

                                selected &&
                                  styles.optionTextSelected,
                              ]}
                            >
                              {option.text}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>
                </View>
              );
            }
          )}
        </View>


        {/* SUBMIT */}

        {!alreadyPassed ? (
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={
              submitting
            }
            style={[
              styles.submitButton,

              submitting &&
                styles.submitButtonDisabled,
            ]}
            onPress={
              handleSubmitQuiz
            }
          >
            {submitting ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={
                  styles.submitButtonText
                }
              >
                Quizni topshirish
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            style={
              styles.completeButton
            }
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.completeButtonText
              }
            >
              Darsga qaytish
            </Text>
          </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 40,
  },


  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },


  loadingText: {
    marginTop: 14,
    color: "#94A3B8",
    fontSize: 15,
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
    fontSize: 15,
    lineHeight: 22,
  },


  retryButton: {
    marginTop: 24,
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },


  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },


  backButton: {
    marginTop: 14,
    paddingVertical: 12,
  },


  backButtonText: {
    color: "#94A3B8",
    fontSize: 15,
  },


  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },


  headerBackButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },


  headerBackIcon: {
    color: "#FFFFFF",
    fontSize: 24,
  },


  headerContent: {
    flex: 1,
  },


  headerLabel: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },


  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
  },


  descriptionCard: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },


  descriptionText: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
  },


  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#0F172A",
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 20,
  },


  infoItem: {
    flex: 1,
    alignItems: "center",
  },


  infoDivider: {
    width: 1,
    backgroundColor: "#1E293B",
  },


  infoValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },


  infoLabel: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },


  resultCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },


  passedCard: {
    backgroundColor: "#052E16",
    borderColor: "#166534",
  },


  failedCard: {
    backgroundColor: "#450A0A",
    borderColor: "#991B1B",
  },


  resultTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },


  resultScore: {
    color: "#CBD5E1",
    marginTop: 6,
    fontSize: 15,
  },


  questionsContainer: {
    gap: 16,
  },


  questionCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
  },


  questionNumber: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },


  questionText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 25,
  },


  questionType: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 8,
  },


  optionsContainer: {
    marginTop: 18,
    gap: 10,
  },


  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1E293B",
  },


  optionSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#172554",
  },


  optionDisabled: {
    opacity: 0.7,
  },


  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#475569",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },


  optionIndicatorSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#2563EB",
  },


  optionCheck: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },


  optionText: {
    flex: 1,
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 21,
  },


  optionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },


  submitButton: {
    minHeight: 56,
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },


  submitButtonDisabled: {
    opacity: 0.65,
  },


  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },


  completeButton: {
    minHeight: 56,
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
  },


  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

});