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

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  getCategoryReels,
  type ReelCategory,
} from "@/services/reel-category.service";


type Reel = {
  id: string;

  title: string;

  description?: string | null;

  thumbnailUrl?: string | null;

  videoUrl?: string | null;

  duration?: number | null;

  createdAt?: string;

  likeCount?: number;

  commentCount?: number;

  likedByMe?: boolean;
};


type CategoryReelsResponse = {
  success: boolean;

  data: {
    category: ReelCategory;

    reels: Reel[];
  };
};


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


export default function CategoryScreen() {
  const { slug } =
    useLocalSearchParams<{
      slug: string;
    }>();

  const [category, setCategory] =
    useState<ReelCategory | null>(null);

  const [reels, setReels] =
    useState<Reel[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  const loadCategory =
    useCallback(async () => {
      if (!slug) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await getCategoryReels(
            slug
          ) as CategoryReelsResponse;

        setCategory(
          response.data.category
        );

        setReels(
          response.data.reels
        );

      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Darslarni yuklashda xatolik yuz berdi.";

        setError(message);

      } finally {
        setLoading(false);
      }
    }, [slug]);


  useEffect(() => {
    loadCategory();
  }, [loadCategory]);


  const getCategoryEmoji = () => {
    if (!category) {
      return "📚";
    }

    return (
      CATEGORY_EMOJIS[
        category.slug.toLowerCase()
      ] || "📚"
    );
  };


  const handleReelPress = (
    reel: Reel
  ) => {
    console.log(
      "Selected reel:",
      reel
    );

    /*
      Keyingi bosqichda:

      router.push({
        pathname: "/reel/[id]",
        params: {
          id: reel.id,
        },
      });
    */
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />

          <Text style={styles.loadingText}>
            Darslar yuklanmoqda...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorScreen}>

          <Text style={styles.errorEmoji}>
            ⚠️
          </Text>

          <Text style={styles.errorTitle}>
            Xatolik yuz berdi
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadCategory}
          >
            <Text style={styles.retryButtonText}>
              Qayta urinish
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backTextButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>
              ← Orqaga qaytish
            </Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    );
  }


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
          <Text style={styles.backButtonText}>
            ←
          </Text>
        </TouchableOpacity>


        {/* CATEGORY HEADER */}

        <View style={styles.categoryHeader}>

          <View style={styles.categoryIcon}>
            <Text style={styles.categoryEmoji}>
              {getCategoryEmoji()}
            </Text>
          </View>

          <Text style={styles.categoryTitle}>
            {category?.name || "Mavzu"}
          </Text>

          {category?.description && (
            <Text
              style={
                styles.categoryDescription
              }
            >
              {category.description}
            </Text>
          )}

          <Text style={styles.lessonInfo}>
            {reels.length} ta dars mavjud
          </Text>

        </View>


        {/* SECTION TITLE */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Darslar
          </Text>
        </View>


        {/* EMPTY */}

        {reels.length === 0 && (
          <View style={styles.emptyContainer}>

            <Text style={styles.emptyEmoji}>
              📚
            </Text>

            <Text style={styles.emptyTitle}>
              Hozircha darslar yo'q
            </Text>

            <Text style={styles.emptyText}>
              Bu mavzuga tez orada yangi
              darslar qo'shiladi.
            </Text>

          </View>
        )}


        {/* REELS */}

        {reels.length > 0 && (
          <View style={styles.reelsContainer}>

            {reels.map(
              (reel, index) => (
                <TouchableOpacity
                  key={reel.id}
                  style={styles.reelCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    handleReelPress(reel)
                  }
                >

                  {/* NUMBER */}

                  <View
                    style={
                      styles.reelNumber
                    }
                  >
                    <Text
                      style={
                        styles.reelNumberText
                      }
                    >
                      {index + 1}
                    </Text>
                  </View>


                  {/* CONTENT */}

                  <View
                    style={
                      styles.reelContent
                    }
                  >

                    <Text
                      style={
                        styles.reelTitle
                      }
                      numberOfLines={2}
                    >
                      {reel.title}
                    </Text>


                    {reel.description && (
                      <Text
                        style={
                          styles.reelDescription
                        }
                        numberOfLines={2}
                      >
                        {reel.description}
                      </Text>
                    )}


                    <View
                      style={
                        styles.reelMeta
                      }
                    >

                      {typeof reel.likeCount ===
                        "number" && (
                        <Text
                          style={
                            styles.metaText
                          }
                        >
                          ❤️ {reel.likeCount}
                        </Text>
                      )}

                      {typeof reel.commentCount ===
                        "number" && (
                        <Text
                          style={
                            styles.metaText
                          }
                        >
                          💬 {reel.commentCount}
                        </Text>
                      )}

                    </View>

                  </View>


                  {/* PLAY */}

                  <View
                    style={
                      styles.playButton
                    }
                  >
                    <Text
                      style={
                        styles.playIcon
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
    paddingBottom: 40,
  },


  backButton: {
    width: 46,
    height: 46,

    borderRadius: 15,

    backgroundColor: "#0F172A",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 24,
  },


  backButtonText: {
    color: "#FFFFFF",
    fontSize: 26,
  },


  categoryHeader: {
    alignItems: "center",
    marginBottom: 35,
  },


  categoryIcon: {
    width: 82,
    height: 82,

    borderRadius: 26,

    backgroundColor: "#172554",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 18,
  },


  categoryEmoji: {
    fontSize: 40,
  },


  categoryTitle: {
    color: "#FFFFFF",

    fontSize: 30,
    fontWeight: "800",

    textAlign: "center",
  },


  categoryDescription: {
    color: "#94A3B8",

    fontSize: 15,
    lineHeight: 22,

    textAlign: "center",

    marginTop: 10,
  },


  lessonInfo: {
    color: "#3B82F6",

    fontSize: 14,
    fontWeight: "700",

    marginTop: 14,
  },


  sectionHeader: {
    marginBottom: 16,
  },


  sectionTitle: {
    color: "#FFFFFF",

    fontSize: 22,
    fontWeight: "800",
  },


  reelsContainer: {
    gap: 12,
  },


  reelCard: {
    backgroundColor: "#0F172A",

    borderWidth: 1,
    borderColor: "#1E293B",

    borderRadius: 20,

    padding: 16,

    flexDirection: "row",
    alignItems: "center",
  },


  reelNumber: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: "#172554",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 13,
  },


  reelNumberText: {
    color: "#60A5FA",

    fontSize: 16,
    fontWeight: "800",
  },


  reelContent: {
    flex: 1,
  },


  reelTitle: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "700",

    lineHeight: 22,
  },


  reelDescription: {
    color: "#94A3B8",

    fontSize: 13,

    lineHeight: 18,

    marginTop: 5,
  },


  reelMeta: {
    flexDirection: "row",

    gap: 12,

    marginTop: 8,
  },


  metaText: {
    color: "#64748B",

    fontSize: 12,
  },


  playButton: {
    width: 42,
    height: 42,

    borderRadius: 14,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    marginLeft: 12,
  },


  playIcon: {
    color: "#FFFFFF",

    fontSize: 15,

    marginLeft: 2,
  },


  loadingContainer: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },


  loadingText: {
    color: "#94A3B8",

    fontSize: 14,

    marginTop: 15,
  },


  errorScreen: {
    flex: 1,

    paddingHorizontal: 30,

    justifyContent: "center",
    alignItems: "center",
  },


  errorEmoji: {
    fontSize: 50,
  },


  errorTitle: {
    color: "#FFFFFF",

    fontSize: 22,
    fontWeight: "800",

    marginTop: 16,
  },


  errorText: {
    color: "#94A3B8",

    fontSize: 14,

    textAlign: "center",

    lineHeight: 21,

    marginTop: 10,
  },


  retryButton: {
    backgroundColor: "#2563EB",

    borderRadius: 14,

    paddingHorizontal: 22,
    paddingVertical: 13,

    marginTop: 24,
  },


  retryButtonText: {
    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "700",
  },


  backTextButton: {
    marginTop: 18,
  },


  backText: {
    color: "#60A5FA",

    fontSize: 14,
    fontWeight: "700",
  },


  emptyContainer: {
    backgroundColor: "#0F172A",

    borderWidth: 1,
    borderColor: "#1E293B",

    borderRadius: 22,

    paddingVertical: 45,
    paddingHorizontal: 20,

    alignItems: "center",
  },


  emptyEmoji: {
    fontSize: 42,
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

    textAlign: "center",

    lineHeight: 20,

    marginTop: 8,
  },
});