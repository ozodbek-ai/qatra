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

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "expo-router";

import {
  Course,
  getCourses,
} from "@/services/course.service";

export default function CoursesScreen() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    try {
      setError(null);

      const response = await getCourses();

      setCourses(response.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Kurslarni yuklashda xatolik yuz berdi."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadCourses();
  };

  const openCourse = (course: Course) => {
    router.push({
      pathname: "/course/[slug]",
      params: {
        slug: course.slug,
      },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#2563EB"
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
        <View style={styles.emptyContainer}>
          <Text style={styles.errorTitle}>
            Xatolik yuz berdi
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setIsLoading(true);
              loadCourses();
            }}
          >
            <Text style={styles.retryButtonText}>
              Qayta urinish
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>
              Darslar
            </Text>

            <Text style={styles.subtitle}>
              O'zingizga mos kursni tanlang va
              o'rganishni davom ettiring.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>
              📚
            </Text>

            <Text style={styles.emptyTitle}>
              Hozircha kurslar yo'q
            </Text>

            <Text style={styles.emptyText}>
              Tez orada yangi kurslar qo'shiladi.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            activeOpacity={0.8}
            onPress={() => openCourse(item)}
          >
            {item.thumbnailUrl || item.imageUrl ? (
              <Image
                source={{
                  uri:
                    item.thumbnailUrl ||
                    item.imageUrl ||
                    undefined,
                }}
                style={styles.courseImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderEmoji}>
                  📚
                </Text>
              </View>
            )}

            <View style={styles.courseContent}>
              <Text
                style={styles.courseTitle}
                numberOfLines={2}
              >
                {item.title}
              </Text>

              {item.description ? (
                <Text
                  style={styles.courseDescription}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              ) : null}

              <View style={styles.courseFooter}>
                <View style={styles.lessonBadge}>
                  <Text style={styles.lessonBadgeText}>
                    {item._count?.lessons || 0} ta dars
                  </Text>
                </View>

                <Text style={styles.arrow}>
                  →
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 110,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },

  courseCard: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 22,
    marginBottom: 16,
    overflow: "hidden",
  },

  courseImage: {
    width: "100%",
    height: 170,
    backgroundColor: "#172554",
  },

  placeholderImage: {
    width: "100%",
    height: 170,
    backgroundColor: "#172554",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderEmoji: {
    fontSize: 55,
  },

  courseContent: {
    padding: 18,
  },

  courseTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
    lineHeight: 26,
  },

  courseDescription: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },

  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  lessonBadge: {
    backgroundColor: "#172554",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  lessonBadgeText: {
    color: "#93C5FD",
    fontSize: 13,
    fontWeight: "700",
  },

  arrow: {
    color: "#3B82F6",
    fontSize: 24,
    fontWeight: "700",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#94A3B8",
    marginTop: 14,
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    minHeight: 400,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyEmoji: {
    fontSize: 50,
    marginBottom: 14,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  emptyText: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },

  errorTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  errorText: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },

  retryButton: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 20,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});