import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  Button,
  Input,
  Textarea,
} from "@/components/ui";

import { useCreateQuiz } from "../hooks/useCreateQuiz";

interface QuizFormData {
  title: string;
  description: string;
  passPercentage: number;
}

export default function CreateQuizPage() {
  const { courseId, lessonId } = useParams();

  const navigate = useNavigate();

  const createQuiz = useCreateQuiz();

  const {
    register,
    handleSubmit,
  } = useForm<QuizFormData>({
    defaultValues: {
      title: "",
      description: "",
      passPercentage: 70,
    },
  });

  const onSubmit = (data: QuizFormData) => {
    if (!lessonId || !courseId) {
      return;
    }

    createQuiz.mutate(
  {
    lessonId,
    title: data.title.trim(),
    description:
      data.description.trim() || undefined,
    passPercentage: data.passPercentage,
  },
  {
    onSuccess(quiz) {
      navigate(
        `/admin/courses/${courseId}/lessons/${lessonId}/quiz/${quiz.id}`
      );
    },
  }
);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Quiz yaratish
        </h1>

        <p className="text-[var(--color-muted)]">
          Ushbu dars uchun yangi quiz yarating.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl space-y-6"
      >
        <Input
          placeholder="Quiz nomi"
          {...register("title", {
            required: true,
          })}
        />

        <Textarea
          placeholder="Quiz tavsifi"
          {...register("description")}
        />

        <Input
          type="number"
          min={1}
          max={100}
          placeholder="O'tish foizi"
          {...register("passPercentage", {
            valueAsNumber: true,
            required: true,
            min: 1,
            max: 100,
          })}
        />

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate(
                `/admin/courses/${courseId}/lessons`
              )
            }
          >
            Bekor qilish
          </Button>

          <Button
            type="submit"
            loading={createQuiz.isPending}
          >
            Quizni saqlash
          </Button>
        </div>
      </form>
    </div>
  );
}