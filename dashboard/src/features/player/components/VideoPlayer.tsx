interface Props {
  title: string;
  videoUrl?: string | null;
}

export default function VideoPlayer({
  title,
  videoUrl,
}: Props) {
  if (!videoUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-black text-white">
        Video mavjud emas
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <video
        controls
        controlsList="nodownload"
        className="aspect-video w-full rounded-xl bg-black"
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