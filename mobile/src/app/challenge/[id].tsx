import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
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
  ChallengeProgress,
  getChallengeProgress,
} from "@/services/challenge.service";


export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [challenge, setChallenge] =
    useState<ChallengeProgress | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);


  const loadChallenge =
    useCallback(
      async (isRefresh = false) => {
        if (!id) return;

        try {
          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          const response =
            await getChallengeProgress(id);

          setChallenge(response.data);
        } catch (error) {
          console.log(
            "Challenge progress xatoligi:",
            error
          );

          Alert.alert(
            "Xatolik",
            error instanceof Error
              ? error.message
              : "Challenge ma'lumotlarini olishda xatolik yuz berdi."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [id]
    );


  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);


  const getStatusText = (
    status: string
  ) => {
    switch (status) {
      case "PENDING":
        return "Kutilmoqda";

      case "ACCEPTED":
        return "Faol";

      case "DECLINED":
        return "Rad etilgan";

      case "COMPLETED":
        return "Tugallangan";

      default:
        return status;
    }
  };


  const getWinnerText = () => {
    if (!challenge) return "";

    if (challenge.status !== "COMPLETED") {
      return "Challenge hali yakunlanmagan";
    }

    if (!challenge.winner) {
      return "Durang";
    }

    return `${challenge.winner.fullName} g'olib!`;
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Challenge yuklanmoqda...
        </Text>
      </View>
    );
  }


  if (!challenge) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Challenge topilmadi.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Orqaga qaytish
          </Text>
        </Pressable>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.headerBackText}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Challenge
          </Text>

          <Text style={styles.headerSubtitle}>
            {challenge.course.title}
          </Text>
        </View>
      </View>


      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadChallenge(true)}
            tintColor="#2563EB"
          />
        }
      >
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>
            Holati
          </Text>

          <Text style={styles.statusValue}>
            {getStatusText(challenge.status)}
          </Text>
        </View>


        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>
            Challenge Progress
          </Text>


          <View style={styles.playersRow}>
            <View style={styles.player}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {challenge.challenger.fullName
                    .charAt(0)
                    .toUpperCase()}
                </Text>
              </View>

              <Text
                style={styles.playerName}
                numberOfLines={2}
              >
                {challenge.challenger.fullName}
              </Text>

              <Text style={styles.score}>
                {challenge.challengerScore}%
              </Text>
            </View>


            <View style={styles.vsContainer}>
              <Text style={styles.vs}>
                VS
              </Text>
            </View>


            <View style={styles.player}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {challenge.opponent.fullName
                    .charAt(0)
                    .toUpperCase()}
                </Text>
              </View>

              <Text
                style={styles.playerName}
                numberOfLines={2}
              >
                {challenge.opponent.fullName}
              </Text>

              <Text style={styles.score}>
                {challenge.opponentScore}%
              </Text>
            </View>
          </View>


          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressUserName}>
                {challenge.challenger.fullName}
              </Text>

              <Text style={styles.progressPercent}>
                {challenge.challengerScore}%
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      Math.max(
                        challenge.challengerScore,
                        0
                      ),
                      100
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>


          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressUserName}>
                {challenge.opponent.fullName}
              </Text>

              <Text style={styles.progressPercent}>
                {challenge.opponentScore}%
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      Math.max(
                        challenge.opponentScore,
                        0
                      ),
                      100
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>


        {challenge.status === "COMPLETED" && (
          <View style={styles.winnerCard}>
            <Text style={styles.trophy}>
              🏆
            </Text>

            <Text style={styles.winnerTitle}>
              {getWinnerText()}
            </Text>

            {challenge.winner && (
              <Text style={styles.winnerSubtitle}>
                Challenge muvaffaqiyatli yakunlandi
              </Text>
            )}
          </View>
        )}


        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Kurs
          </Text>

          <Text style={styles.infoValue}>
            {challenge.course.title}
          </Text>

          <View style={styles.infoDivider} />

          <Text style={styles.infoTitle}>
            Boshlangan sana
          </Text>

          <Text style={styles.infoValue}>
            {new Date(
              challenge.createdAt
            ).toLocaleDateString()}
          </Text>
        </View>


        <Text style={styles.refreshHint}>
          Progressni yangilash uchun ekranni pastga torting.
        </Text>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    color: "#64748B",
    fontSize: 14,
  },

  errorText: {
    fontSize: 16,
    color: "#EF4444",
  },

  backButton: {
    marginTop: 20,
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 58,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  headerBackButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  headerBackText: {
    fontSize: 34,
    lineHeight: 38,
    color: "#0F172A",
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 3,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statusLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },

  statusValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2563EB",
    marginTop: 5,
  },

  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  progressTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 24,
  },

  playersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  player: {
    flex: 1,
    alignItems: "center",
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  avatarText: {
    fontSize: 23,
    fontWeight: "800",
    color: "#2563EB",
  },

  playerName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    textAlign: "center",
    minHeight: 34,
  },

  score: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2563EB",
    marginTop: 8,
  },

  vsContainer: {
    width: 45,
    alignItems: "center",
  },

  vs: {
    fontSize: 14,
    fontWeight: "900",
    color: "#64748B",
  },

  progressSection: {
    marginTop: 18,
  },

  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  progressUserName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },

  progressPercent: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
  },

  progressTrack: {
    height: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 10,
  },

  winnerCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 20,
    padding: 22,
    marginTop: 16,
    alignItems: "center",
  },

  trophy: {
    fontSize: 44,
  },

  winnerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#92400E",
    marginTop: 8,
  },

  winnerSubtitle: {
    fontSize: 13,
    color: "#A16207",
    marginTop: 5,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  infoTitle: {
    fontSize: 12,
    color: "#94A3B8",
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginTop: 5,
  },

  infoDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },

  refreshHint: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 20,
  },
});