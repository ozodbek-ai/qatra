import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";

import { useDownloadCertificate } from "../hooks/useDownloadCertificate";

import type { Certificate } from "../types/certificate";

interface Props {
  certificate: Certificate;
}

export default function CertificateCard({
  certificate,
}: Props) {
  const downloadMutation =
    useDownloadCertificate();

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">
              QATRA
            </p>

            <CardTitle className="mt-1">
              {certificate.course.title}
            </CardTitle>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg text-green-600">
            ✓
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div>
          <p className="text-sm text-slate-500">
            Sertifikat №
          </p>

          <p className="mt-1 break-all font-semibold text-slate-900">
            {certificate.certificateNo}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Berilgan sana
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {new Date(
              certificate.issuedAt
            ).toLocaleDateString("uz-UZ")}
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
  );
}