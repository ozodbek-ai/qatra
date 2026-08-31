import {
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

import {
  useState,
} from "react";

import type { Reel } from "../types/reel";

import { useToggleReelLike } from "../hooks/useToggleReelLike";

import ShareReelModal from "./ShareReelModal";

interface Props {
  reel: Reel;

  onComments?: () => void;

  onShareToChat?: () => void;
}


export default function ReelActions({
  reel,
  onComments,
}: Props) {
  const toggleLike =
    useToggleReelLike();

  const [
    showShareModal,
    setShowShareModal,
  ] = useState(false);

  const handleLike = () => {
    if (toggleLike.isPending) {
      return;
    }

    toggleLike.mutate(
      reel.id
    );
  };

  return (
    <>
      <div className="absolute bottom-24 right-4 z-20 flex flex-col items-center gap-5 text-white">

        {/* LIKE */}

        <button
          type="button"
          onClick={handleLike}
          disabled={
            toggleLike.isPending
          }
          aria-label={
            reel.likedByMe
              ? "Like'ni olib tashlash"
              : "Like bosish"
          }
          className="flex flex-col items-center gap-1 transition-transform duration-150 active:scale-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="rounded-full bg-black/30 p-2 backdrop-blur-sm">
            <Heart
              className={`h-7 w-7 transition-colors ${
                reel.likedByMe
                  ? "fill-red-500 text-red-500"
                  : "text-white"
              }`}
            />
          </div>

          <span className="text-xs font-semibold">
            {reel.likeCount}
          </span>
        </button>

        {/* COMMENTS */}

        <button
          type="button"
          onClick={onComments}
          disabled={!onComments}
          aria-label="Izohlarni ko'rish"
          className="flex flex-col items-center gap-1 transition-transform duration-150 active:scale-90"
        >
          <div className="rounded-full bg-black/30 p-2 backdrop-blur-sm">
            <MessageCircle className="h-7 w-7" />
          </div>

          <span className="text-xs font-semibold">
            {reel.commentCount}
          </span>
        </button>

        {/* SHARE */}

        <button
          type="button"
          onClick={() =>
            setShowShareModal(true)
          }
          aria-label="Reelni ulashish"
          className="flex flex-col items-center gap-1 transition-transform duration-150 active:scale-90"
        >
          <div className="rounded-full bg-black/30 p-2 backdrop-blur-sm">
            <Share2 className="h-7 w-7" />
          </div>

          <span className="text-xs font-semibold">
            Ulashish
          </span>
        </button>
      </div>

      <ShareReelModal
        reel={reel}
        open={showShareModal}
        onClose={() =>
          setShowShareModal(false)
        }
      />
    </>
  );
}