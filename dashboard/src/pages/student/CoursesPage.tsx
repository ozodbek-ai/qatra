import {
  ArrowRight,
  BookOpen,
  Brain,
  Clapperboard,
  Globe2,
  Landmark,
  Microscope,
  Palette,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useCategories } from
  "@/features/reels/hooks/useCategories";

import type {
  ReelCategory,
} from "@/features/reels/types/category";

const categoryIcons: Record<
  string,
  React.ElementType
> = {
  psychology: Brain,
  history: Landmark,
  science: Microscope,
  art: Palette,
  geography: Globe2,
};

const categoryStyles: Record<
  string,
  {
    icon: string;
    background: string;
  }
> = {
  psychology: {
    icon: "bg-violet-100 text-violet-600",
    background:
      "from-violet-50 to-white",
  },

  history: {
    icon: "bg-amber-100 text-amber-600",
    background:
      "from-amber-50 to-white",
  },

  science: {
    icon: "bg-cyan-100 text-cyan-600",
    background:
      "from-cyan-50 to-white",
  },

  art: {
    icon: "bg-pink-100 text-pink-600",
    background:
      "from-pink-50 to-white",
  },

  geography: {
    icon: "bg-emerald-100 text-emerald-600",
    background:
      "from-emerald-50 to-white",
  },
};

function getCategoryIcon(
  category: ReelCategory
) {
  return (
    categoryIcons[
      category.slug.toLowerCase()
    ] ?? BookOpen
  );
}

function getCategoryStyle(
  category: ReelCategory
) {
  return (
    categoryStyles[
      category.slug.toLowerCase()
    ] ?? {
      icon:
        "bg-blue-100 text-blue-600",
      background:
        "from-blue-50 to-white",
    }
  );
}

export default function StudentCoursesPage() {
  const navigate = useNavigate();

  const categories =
    useCategories();

  if (categories.isLoading) {
    return (
      <main className="min-h-full p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

          <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded-lg bg-slate-100" />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-3xl bg-slate-200"
                />
              )
            )}
          </div>

        </div>
      </main>
    );
  }

  if (categories.isError) {
    return (
      <main className="min-h-full p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">

            <h2 className="text-lg font-bold text-red-700">
              Mavzularni yuklab bo'lmadi
            </h2>

            <p className="mt-2 text-sm text-red-600">
              Internet yoki server bilan
              bog'lanishda muammo yuz berdi.
            </p>

            <button
              type="button"
              onClick={() =>
                categories.refetch()
              }
              className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Qayta urinish
            </button>

          </div>

        </div>
      </main>
    );
  }

  const data =
    categories.data ?? [];

  return (
    <main className="min-h-full bg-slate-50">

      <div className="mx-auto max-w-7xl p-6 lg:p-8">

        {/* HEADER */}

        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10">

          <div className="relative z-10 max-w-2xl">

            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-blue-200 backdrop-blur-sm">
              <Sparkles size={16} />

              Tezkor ta'lim
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Mavzulashtirilgan darslar
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
              Qisqa reels formatidagi darslar
              orqali yangi bilimlarni tez va
              qulay o'rganing.
            </p>

          </div>

          <div className="absolute -right-10 -top-10 opacity-10">
            <Clapperboard size={260} />
          </div>

        </div>

        {/* SECTION HEADER */}

        <div className="mt-10 flex items-end justify-between gap-4">

          <div>
            <div className="flex items-center gap-2 text-blue-600">
              <Clapperboard size={18} />

              <span className="text-sm font-semibold">
                Mavzular
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              O'zingizga qiziq mavzuni tanlang
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Har bir mavzu ichida qisqa va
              foydali reel darslar mavjud.
            </p>
          </div>

          <div className="hidden rounded-xl bg-white px-4 py-2 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200 sm:block">
            {data.length} ta mavzu
          </div>

        </div>

        {/* EMPTY */}

        {!data.length ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <Clapperboard
              size={48}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Hozircha mavzular mavjud emas
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Administratorlar yangi
              mavzulashtirilgan reel darslarni
              qo'shgandan keyin ular shu yerda
              ko'rinadi.
            </p>

          </div>
        ) : (

          /* CATEGORY GRID */

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

            {data.map((category) => {
              const Icon =
                getCategoryIcon(category);

              const style =
                getCategoryStyle(category);

              const reelCount =
                category._count?.reels ?? 0;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/courses/category/${category.slug}`
                    )
                  }
                  className={[
                    "group relative overflow-hidden rounded-3xl",
                    "border border-slate-200 bg-gradient-to-br",
                    style.background,
                    "p-6 text-left shadow-sm transition-all duration-300",
                    "hover:-translate-y-1 hover:shadow-xl",
                    "focus:outline-none focus:ring-2",
                    "focus:ring-blue-500 focus:ring-offset-2",
                  ].join(" ")}
                >

                  <div className="flex items-start justify-between gap-4">

                    <div
                      className={[
                        "flex h-14 w-14 items-center justify-center",
                        "rounded-2xl",
                        style.icon,
                      ].join(" ")}
                    >
                      <Icon size={28} />
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white">
                      <ArrowRight
                        size={19}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </div>

                  </div>

                  <div className="mt-8">

                    <h3 className="text-xl font-bold text-slate-900">
                      {category.name}
                    </h3>

                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                      {category.description ||
                        "Ushbu mavzu bo'yicha qisqa va foydali reel darslarni tomosha qiling."}
                    </p>

                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t border-slate-200/70 pt-5">

                    <Clapperboard
                      size={17}
                      className="text-blue-600"
                    />

                    <span className="text-sm font-semibold text-slate-700">
                      {reelCount} ta reel dars
                    </span>

                  </div>

                </button>
              );
            })}

          </div>
        )}

      </div>

    </main>
  );
}