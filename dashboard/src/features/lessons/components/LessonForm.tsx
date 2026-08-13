import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  Button,
  Input,
  Textarea,
} from "@/components/ui";

import { useCreateLesson } from "../hooks/useCreateLesson";
import { useUpdateLesson } from "../hooks/useUpdateLesson";

import type { Lesson } from "../types/lesson";
import type { LessonFormData } from "../types/lesson-form";

type LessonFormProps = {
  initialData?: Lesson;
};

export default function LessonForm({
  initialData,
}: LessonFormProps) {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<LessonFormData>({
    defaultValues: {
      courseId: courseId ?? "",
      title: "",
      description: "",
      duration: 0,
      order: 1,
      isPreview: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        courseId: initialData.courseId,
        title: initialData.title,
        description: initialData.description ?? "",
        duration: initialData.duration,
        order: initialData.order,
        isPreview: initialData.isPreview,
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: LessonFormData) => {
    if (initialData) {
      updateLesson.mutate(
        {
          id: initialData.id,
          data,
        },
        {
          onSuccess() {
            navigate(
              `/admin/courses/${courseId}/lessons`
            );
          },
        }
      );

      return;
    }

    createLesson.mutate(data, {
      onSuccess() {
        navigate(
          `/admin/courses/${courseId}/lessons`
        );
      },
    });
  };

  const isPending =
    createLesson.isPending ||
    updateLesson.isPending;

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        placeholder="Dars nomi"
        {...register("title")}
      />

      <Textarea
        placeholder="Tavsif"
        {...register("description")}
      />

      <Input
        type="number"
        placeholder="Davomiyligi (minut)"
        {...register("duration", {
          valueAsNumber: true,
        })}
      />

      <Input
        type="number"
        placeholder="Tartib raqami"
        {...register("order", {
          valueAsNumber: true,
        })}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("isPreview")}
        />

        <span>
          Bepul preview dars
        </span>
      </label>

      <Input
        type="file"
        accept="video/*"
        {...register("video")}
      />

      <Button
        type="submit"
        loading={isPending}
      >
        {initialData
          ? "Darsni yangilash"
          : "Darsni saqlash"}
      </Button>
    </form>
  );
}