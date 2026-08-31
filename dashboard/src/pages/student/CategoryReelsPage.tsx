import {
  ArrowLeft,
  Clapperboard,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ReelCard from
  "@/features/reels/components/ReelCard";

import { useCategoryReels } from
  "@/features/reels/hooks/useCategoryReels";

export default function CategoryReelsPage() {
  const navigate = useNavigate();

  const { slug } = useParams();

  const categoryReels =
    useCategoryReels(slug);

  if (categoryReels.isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200" />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="aspect-[9/16] animate-pulse rounded-3xl bg-slate-200"
              />
            )
          )}
        </div>
      </div>
    );
  }

  if (
    categoryReels.isError ||
    !categoryReels.data
  ) {
    return (
      <div className="p-6 lg:p-8">
        <button
          type="button"
          onClick={() =>
            navigate("/courses")
          }
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600"
        >
          <ArrowLeft size={18} />

          Mavzularga qaytish
        </button>

        <div className="mt-8 rounded-3xl bg-red-50 p-8 text-red-700">
          Mavzu yoki reels topilmadi.
        </div>
      </div>
    );
  }

  const {
    category,
    reels,
  } = categoryReels.data;

  return (
    <div className="min-h-full p-6 lg:p-8">

      {/* BACK */}

      <button
        type="button"
        onClick={() =>
          navigate("/courses")
        }
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
      >
        <ArrowLeft size={18} />

        Mavzularga qaytish
      </button>

      {/* HEADER */}

      <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            <Clapperboard size={16} />

            Micro Learning
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            {category.name}
          </h1>

          {category.description && (
            <p className="mt-2 max-w-2xl text-slate-500">
              {category.description}
            </p>
          )}
        </div>

        <div className="text-sm text-slate-500">
          {reels.length} ta reel dars
        </div>

      </div>

      {/* EMPTY */}

      {!reels.length ? (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <Clapperboard
            className="mx-auto text-slate-300"
            size={48}
          />

          <h2 className="mt-4 font-bold text-slate-900">
            Hozircha reels mavjud emas
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Bu mavzu uchun hali darslar
            qo'shilmagan.
          </p>

        </div>
      ) : (

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {reels.map((reel) => (
            <ReelCard
  key={reel.id}
  reel={reel}
  onComments={() => {}}
/>
          ))}

        </div>
      )}

    </div>
  );
}