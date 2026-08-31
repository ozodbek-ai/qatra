import { useState } from "react";

import ReelActions from "./ReelActions";
import type { Reel } from "../types/reel";

interface Props {
  reel: Reel;

  onComments?: () => void;

  onShareToChat?: (
    reel: Reel
  ) => void;
}

export default function ReelCard({
  reel,
  onComments,
  onShareToChat,
}: Props) {
  const [isPlaying, setIsPlaying] =
    useState(true);

  const handleVideoClick = (
    event: React.MouseEvent<HTMLVideoElement>
  ) => {
    const video = event.currentTarget;

    if (video.paused) {
      void video.play();

      setIsPlaying(true);
    } else {
      video.pause();

      setIsPlaying(false);
    }
  };

  return (
    <article className="relative h-[calc(100vh-64px)] w-full snap-start overflow-hidden bg-black">
      <video
        src={reel.videoUrl}
        poster={
          reel.thumbnailUrl ??
          undefined
        }
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        onClick={handleVideoClick}
        className="h-full w-full object-contain"
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6">
        <div className="max-w-[75%]">
          <h2 className="text-xl font-bold text-white">
            {reel.title}
          </h2>

          {reel.description && (
            <p className="mt-2 line-clamp-3 text-sm text-white/90">
              {reel.description}
            </p>
          )}
        </div>
      </div>

      <ReelActions
        reel={reel}
        onComments={onComments}
        onShareToChat={() => {
          onShareToChat?.(reel);
        }}
      />

      {!isPlaying && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/50 p-5">
            <span className="text-3xl text-white">
              ▶
            </span>
          </div>
        </div>
      )}
    </article>
  );
}