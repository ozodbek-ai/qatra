import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";

import { useCertificates } from "../hooks/useCertificates";
import { useDownloadCertificate } from "../hooks/useDownloadCertificate";

export default function CertificatesPage() {
  const {
    data: certificates,
    isLoading,
    isError,
  } = useCertificates();

  const downloadMutation =
    useDownloadCertificate();

  if (isLoading) {
    return (
      <div className="p-6">
        Sertifikatlar yuklanmoqda...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Sertifikatlarni yuklab bo'lmadi.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Sertifikatlarim
        </h1>

        <p className="mt-1 text-[var(--color-muted)]">
          Muvaffaqiyatli yakunlagan kurslaringiz uchun
          sertifikatlar.
        </p>
      </div>

      {certificates?.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-[var(--color-muted)]">
              Hozircha sizda sertifikat mavjud emas.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {certificates?.map(
          (certificate) => (
            <Card key={certificate.id}>
              <CardHeader>
                <CardTitle>
                  {certificate.course.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-[var(--color-muted)]">
                    Sertifikat raqami
                  </p>

                  <p className="font-semibold">
                    {certificate.certificateNo}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[var(--color-muted)]">
                    Berilgan sana
                  </p>

                  <p className="font-medium">
                    {new Date(
                      certificate.issuedAt
                    ).toLocaleDateString(
                      "uz-UZ"
                    )}
                  </p>
                </div>

                <Button
                  type="button"
                  className="w-full"
                  loading={
                    downloadMutation.isPending
                  }
                  onClick={() =>
                    downloadMutation.mutate({
                      certificateId:
                        certificate.id,
                      certificateNo:
                        certificate.certificateNo,
                    })
                  }
                >
                  Sertifikatni yuklab olish
                </Button>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}