import * as WebBrowser from "expo-web-browser";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
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
  getMyCertificates,
  getCertificatePdfUrl,
  type Certificate,
} from "@/services/certificate.service";


export default function CertificateDetailScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();


  const [certificate, setCertificate] =
    useState<Certificate | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

const [pdfLoading, setPdfLoading] =
  useState(false);


  const loadCertificate =
    useCallback(async () => {
      if (!id) {
        setError("Sertifikat ID topilmadi.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        /*
        |--------------------------------------------------------------------------
        | BACKENDDA GET /certificates/:id YO'Q
        |--------------------------------------------------------------------------
        |
        | Shuning uchun userning barcha
        | sertifikatlarini olib,
        | ID orqali keraklisini topamiz.
        |
        */

        const response =
          await getMyCertificates();

        const foundCertificate =
          response.data.find(
            (item) => item.id === id
          );

        if (!foundCertificate) {
          throw new Error(
            "Sertifikat topilmadi."
          );
        }

        setCertificate(
          foundCertificate
        );

      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Sertifikatni yuklashda xatolik yuz berdi.";

        setError(message);

      } finally {
        setLoading(false);
      }
    }, [id]);


  useEffect(() => {
    loadCertificate();
  }, [loadCertificate]);

const handleOpenPdf = async () => {
  if (!certificate) {
    return;
  }

  try {
    setPdfLoading(true);

    const pdfData =
      await getCertificatePdfUrl(
        certificate.id
      );

    await WebBrowser.openBrowserAsync(
      pdfData.url
    );

  } catch (error) {
    Alert.alert(
      "Xatolik",
      error instanceof Error
        ? error.message
        : "Sertifikat PDF faylini ochishda xatolik yuz berdi."
    );
  } finally {
    setPdfLoading(false);
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
            Sertifikat yuklanmoqda...
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

  if (error || !certificate) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.center}>

          <Text style={styles.errorIcon}>
            ⚠️
          </Text>

          <Text style={styles.errorTitle}>
            Sertifikat topilmadi
          </Text>

          <Text style={styles.errorText}>
            {error ||
              "Sertifikat ma'lumotlarini yuklab bo'lmadi."}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadCertificate}
          >
            <Text
              style={styles.retryButtonText}
            >
              Qayta urinish
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backTextButton}
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={styles.backText}
            >
              Orqaga qaytish
            </Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    );
  }


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
    <SafeAreaView
      style={styles.container}>

      {/* HEADER */}

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


        <Text style={styles.headerTitle}>
          Sertifikat
        </Text>


        <View
          style={styles.headerSpacer}
        />

      </View>


      {/* CERTIFICATE */}

      <View style={styles.content}>

        <View
          style={styles.certificateCard}
        >

          {/* LOGO */}

          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              QATRA
            </Text>
          </View>


          <View style={styles.line} />


          {/* ICON */}

          <Text style={styles.trophy}>
            🏆
          </Text>


          {/* TITLE */}

          <Text style={styles.certificateTitle}>
            SERTIFIKAT
          </Text>


          <Text style={styles.confirmationText}>
            Ushbu sertifikat quyidagi kursni
            muvaffaqiyatli yakunlaganligini tasdiqlaydi
          </Text>


          {/* COURSE */}

          <View style={styles.courseContainer}>
            <Text style={styles.courseTitle}>
              {certificate.course.title}
            </Text>
          </View>


          {/* DATE */}

          <View style={styles.infoSection}>

            <Text style={styles.infoLabel}>
              Berilgan sana
            </Text>

            <Text style={styles.infoValue}>
              {issuedDate}
            </Text>

          </View>


          {/* CERTIFICATE NUMBER */}

          <View style={styles.numberContainer}>

            <Text style={styles.numberLabel}>
              SERTIFIKAT RAQAMI
            </Text>

            <Text style={styles.numberValue}>
              {certificate.certificateNo}
            </Text>

          </View>


          {/* FOOTER */}

          <View style={styles.footerLine} />

          <Text style={styles.footerText}>
            QATRA Learning Platform
          </Text>

        </View>

        {/* PDF */}

<TouchableOpacity
  style={[
    styles.pdfButton,
    pdfLoading && styles.pdfButtonDisabled,
  ]}
  activeOpacity={0.8}
  onPress={handleOpenPdf}
  disabled={pdfLoading}
>
  {pdfLoading ? (
    <ActivityIndicator
      color="#FFFFFF"
    />
  ) : (
    <>
      <Text style={styles.pdfIcon}>
        📄
      </Text>

      <Text style={styles.pdfButtonText}>
        Sertifikat PDF faylini ochish
      </Text>
    </>
  )}
</TouchableOpacity>


        {/* STATUS */}

        <View style={styles.statusCard}>

          <View style={styles.statusIcon}>
            <Text style={styles.statusCheck}>
              ✓
            </Text>
          </View>

          <View style={styles.statusContent}>

            <Text style={styles.statusTitle}>
              Sertifikat tasdiqlangan
            </Text>

            <Text style={styles.statusText}>
              Ushbu sertifikat tizim tomonidan
              muvaffaqiyatli yaratilgan.
            </Text>

          </View>

        </View>

      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#020617",
  },


  header: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },


  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },


  backIcon: {
    color: "#FFFFFF",
    fontSize: 24,
  },


  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },


  headerSpacer: {
    width: 42,
  },


  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },


  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },


  loadingText: {
    color: "#94A3B8",
    fontSize: 15,
    marginTop: 14,
  },


  errorIcon: {
    fontSize: 42,
    marginBottom: 16,
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
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },


  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },


  backTextButton: {
    marginTop: 16,
    padding: 10,
  },


  backText: {
    color: "#94A3B8",
  },


  certificateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#1E40AF",
  },


  logoContainer: {
    marginBottom: 14,
  },


  logoText: {
    color: "#1E40AF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 3,
  },


  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#CBD5E1",
    marginBottom: 20,
  },


  trophy: {
    fontSize: 44,
    marginBottom: 10,
  },


  certificateTitle: {
    color: "#0F172A",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 2,
  },


  confirmationText: {
    color: "#64748B",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 16,
  },


  courseContainer: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },


  courseTitle: {
    color: "#1E40AF",
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 27,
  },


  infoSection: {
    alignItems: "center",
    marginTop: 12,
  },


  infoLabel: {
    color: "#94A3B8",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
  },


  infoValue: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },


  numberContainer: {
    width: "100%",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    alignItems: "center",
    padding: 12,
    marginTop: 22,
  },


  numberLabel: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },


  numberValue: {
    color: "#1E40AF",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 5,
  },


  footerLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#CBD5E1",
    marginTop: 22,
  },


  footerText: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 12,
  },


  statusCard: {
    flexDirection: "row",
    backgroundColor: "#052E16",
    borderWidth: 1,
    borderColor: "#166534",
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    alignItems: "center",
  },


  statusIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },


  statusCheck: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },


  statusContent: {
    flex: 1,
  },


  statusTitle: {
    color: "#DCFCE7",
    fontSize: 14,
    fontWeight: "700",
  },


  statusText: {
    color: "#86EFAC",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  pdfButton: {
  backgroundColor: "#2563EB",

  borderRadius: 16,

  paddingVertical: 16,
  paddingHorizontal: 18,

  marginTop: 18,

  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
},

pdfButtonDisabled: {
  opacity: 0.65,
},

pdfIcon: {
  fontSize: 18,
  marginRight: 10,
},

pdfButtonText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "700",
},

});