import { useRef, useState } from "react";

import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ListRenderItemInfo,
} from "react-native";

import { router } from "expo-router";

import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

type OnboardingItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

const slides: OnboardingItem[] = [
  {
    id: "1",
    icon: "📚",
    title: "Bilimlarni kashf eting",
    description:
      "Turli mavzulardagi kurslarni o'rganing va o'zingiz uchun yangi bilimlarni kashf eting.",
  },
  {
    id: "2",
    icon: "🎓",
    title: "O'rganing va rivojlaning",
    description:
      "Qiziqarli darslar orqali bilimlaringizni oshiring va o'z rivojlanishingizni kuzating.",
  },
  {
    id: "3",
    icon: "🏆",
    title: "Challenge qiling",
    description:
      "Do'stlaringiz bilan bellashing, kurslarni yakunlang va yangi natijalarga erishing.",
  },
];

export default function OnboardingScreen() {
  const flatListRef =
    useRef<FlatList<OnboardingItem>>(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const { user, isAuthenticated } = useAuth();

  const goNext = () => {
    if (isAuthenticated && user) {
      router.replace("/explore");
    } else {
      router.replace("/auth");
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      goNext();
    }
  };

  const handleSkip = () => {
    goNext();
  };

  const renderItem = ({
    item,
  }: ListRenderItemInfo<OnboardingItem>) => {
    return (
      <View style={styles.slide}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            {item.icon}
          </Text>
        </View>

        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.description}>
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>
          QATRA
        </Text>

        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>
            O'tkazib yuborish
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );

          setCurrentIndex(index);
        }}
      />

      <View style={styles.bottom}>
        <View style={styles.pagination}>
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              style={[
                styles.dot,
                currentIndex === index &&
                  styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1
              ? "Boshlash"
              : "Davom etish"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 24,
    paddingTop: 20,
  },

  brand: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 3,
  },

  skipText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },

  slide: {
    width,

    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 32,
  },

  iconContainer: {
    width: 150,
    height: 150,

    borderRadius: 75,

    backgroundColor: "#172554",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 50,
  },

  icon: {
    fontSize: 70,
  },

  title: {
    color: "#FFFFFF",

    fontSize: 30,
    fontWeight: "800",

    textAlign: "center",
  },

  description: {
    color: "#94A3B8",

    fontSize: 16,
    lineHeight: 25,

    textAlign: "center",

    marginTop: 18,
    maxWidth: 340,
  },

  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",

    marginBottom: 28,
  },

  dot: {
    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: "#334155",

    marginHorizontal: 5,
  },

  activeDot: {
    width: 24,

    backgroundColor: "#2563EB",
  },

  button: {
    height: 58,

    backgroundColor: "#2563EB",

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",

    fontSize: 17,
    fontWeight: "700",
  },
});