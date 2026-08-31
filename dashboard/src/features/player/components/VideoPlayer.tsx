import type { SyntheticEvent } from "react";
interface Props {
  title: string;
  videoUrl?: string | null;

  activityId?: string | null;

  onDurationUpdate?: (
    activityId: string,
    durationSeconds: number
  ) => void;

  onEnded?: () => void;
}

export default function VideoPlayer({
  title,
  videoUrl,
  activityId,
  onDurationUpdate,
  onEnded,
}: Props) {
  if (!videoUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-black text-white">
        Video mavjud emas
      </div>
    );
  }

  const handleTimeUpdate = (
    event: SyntheticEvent<HTMLVideoElement>
  ) => {
    if (
      !activityId ||
      !onDurationUpdate
    ) {
      return;
    }

    const video =
      event.currentTarget;

    const duration =
      Number.isFinite(video.duration)
        ? Math.floor(video.duration)
        : 0;

    if (duration <= 0) {
      return;
    }

    onDurationUpdate(
      activityId,
      duration
    );
  };

  return (
    <div className="space-y-4">
      <video
        controls
        controlsList="nodownload"
        className="aspect-video w-full rounded-xl bg-black"
        onTimeUpdate={
          handleTimeUpdate
        }
        onEnded={onEnded}
      >
        <source
          src={videoUrl}
          type="video/mp4"
        />

        Brauzeringiz video formatini qo'llab-quvvatlamaydi.
      </video>

      <h2 className="text-2xl font-bold">
        {title}
      </h2>
    </div>
  );
}