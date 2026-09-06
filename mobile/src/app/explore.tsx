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
  useCallback,
  useEffect,
  useState,
} from "react";

import { router } from "expo-router";

import { useAuth } from "@/context/AuthContext";

import {
  getCategories,
  type ReelCategory,
} from "@/services/reel-category.service";


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

  const [categories, setCategories] =
    useState<ReelCategory[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  const loadCategories =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getCategories();

        setCategories(response.data);

      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Kategoriyalarni yuklashda xatolik yuz berdi.";

        setError(message);

      } finally {
        setLoading(false);
      }
    }, []);


  useEffect(() => {
    loadCategories();
  }, [loadCategories]);


  const getCategoryEmoji = (
    category: ReelCategory
  ) => {
    return (
      CATEGORY_EMOJIS[
        category.slug.toLowerCase()
      ] || "📚"
    );
  };


  const handleCategoryPress = (
    category: ReelCategory
  ) => {
    router.push({
      pathname: "/category/[slug]",
      params: {
        slug: category.slug,
      },
    });
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Assalomu alaykum 👋
            </Text>

            <Text style={styles.name}>
              {user?.fullName || "Foydalanuvchi"}
            </Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {
                user?.fullName
                  ?.charAt(0)
                  .toUpperCase() || "Q"
              }
            </Text>
          </View>
        </View>


        {/* HERO */}

        <View style={styles.hero}>
          <Text style={styles.heroSmall}>
            BUGUNGI O'RGANISH
          </Text>

          <Text style={styles.heroTitle}>
            Bilimingizni{"\n"}
            kengaytirishni davom ettiring
          </Text>

          <Text style={styles.heroDescription}>
            Qatra bilan har kuni yangi bilimlarga ega bo'ling.
          </Text>

          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Davom ettirish →
            </Text>
          </TouchableOpacity>
        </View>


        {/* CATEGORIES HEADER */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Mavzular
          </Text>

          <TouchableOpacity
            onPress={loadCategories}
          >
            <Text style={styles.seeAll}>
              Yangilash
            </Text>
          </TouchableOpacity>
        </View>


        {/* LOADING */}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#2563EB"
            />

            <Text style={styles.loadingText}>
              Mavzular yuklanmoqda...
            </Text>
          </View>
        )}


        {/* ERROR */}

        {!loading && error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>
              Xatolik yuz berdi
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadCategories}
            >
              <Text style={styles.retryButtonText}>
                Qayta urinish
              </Text>
            </TouchableOpacity>
          </View>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          categories.length === 0 && (
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
          )}


        {/* CATEGORIES */}

        {!loading &&
          !error &&
          categories.length > 0 && (
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
                      style={styles.categoryDescription}
                      numberOfLines={2}
                    >
                      {
                        category.description ||
                        "Ushbu mavzu bo'yicha darslarni o'rganing"
                      }
                    </Text>

                    {category._count && (
                      <Text style={styles.lessonCount}>
                        {category._count.reels} ta dars
                      </Text>
                    )}
                  </View>


                  <Text style={styles.arrow}>
                    ›
                  </Text>

                </TouchableOpacity>
              ))}
            </View>
          )}


        {/* RECOMMENDED */}

        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Siz uchun
            </Text>
          </View>

          <View style={styles.recommendedCard}>
            <Text style={styles.recommendedEmoji}>
              📚
            </Text>

            <View style={styles.recommendedContent}>
              <Text style={styles.recommendedTitle}>
                O'rganishni boshlang
              </Text>

              <Text style={styles.recommendedDescription}>
                O'zingizga qiziq mavzuni tanlang va bilim olishni boshlang.
              </Text>
            </View>
          </View>
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

  greeting: {
    color: "#94A3B8",
    fontSize: 15,
  },

  name: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 4,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },


  hero: {
    backgroundColor: "#2563EB",
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },

  heroSmall: {
    color: "#BFDBFE",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 12,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 34,
  },

  heroDescription: {
    color: "#DBEAFE",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
  },

  continueButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 13,
    marginTop: 22,
  },

  continueButtonText: {
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "800",
  },


  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },

  seeAll: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "700",
  },


  loadingContainer: {
    paddingVertical: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 14,
  },


  errorContainer: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  errorTitle: {
    color: "#FCA5A5",
    fontSize: 17,
    fontWeight: "700",
  },

  errorText: {
    color: "#CBD5E1",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },

  retryButton: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: 16,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },


  emptyContainer: {
    paddingVertical: 45,
    alignItems: "center",
  },

  emptyEmoji: {
    fontSize: 45,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
  },

  emptyText: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 8,
  },


  categories: {
    gap: 12,
  },

  categoryCard: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 20,
    padding: 16,

    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 25,
  },

  categoryContent: {
    flex: 1,
  },

  categoryTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  categoryDescription: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },

  lessonCount: {
    color: "#3B82F6",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },

  arrow: {
    color: "#64748B",
    fontSize: 30,
    marginLeft: 10,
  },


  recommendedSection: {
    marginTop: 32,
  },

  recommendedCard: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1E293B",

    borderRadius: 20,
    padding: 18,

    flexDirection: "row",
    alignItems: "center",
  },

  recommendedEmoji: {
    fontSize: 34,
    marginRight: 15,
  },

  recommendedContent: {
    flex: 1,
  },

  recommendedTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  recommendedDescription: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
});