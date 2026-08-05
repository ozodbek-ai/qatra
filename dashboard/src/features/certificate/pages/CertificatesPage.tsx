import CertificateCard from "../components/CertificateCard";
import { useCertificates } from "../hooks/useCertificates";

export default function CertificatesPage() {
  const {
    data,
    isLoading,
  } = useCertificates();

  if (isLoading) {
    return <div>Yuklanmoqda...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-10">
      <h1 className="text-3xl font-bold">
        Mening sertifikatlarim
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((certificate) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
          />
        ))}
      </div>
    </div>
  );
}