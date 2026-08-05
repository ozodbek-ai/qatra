import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import type { Certificate } from "../types/certificate";

interface Props {
  certificate: Certificate;
}

export default function CertificateCard({
  certificate,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {certificate.course.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p>
          Sertifikat №{" "}
          <strong>
            {certificate.certificateNo}
          </strong>
        </p>

        <p>
          Berilgan sana:{" "}
          {new Date(
            certificate.issuedAt
          ).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}