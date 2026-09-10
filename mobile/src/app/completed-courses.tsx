import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  getCompletedCourses,
  type CompletedCourse,
} from "@/services/completion.service";


export default function CompletedCoursesScreen() {
  const [courses, setCourses] =
    useState<CompletedCourse[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  const loadCompletedCourses =
    useCallback(async () => {
      try {
        setError(null);

        const response =
          await getCompletedCourses();

        setCourses(response.data);

      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Ma'lumotlarni olishda xatolik yuz berdi."
        );
      } finally {
        setLoading(false);
      }
    }, []);


  useEffect(() => {
    loadCompletedCourses();
  }, [loadCompletedCourses]);


  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await loadCompletedCourses();

    } finally {
      setRefreshing(false);
    }
  };


  const formatDate = (
    dateString: string
  ) => {
    try {
      return new Date(
        dateString
      ).toLocaleDateString(
        "uz-UZ",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
    } catch {
      return dateString;
    }
  };


  const renderCourse = ({
    item,
  }: {
    item: CompletedCourse;
  }) => {
    const imageUrl =
      item.course.thumbnailUrl ||
      item.course.imageUrl ||
      null;

    return (
      <TouchableOpacity
        style={styles.courseCard}
        activeOpacity={0.8}
        onPress={() => {
          if (item.course.slug) {
            router.push({
              pathname: "/course/[slug]",
              params: {
                slug: item.course.slug,
              },
            });
          }
        }}
      >
        {imageUrl ? (
          <Image
            source={{
              uri: imageUrl,
            }}
            style={styles.courseImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              ✓
            </Text>
          </View>
        )}


        <View style={styles.courseContent}>

          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>
              ✓ Tugatilgan
            </Text>
          </View>


          <Text
            style={styles.courseTitle}
            numberOfLines={2}
          >
            {item.course.title}
          </Text>


          {item.course.category ? (
            <Text
              style={styles.category}
            >
              {item.course.category}
            </Text>
          ) : null}


          <Text style={styles.completedDate}>
            Tugatilgan:{" "}
            {formatDate(
              item.completedAt
            )}
          </Text>

        </View>

      </TouchableOpacity>
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
            Tugatilgan kurslar yuklanmoqda...
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
            onPress={() => {
              setLoading(true);
              loadCompletedCourses();
            }}
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
          <Text style={styles.backText}>
            ←
          </Text>
        </TouchableOpacity>


        <View>
          <Text style={styles.title}>
            Tugatilgan kurslar
          </Text>

          <Text style={styles.subtitle}>
            {courses.length} ta kurs
          </Text>
        </View>

      </View>


      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourse}
        contentContainerStyle={
          courses.length === 0
            ? styles.emptyList
            : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#2563EB"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>

            <Text style={styles.emptyIcon}>
              🎓
            </Text>

            <Text style={styles.emptyTitle}>
              Hali kurs tugatmagansiz
            </Text>

            <Text style={styles.emptyText}>
              Kurslarni to‘liq tugatganingizdan
              keyin ular shu yerda ko‘rinadi.
            </Text>

            <TouchableOpacity
              style={styles.coursesButton}
              onPress={() =>
                router.replace("/courses")
              }
            >
              <Text style={styles.coursesButtonText}>
                Kurslarni ko‘rish
              </Text>
            </TouchableOpacity>

          </View>
        }
      />

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
    paddingHorizontal: 30,
  },

  loadingText: {
    color: "#94A3B8",
    marginTop: 16,
    fontSize: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,

    borderRadius: 13,

    backgroundColor: "#0F172A",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 24,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  subtitle: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 3,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  courseCard: {
    backgroundColor: "#0F172A",

    borderRadius: 18,

    marginBottom: 14,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#1E293B",
  },

  courseImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#1E293B",
  },

  placeholderImage: {
    width: "100%",
    height: 130,

    backgroundColor: "#172554",

    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: "#60A5FA",
    fontSize: 45,
    fontWeight: "800",
  },

  courseContent: {
    padding: 16,
  },

  completedBadge: {
    alignSelf: "flex-start",

    backgroundColor: "#064E3B",

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 20,

    marginBottom: 10,
  },

  completedBadgeText: {
    color: "#34D399",
    fontSize: 12,
    fontWeight: "700",
  },

  courseTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
  },

  category: {
    color: "#60A5FA",
    fontSize: 13,
    marginTop: 7,
  },

  completedDate: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 12,
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 35,
  },

  emptyIcon: {
    fontSize: 52,
    marginBottom: 18,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
  },

  coursesButton: {
    backgroundColor: "#2563EB",

    paddingHorizontal: 22,
    paddingVertical: 13,

    borderRadius: 13,

    marginTop: 24,
  },

  coursesButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  errorTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  errorText: {
    color: "#F87171",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },

  retryButton: {
    backgroundColor: "#2563EB",

    paddingHorizontal: 20,
    paddingVertical: 12,

    borderRadius: 12,

    marginTop: 20,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});