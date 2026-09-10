import {
  Button,
  Input,
  Select,
  Textarea,
} from "@/components/ui";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/axios";
import { isAxiosError } from "axios";

import type { CourseFormData } from "../types/course-form";
import { useCreateCourse } from "../hooks/useCreateCourse";
import { useUpdateCourse } from "../hooks/useUpdateCourse";

interface CourseFormProps {
  initialData?: Partial<CourseFormData> & {
    id?: string;
  };
}

export default function CourseForm({
  initialData,
}: CourseFormProps) {
  const navigate = useNavigate();

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(
      initialData?.imageUrl ?? null
    );

  const [isUploadingImage, setIsUploadingImage] =
    useState(false);

  const {
    register,
    handleSubmit,
  } = useForm<CourseFormData>({
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      description:
        initialData?.description ?? "",
      imageUrl:
        initialData?.imageUrl ?? "",
      price: initialData?.price ?? 0,
      category:
        initialData?.category ?? "",
      duration:
        initialData?.duration ?? 0,
      level:
        initialData?.level ?? "BEGINNER",
    },
  });

  const createCourse =
    useCreateCourse();

  const updateCourse =
    useUpdateCourse();

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Faqat JPG, PNG yoki WEBP rasm tanlash mumkin."
      );

      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "Rasm hajmi 10 MB dan oshmasligi kerak."
      );

      return;
    }

    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const uploadCourseImage = async (
    file: File
  ) => {
    const formData = new FormData();

    formData.append(
      "image",
      file
    );

    const response =
      await api.post<{
        success: boolean;
        data: {
          url: string;
        };
      }>(
        "/uploads/course/image",
        formData,
        {
          
        }
      );

    return response.data.data.url;
  };

  const onSubmit = async (
    data: CourseFormData
  ) => {
    try {
      let imageUrl =
        data.imageUrl ?? "";

      /*
       * Agar yangi rasm tanlangan bo'lsa,
       * avval Cloudinary'ga yuklaymiz.
       */
      if (imageFile) {
        setIsUploadingImage(true);

        imageUrl =
          await uploadCourseImage(
            imageFile
          );

        setIsUploadingImage(false);
      }

      const courseData = {
        ...data,
        imageUrl,
      };

      /*
       * EDIT
       */
      if (initialData?.id) {
        updateCourse.mutate(
          {
            id: initialData.id,
            data: courseData,
          },
          {
            onSuccess: () => {
              navigate(
                "/admin/courses"
              );
            },
          }
        );

        return;
      }

      /*
       * CREATE
       */
      createCourse.mutate(
        courseData,
        {
          onSuccess: () => {
            navigate(
              "/admin/courses"
            );
          },
        }
      );
    } catch (error: unknown) {
  setIsUploadingImage(false);

  const message = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ??
      "Rasmni yuklashda xatolik yuz berdi."
    : "Rasmni yuklashda xatolik yuz berdi.";

  toast.error(message);
}
  };

  const isSaving =
    createCourse.isPending ||
    updateCourse.isPending ||
    isUploadingImage;

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(
        onSubmit
      )}
    >
      {/* Kurs nomi */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Kurs nomi
        </label>

        <Input
          placeholder="Masalan: Frontend dasturlash"
          {...register("title")}
        />
      </div>

      {/* Slug */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Slug
        </label>

        <Input
          placeholder="frontend-dasturlash"
          {...register("slug")}
        />

        <p className="text-xs text-[var(--color-muted)]">
          Kurs URL manzilida ishlatiladi.
        </p>
      </div>

      {/* Description */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Kurs tavsifi
        </label>

        <Textarea
          placeholder="Kurs haqida qisqacha ma'lumot..."
          rows={6}
          {...register(
            "description"
          )}
        />
      </div>

      {/* Course Image */}

      <div className="space-y-3">
  <label className="text-sm font-medium">
    Kurs rasmi
  </label>

  <label
    htmlFor="course-image"
    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-blue-500 hover:bg-blue-50"
  >
    {imagePreview ? (
      <img
        src={imagePreview}
        alt="Kurs rasmi"
        className="mb-4 aspect-video w-full max-w-xl rounded-xl object-cover"
      />
    ) : (
      <>
        <div className="mb-3 text-4xl">
          🖼️
        </div>

        <p className="font-medium text-slate-700">
          Qurilmadan rasm tanlang
        </p>

        <p className="mt-1 text-xs text-slate-400">
          JPG, PNG yoki WEBP — maksimal 10 MB
        </p>
      </>
    )}

    <span className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
      {imagePreview
        ? "Boshqa rasm tanlash"
        : "Rasm tanlash"}
    </span>

    <input
      id="course-image"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      className="hidden"
      onChange={handleImageChange}
    />
  </label>
</div>

      {/* Price */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Narxi
        </label>

        <Input
          type="number"
          placeholder="Narxi"
          min="0"
          {...register("price", {
            valueAsNumber: true,
          })}
        />
      </div>

      {/* Category */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Kategoriya
        </label>

        <Input
          placeholder="Masalan: Dasturlash"
          {...register(
            "category"
          )}
        />
      </div>

      {/* Duration */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Davomiyligi (soat)
        </label>

        <Input
          type="number"
          placeholder="Davomiyligi"
          min="0"
          {...register(
            "duration",
            {
              valueAsNumber: true,
            }
          )}
        />
      </div>

      {/* Level */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Daraja
        </label>

        <Select
          {...register("level")}
        >
          <option value="BEGINNER">
            Beginner
          </option>

          <option value="INTERMEDIATE">
            Intermediate
          </option>

          <option value="ADVANCED">
            Advanced
          </option>
        </Select>
      </div>

      {/* Submit */}

      <Button
        type="submit"
        loading={isSaving}
        disabled={isSaving}
      >
        {isUploadingImage
          ? "Rasm yuklanmoqda..."
          : initialData?.id
            ? "O'zgarishlarni saqlash"
            : "Kursni saqlash"}
      </Button>
    </form>
  );
}