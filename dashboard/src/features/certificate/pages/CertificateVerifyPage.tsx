import { useState } from "react";
import { api } from "@/lib/axios";

interface CertificateData {
  id: string;
  certificateNo: string;
  issuedAt: string;
  user: {
    fullName: string;
  };
  course: {
    id: string;
    title: string;
  };
}

export default function CertificateVerifyPage() {
  const [certificateNo, setCertificateNo] =
    useState("");

  const [certificate, setCertificate] =
    useState<CertificateData | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleVerify = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const number =
      certificateNo.trim();

    if (!number) {
      setError(
        "Sertifikat raqamini kiriting."
      );
      setCertificate(null);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setCertificate(null);

      const response =
        await api.get<{
          success: boolean;
          data: CertificateData;
        }>(
          `/certificates/verify/${encodeURIComponent(
            number
          )}`
        );

      setCertificate(
        response.data.data
      );
    } catch (error: any) {
      setError(
        error?.response?.data?.message ??
          "Sertifikat topilmadi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Qatra
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Sertifikatni tekshirish
          </h1>

          <p className="mt-3 text-slate-500">
            Sertifikat raqamini kiriting va
            uning haqiqiyligini tekshiring.
          </p>
        </div>

        <form
          onSubmit={handleVerify}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Sertifikat raqami
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={certificateNo}
              onChange={(e) =>
                setCertificateNo(
                  e.target.value
                )
              }
              placeholder="Masalan: QATRA-..."
              className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "Tekshirilmoqda..."
                : "Tekshirish"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </form>

        {certificate && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm">

            <div className="border-b border-green-100 bg-green-50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-xl text-white">
                  ✓
                </div>

                <div>
                  <h2 className="font-bold text-green-800">
                    Sertifikat haqiqiy
                  </h2>

                  <p className="text-sm text-green-700">
                    Ushbu sertifikat Qatra
                    platformasi tomonidan berilgan.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">

              <div>
                <p className="text-sm text-slate-500">
                  Talaba
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {certificate.user.fullName}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Kurs
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {certificate.course.title}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Sertifikat №
                  </p>

                  <p className="mt-1 break-all font-semibold text-slate-900">
                    {certificate.certificateNo}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Berilgan sana
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {new Date(
                      certificate.issuedAt
                    ).toLocaleDateString()}
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}