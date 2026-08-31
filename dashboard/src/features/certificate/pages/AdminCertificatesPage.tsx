import {
  Award,
  CalendarDays,
  Users,
  Trophy,
} from "lucide-react";

import { useAdminCertificates } from "../hooks/useAdminCertificates";

export default function AdminCertificatesPage() {
  const {
    data,
    isLoading,
    isError,
  } = useAdminCertificates();

  if (isLoading) {
    return (
      <div className="p-6">
        Sertifikatlar statistikasi yuklanmoqda...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-red-500">
        Sertifikatlar ma'lumotlarini yuklab bo'lmadi.
      </div>
    );
  }

  const {
    statistics,
    recentCertificates,
    topCourses,
  } = data;

  return (
    <main className="space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Sertifikatlar
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Platformada berilgan sertifikatlar
          va ularning statistikasi.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">
                Jami sertifikatlar
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.totalCertificates}
              </p>
            </div>

            <Award className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">
                Sertifikat olganlar
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.totalRecipients}
              </p>
            </div>

            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">
                Bu oy
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.monthCertificates}
              </p>

              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {statistics.monthRecipients} foydalanuvchi
              </p>
            </div>

            <CalendarDays className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">
                Bu hafta
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.weekCertificates}
              </p>

              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {statistics.weekRecipients} foydalanuvchi
              </p>
            </div>

            <Trophy className="h-8 w-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Today */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-900">
              Bugungi sertifikatlar
            </h2>

            <p className="mt-1 text-sm text-blue-700">
              Bugun {statistics.todayRecipients} ta foydalanuvchiga{" "}
              {statistics.todayCertificates} ta sertifikat berildi.
            </p>
          </div>

          <Award className="h-10 w-10 text-blue-600" />
        </div>
      </div>

      {/* Recent certificates */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-xl font-semibold">
            So'nggi berilgan sertifikatlar
          </h2>

          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Platformada eng so'nggi berilgan 10 ta sertifikat.
          </p>
        </div>

        {recentCertificates.length === 0 ? (
          <div className="p-10 text-center text-[var(--color-muted)]">
            Hozircha sertifikat berilmagan.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {recentCertificates.map(
              (certificate) => (
                <div
                  key={certificate.id}
                  className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="font-semibold">
                      {certificate.user.fullName}
                    </h3>

                    <p className="text-sm text-[var(--color-muted)]">
                      {certificate.user.email}
                    </p>
                  </div>

                  <div className="md:text-center">
                    <p className="font-medium">
                      {certificate.course.title}
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {certificate.certificateNo}
                    </p>
                  </div>

                  <div className="text-sm text-[var(--color-muted)] md:text-right">
                    {new Date(
                      certificate.issuedAt
                    ).toLocaleDateString(
                      "uz-UZ"
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* Top courses */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="border-b border-[var(--color-border)] p-6">
          <h2 className="text-xl font-semibold">
            Eng ko'p sertifikat berilgan kurslar
          </h2>

          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Sertifikatlar soni bo'yicha eng yuqori 5 ta kurs.
          </p>
        </div>

        {topCourses.length === 0 ? (
          <div className="p-10 text-center text-[var(--color-muted)]">
            Hozircha ma'lumot mavjud emas.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {topCourses.map(
              (course, index) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {index + 1}
                    </div>

                    <span className="font-medium">
                      {course.title}
                    </span>
                  </div>

                  <span className="font-semibold">
                    {course.count} ta
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}