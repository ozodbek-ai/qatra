import { useState } from "react";

import {
  Edit,
  Eye,
  EyeOff,
  FileVideo,
  Plus,
  Trash2,
  X,
  Upload,
  FolderOpen,
} from "lucide-react";

import { toast } from "sonner";

import { useAdminReels } from "../hooks/useAdminReels";
import { useCreateReel } from "../hooks/useCreateReel";
import { useUpdateReel } from "../hooks/useUpdateReel";
import { usePublishReel } from "../hooks/usePublishReel";
import { useDeleteReel } from "../hooks/useDeleteReel";
import { useCategories } from "../hooks/useCategories";

import type { Reel } from "../types/reel";

interface FormState {
  title: string;
  description: string;
  video: File | null;
  categoryId: string;
}

const emptyForm: FormState = {
  title: "",
  description: "",
  video: null,
  categoryId: "",
};

export default function AdminReelsPage() {
  const {
    data: reels,
    isLoading,
    isError,
  } = useAdminReels();

  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useCategories();

  const createReel = useCreateReel();
  const updateReel = useUpdateReel();
  const publishReel = usePublishReel();
  const deleteReel = useDeleteReel();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingReel, setEditingReel] =
    useState<Reel | null>(null);

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [videoPreview, setVideoPreview] =
    useState<string | null>(null);

  const isSaving =
    createReel.isPending ||
    updateReel.isPending;

  const resetForm = () => {
  if (videoPreview?.startsWith("blob:")) {
    URL.revokeObjectURL(videoPreview);
  }

  setEditingReel(null);

  setForm({
    ...emptyForm,
  });

  setVideoPreview(null);
};

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (reel: Reel) => {
    setEditingReel(reel);

    setForm({
      title: reel.title,
      description: reel.description ?? "",
      categoryId: reel.categoryId ?? "",
      video: null,
    });

    setVideoPreview(reel.videoUrl);

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);

    resetForm();
  };

  const handleVideoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      toast.error(
        "Faqat video fayl yuklash mumkin."
      );

      event.target.value = "";
      return;
    }

    const maxSize = 200 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "Video hajmi 200 MB dan oshmasligi kerak."
      );

      event.target.value = "";
      return;
    }

    if (videoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreview);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setForm((previous) => ({
      ...previous,
      video: file,
    }));

    setVideoPreview(previewUrl);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const title =
      form.title.trim();

    const description =
      form.description.trim();

    if (!title) {
      toast.error(
        "Reel sarlavhasini kiriting."
      );

      return;
    }

    if (title.length < 3) {
      toast.error(
        "Sarlavha kamida 3 ta belgidan iborat bo'lishi kerak."
      );

      return;
    }

    if (!form.categoryId) {
  toast.error(
    "Reel uchun kategoriya tanlang."
  );

  return;
}

    if (!editingReel && !form.video) {
      toast.error(
        "Reel videosini tanlang."
      );

      return;
    }

    try {
      if (editingReel) {
  await updateReel.mutateAsync({
    id: editingReel.id,

    title,

    description:
      description || undefined,

    categoryId:
      form.categoryId || null,

    video:
      form.video ?? undefined,
  });
} else {
        await createReel.mutateAsync({
          title,

          description:
            description || undefined,

          categoryId:
            form.categoryId || undefined,

          video:
            form.video ?? undefined,

          isPublished: false,
        });
      }

     

      setIsModalOpen(false);
      resetForm();
    } catch {
      // Hook ichida xatolik toast ko'rsatilishi mumkin.
    }
  };

  const handlePublish = (
    reel: Reel
  ) => {
    publishReel.mutate({
      reelId: reel.id,
      isPublished: !reel.isPublished,
    });
  };

  const handleDelete = (
    reel: Reel
  ) => {
    const confirmed = window.confirm(
      `"${reel.title}" Reelini o'chirishni xohlaysizmi?`
    );

    if (!confirmed) {
      return;
    }

    deleteReel.mutate(reel.id);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Reels yuklanmoqda...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Reels yuklanmadi
        </h2>

        <p className="mt-1 text-sm text-red-600">
          Reels ma'lumotlarini olishda xatolik yuz berdi.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text)]">
              Reels
            </h1>

            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Studentlar uchun qisqa videolarni
              yarating va boshqaring.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={20} />

            Reel qo'shish
          </button>
        </div>

        {!reels?.length ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <FileVideo
                size={26}
                className="text-slate-500"
              />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Hozircha Reel mavjud emas
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Studentlar uchun birinchi Reelni qo'shing.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />

              Birinchi Reelni qo'shish
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {reels.map((reel) => (
              <article
                key={reel.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[9/16] max-h-[420px] bg-black">
                  <video
                    src={reel.videoUrl}
                    poster={
                      reel.thumbnailUrl ?? undefined
                    }
                    controls
                    preload="metadata"
                    className="h-full w-full object-contain"
                  />

                  <span
                    className={[
                      "absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white",

                      reel.isPublished
                        ? "bg-green-600"
                        : "bg-slate-700",
                    ].join(" ")}
                  >
                    {reel.isPublished
                      ? "Nashr qilingan"
                      : "Draft"}
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="line-clamp-1 text-lg font-semibold text-slate-900">
                      {reel.title}
                    </h2>

                    {reel.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {reel.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FolderOpen size={16} />

                    <span>
                      {reel.category?.name ??
                        "Kategoriya tanlanmagan"}
                    </span>
                  </div>

                  <div className="flex gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(reel)
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Edit size={16} />

                      Tahrirlash
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handlePublish(reel)
                      }
                      disabled={
                        publishReel.isPending
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
                    >
                      {reel.isPublished ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(reel)
                      }
                      disabled={
                        deleteReel.isPending
                      }
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingReel
                    ? "Reelni tahrirlash"
                    : "Yangi Reel qo'shish"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Reel videosi va ma'lumotlarini kiriting.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Sarlavha
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Masalan: Psixologik qiziqarli fakt"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Kategoriya
                </label>

                <select
                  value={form.categoryId}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      categoryId: event.target.value,
                    }))
                  }
                  disabled={categoriesLoading}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                >
                  <option value="">
                    Kategoriya tanlang
                  </option>

                  {categories?.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tavsif
                </label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      description:
                        event.target.value,
                    }))
                  }
                  placeholder="Reel haqida qisqacha ma'lumot..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Video
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-6 transition hover:border-blue-400 hover:bg-blue-50">
                  <Upload
                    size={28}
                    className="text-slate-400"
                  />

                  <span className="mt-2 text-sm font-medium text-slate-700">
                    Video tanlash uchun bosing
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    MP4, MOV, WebM
                  </span>

                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>
              </div>

              {videoPreview && (
                <div className="overflow-hidden rounded-xl bg-black">
                  <video
                    src={videoPreview}
                    controls
                    className="max-h-[400px] w-full"
                  />
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Bekor qilish
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving
                    ? "Saqlanmoqda..."
                    : editingReel
                      ? "O'zgarishlarni saqlash"
                      : "Reel yaratish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}