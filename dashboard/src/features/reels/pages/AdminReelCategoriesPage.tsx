import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Edit,
  FolderPlus,
  ImagePlus,
  Layers3,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { toast } from "sonner";

import type {
  ReelCategory,
} from "../types/category";

import {
  useCategories,
} from "../hooks/useCategories";

import {
  useCreateCategory,
} from "../hooks/useCreateCategory";

import {
  useUpdateCategory,
} from "../hooks/useUpdateCategory";

import {
  useDeleteCategory,
} from "../hooks/useDeleteCategory";


interface FormState {
  name: string;
  slug: string;
  description: string;
  image: File | null;
}


const emptyForm: FormState = {
  name: "",
  slug: "",
  description: "",
  image: null,
};


function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}


export default function AdminReelCategoriesPage() {
  const {
    data: categories,
    isLoading,
    isError,
  } = useCategories();

  const createCategory =
    useCreateCategory();

  const updateCategory =
    useUpdateCategory();

  const deleteCategory =
    useDeleteCategory();


  const fileInputRef =
    useRef<HTMLInputElement>(null);


  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState<ReelCategory | null>(null);

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);


  const isSaving =
    createCategory.isPending ||
    updateCategory.isPending;


  const totalReels = useMemo(() => {
    return (
      categories?.reduce(
        (total, category) =>
          total +
          (category._count?.reels ?? 0),
        0
      ) ?? 0
    );
  }, [categories]);


  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);


  const resetForm = () => {
    setForm(emptyForm);

    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const openCreateModal = () => {
    setEditingCategory(null);

    resetForm();

    setIsModalOpen(true);
  };


  const openEditModal = (
    category: ReelCategory
  ) => {
    setEditingCategory(category);

    setForm({
      name: category.name,
      slug: category.slug,
      description:
        category.description ?? "",
      image: null,
    });

    setImagePreview(
      category.imageUrl ?? null
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsModalOpen(true);
  };


  const closeModal = () => {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);

    setEditingCategory(null);

    resetForm();
  };


  const handleNameChange = (
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      name: value,

      slug: editingCategory
        ? current.slug
        : createSlug(value),
    }));
  };


  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Faqat rasm faylini tanlang."
      );

      event.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Rasm hajmi 5 MB dan oshmasligi kerak."
      );

      event.target.value = "";

      return;
    }

    const preview =
      URL.createObjectURL(file);

    setForm((current) => ({
      ...current,
      image: file,
    }));

    setImagePreview(preview);
  };


  const removeSelectedImage = () => {
    setForm((current) => ({
      ...current,
      image: null,
    }));

    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(
      editingCategory?.imageUrl ?? null
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const name =
      form.name.trim();

    const slug =
      createSlug(form.slug);

    const description =
      form.description.trim();


    if (!name) {
      toast.error(
        "Kategoriya nomini kiriting."
      );

      return;
    }


    if (!slug) {
      toast.error(
        "Kategoriya slugini kiriting."
      );

      return;
    }


    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,

          name,

          slug,

          description:
            description || undefined,

          image:
            form.image ?? undefined,
        });
      } else {
        await createCategory.mutateAsync({
          name,

          slug,

          description:
            description || undefined,

          image:
            form.image ?? undefined,
        });
      }

      closeModal();
    } catch {
      // Toast hook ichida chiqariladi.
    }
  };


  const handleDelete = (
    category: ReelCategory
  ) => {
    const confirmed =
      window.confirm(
        `"${category.name}" kategoriyasini o'chirmoqchimisiz?`
      );

    if (!confirmed) {
      return;
    }

    deleteCategory.mutate(category.id);
  };


  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Loader2
            size={20}
            className="animate-spin"
          />

          Kategoriyalar yuklanmoqda...
        </div>
      </div>
    );
  }


  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Kategoriyalar yuklanmadi
        </h2>

        <p className="mt-1 text-sm text-red-600">
          Ma'lumotlarni olishda xatolik yuz berdi.
        </p>
      </div>
    );
  }


  return (
    <>
      <section className="space-y-6">

        {/* Header */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Layers3 size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text)]">
                Reel kategoriyalari
              </h1>

              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Mavzulashtirilgan reels
                bo'limlarini boshqaring.
              </p>
            </div>

          </div>


          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={20} />

            Kategoriya qo'shish
          </button>

        </div>


        {/* Statistics */}

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Jami kategoriyalar
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {categories?.length ?? 0}
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Jami reels
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalReels}
            </p>

          </div>

        </div>


        {/* Empty state */}

        {!categories?.length ? (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <FolderPlus size={26} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Hozircha kategoriya mavjud emas
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Psychology, History va boshqa
              mavzular uchun kategoriya yarating.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={18} />

              Birinchi kategoriyani yaratish
            </button>

          </div>

        ) : (

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {categories.map((category) => (

              <article
                key={category.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* Category image */}

                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">

                  {category.imageUrl ? (

                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                  ) : (

                    <div className="flex h-full w-full items-center justify-center text-slate-400">

                      <div className="flex flex-col items-center gap-2">
                        <ImagePlus size={32} />

                        <span className="text-sm">
                          Rasm mavjud emas
                        </span>
                      </div>

                    </div>

                  )}


                  <div className="absolute right-3 top-3 flex gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(category)
                      }
                      className="rounded-xl bg-white/90 p-2 text-slate-600 shadow-sm backdrop-blur transition hover:text-blue-600"
                      title="Tahrirlash"
                    >
                      <Edit size={18} />
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(category)
                      }
                      disabled={
                        deleteCategory.isPending
                      }
                      className="rounded-xl bg-white/90 p-2 text-slate-600 shadow-sm backdrop-blur transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      title="O'chirish"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>


                {/* Content */}

                <div className="p-6">

                  <h2 className="text-xl font-bold text-slate-900">
                    {category.name}
                  </h2>


                  <p className="mt-1 text-sm font-medium text-blue-600">
                    /{category.slug}
                  </p>


                  <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-500">
                    {category.description ||
                      "Kategoriya uchun tavsif kiritilmagan."}
                  </p>


                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                    <div>
                      <p className="text-xs text-slate-500">
                        Reels soni
                      </p>

                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {category._count?.reels ?? 0}
                      </p>
                    </div>


                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Layers3 size={20} />
                    </div>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>


      {/* Modal */}

      {isModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">

          <button
            type="button"
            onClick={closeModal}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Modalni yopish"
          />


          <div className="relative z-10 my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            {/* Modal header */}

            <div className="flex items-start justify-between gap-4">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  {editingCategory
                    ? "Kategoriyani tahrirlash"
                    : "Yangi kategoriya"}

                </h2>


                <p className="mt-1 text-sm text-slate-500">

                  {editingCategory
                    ? "Kategoriya ma'lumotlarini yangilang."
                    : "Yangi mavzulashtirilgan bo'lim yarating."}

                </p>

              </div>


              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>


            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              {/* Image upload */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Kategoriya rasmi
                </label>


                <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">

                  {imagePreview ? (

                    <div className="relative aspect-[16/9]">

                      <img
                        src={imagePreview}
                        alt="Kategoriya preview"
                        className="h-full w-full object-cover"
                      />


                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        className="absolute right-3 top-3 rounded-lg bg-black/70 p-2 text-white transition hover:bg-black"
                        title="Tanlangan rasmni bekor qilish"
                      >
                        <X size={18} />
                      </button>

                    </div>

                  ) : (

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 text-slate-500 transition hover:bg-slate-100"
                    >

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                        <Upload size={22} />
                      </div>

                      <div className="text-center">

                        <p className="font-medium text-slate-700">
                          Rasm yuklash
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          PNG, JPG yoki WEBP · Maksimum 5 MB
                        </p>

                      </div>

                    </button>

                  )}

                </div>


                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />


                {imagePreview && (

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Boshqa rasm tanlash
                  </button>

                )}

              </div>


              {/* Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Kategoriya nomi
                </label>

                <input
                  value={form.name}
                  onChange={(event) =>
                    handleNameChange(
                      event.target.value
                    )
                  }
                  placeholder="Masalan: Psychology"
                  disabled={isSaving}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
                />

              </div>


              {/* Slug */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Slug
                </label>

                <input
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      slug: createSlug(
                        event.target.value
                      ),
                    }))
                  }
                  placeholder="psychology"
                  disabled={isSaving}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
                />

                <p className="mt-2 text-xs text-slate-500">
                  URL: /courses/category/
                  {form.slug || "psychology"}
                </p>

              </div>


              {/* Description */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tavsif
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description:
                        event.target.value,
                    }))
                  }
                  placeholder="Kategoriya haqida qisqacha ma'lumot..."
                  rows={4}
                  disabled={isSaving}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
                />

              </div>


              {/* Actions */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Bekor qilish
                </button>


                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >

                  {isSaving && (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  )}


                  {isSaving
                    ? "Saqlanmoqda..."
                    : editingCategory
                      ? "Yangilash"
                      : "Kategoriya yaratish"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </>
  );
}