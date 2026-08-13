import { Button, Input, Select, Textarea } from "@/components/ui";
import { useForm } from "react-hook-form";

import type { CourseFormData } from "../types/course-form";
import { useCreateCourse } from "../hooks/useCreateCourse";
import { useNavigate } from "react-router-dom";
import { useUpdateCourse } from "../hooks/useUpdateCourse";

interface CourseFormProps {
  initialData?: Partial<CourseFormData> & {
    id?: string;
  };
}

export default function CourseForm({
  initialData,
}: CourseFormProps) {
  const {
    register,
    handleSubmit,
  } = useForm<CourseFormData>({
    defaultValues: {
  title: initialData?.title ?? "",
  slug: initialData?.slug ?? "",
  description: initialData?.description ?? "",
  imageUrl: initialData?.imageUrl ?? "",
  price: initialData?.price ?? 0,
  category: initialData?.category ?? "",
  duration: initialData?.duration ?? 0,
  level: initialData?.level ?? "BEGINNER",
},
  });

  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();

const navigate = useNavigate();

const onSubmit = (data: CourseFormData) => {
  if (initialData?.id) {
    updateCourse.mutate(
      {
        id: initialData.id,
        data,
      },
      {
        onSuccess: () => {
          navigate("/admin/courses");
        },
      }
    );

    return;
  }

  createCourse.mutate(data, {
    onSuccess: () => {
      navigate("/admin/courses");
    },
  });
};

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        placeholder="Kurs nomi"
        {...register("title")}
      />

      <Input
        placeholder="Slug"
        {...register("slug")}
      />

      <Textarea
        placeholder="Kurs tavsifi"
        {...register("description")}
      />

      <Input
            placeholder="Image URL"
            {...register("imageUrl")}
        />

      <Input
        type="number"
        placeholder="Narxi"
        {...register("price", {
          valueAsNumber: true,
        })}
      />

      <Input
        placeholder="Kategoriya"
        {...register("category")}
      />

      <Input
        type="number"
        placeholder="Davomiyligi (soat)"
        {...register("duration", {
          valueAsNumber: true,
        })}
      />

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

      <Button
  type="submit"
  loading={
    createCourse.isPending ||
    updateCourse.isPending
  }
>
  {initialData?.id
    ? "O'zgarishlarni saqlash"
    : "Kursni saqlash"}
</Button>
    </form>
  );
}