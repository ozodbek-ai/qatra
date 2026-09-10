import {
  ActivityIndicator,
  RefreshControl,
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
  useRouter,
} from "expo-router";

import {
  getMyCertificates,
  type Certificate,
} from "@/services/certificate.service";


export default function CertificatesScreen() {
  const router = useRouter();


  const [certificates, setCertificates] =
    useState<Certificate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  const loadCertificates =
    useCallback(
      async (isRefresh = false) => {
        try {
          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);

          const response =
            await getMyCertificates();

          setCertificates(
            response.data
          );

        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Sertifikatlarni yuklashda xatolik yuz berdi.";

          setError(message);

        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );


  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);


  const handleRefresh = () => {
    loadCertificates(true);
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
            Sertifikatlar yuklanmoqda...
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

  if (error) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            Xatolik yuz berdi
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              loadCertificates()
            }
          >
            <Text
              style={styles.retryButtonText}
            >
              Qayta urinish
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >
          <Text style={styles.backIcon}>
            ←
          </Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>
            Sertifikatlar
          </Text>

          <Text style={styles.subtitle}>
            Sizning muvaffaqiyatlaringiz
          </Text>
        </View>
      </View>


      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >

        {/* EMPTY */}

        {certificates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              🏆
            </Text>

            <Text style={styles.emptyTitle}>
              Hali sertifikat yo'q
            </Text>

            <Text style={styles.emptyText}>
              Kurslarni muvaffaqiyatli yakunlaganingizdan
              keyin sertifikatlaringiz shu yerda ko'rinadi.
            </Text>
          </View>
        ) : (

          <>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>
                {certificates.length}
              </Text>

              <Text style={styles.summaryText}>
                Olingan sertifikatlar
              </Text>
            </View>


            <View style={styles.certificatesContainer}>
              {certificates.map(
                (certificate) => {

                  const issuedDate =
                    new Date(
                      certificate.issuedAt
                    ).toLocaleDateString(
                      "uz-UZ",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    );


                  return (
                    <TouchableOpacity
                      key={certificate.id}
                      activeOpacity={0.85}
                      style={
                        styles.certificateCard
                      }
                      onPress={() =>
                        router.push({
                          pathname:
                            "/certificate/[id]",
                          params: {
                            id: certificate.id,
                          },
                        })
                      }
                    >

                      <View
                        style={
                          styles.certificateIconContainer
                        }
                      >
                        <Text
                          style={
                            styles.certificateIcon
                          }
                        >
                          🏆
                        </Text>
                      </View>


                      <View
                        style={
                          styles.certificateContent
                        }
                      >

                        <Text
                          style={
                            styles.courseTitle
                          }
                          numberOfLines={2}
                        >
                          {
                            certificate.course
                              .title
                          }
                        </Text>


                        <Text
                          style={
                            styles.certificateLabel
                          }
                        >
                          Sertifikat raqami
                        </Text>

                        <Text
                          style={
                            styles.certificateNumber
                          }
                        >
                          {
                            certificate
                              .certificateNo
                          }
                        </Text>


                        <Text
                          style={
                            styles.dateText
                          }
                        >
                          {issuedDate}
                        </Text>

                      </View>


                      <Text
                        style={
                          styles.arrow
                        }
                      >
                        ›
                      </Text>

                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          </>
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


  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
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


  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },


  subtitle: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 3,
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
    color: "#94A3B8",
    marginTop: 14,
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
    marginTop: 22,
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 12,
  },


  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },


  emptyContainer: {
    alignItems: "center",
    paddingTop: 90,
    paddingHorizontal: 30,
  },


  emptyIcon: {
    fontSize: 55,
    marginBottom: 20,
  },


  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },


  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 23,
  },


  summaryCard: {
    backgroundColor: "#172554",
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E40AF",
  },


  summaryNumber: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
  },


  summaryText: {
    color: "#93C5FD",
    fontSize: 14,
    marginTop: 5,
  },


  certificatesContainer: {
    gap: 14,
  },


  certificateCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },


  certificateIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#172554",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },


  certificateIcon: {
    fontSize: 26,
  },


  certificateContent: {
    flex: 1,
  },


  courseTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },


  certificateLabel: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 8,
  },


  certificateNumber: {
    color: "#60A5FA",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },


  dateText: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 6,
  },


  arrow: {
    color: "#64748B",
    fontSize: 28,
    marginLeft: 8,
  },

});