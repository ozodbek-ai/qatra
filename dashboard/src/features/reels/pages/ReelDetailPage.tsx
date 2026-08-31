import {
  ArrowLeft,
  Loader2,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ReelCard from "../components/ReelCard";
import { useReel } from "../hooks/useReel";

export default function ReelDetailPage() {
  const navigate = useNavigate();

  const { reelId } = useParams();

  const {
    data: reel,
    isLoading,
    isError,
  } = useReel(
    reelId ?? ""
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (isError || !reel) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <h1 className="text-2xl font-bold">
          Reel topilmadi
        </h1>

        <p className="text-sm text-white/70">
          Bu Reel o'chirilgan yoki mavjud emas.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/reels")
          }
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white"
        >
          Reels sahifasiga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      <button
        type="button"
        onClick={() =>
          navigate("/reels")
        }
        className="absolute left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
        aria-label="Orqaga qaytish"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <ReelCard
        reel={reel}
        onComments={() => {}}
      />
    </div>
  );
}