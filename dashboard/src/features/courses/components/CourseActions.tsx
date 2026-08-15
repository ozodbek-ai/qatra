import {
  BookOpen,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui";

type CourseActionsProps = {
  onLessons: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPublish: () => void;
  isPublished: boolean;
  isPublishing?: boolean;
};

export default function CourseActions({
  onLessons,
  onEdit,
  onDelete,
  onPublish,
  isPublished,
  isPublishing = false,
}: CourseActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onLessons}
        title="Darslar"
      >
        <BookOpen size={18} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        title="Tahrirlash"
      >
        <Pencil size={18} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onPublish}
        disabled={isPublishing}
        title={
          isPublished
            ? "Draftga qaytarish"
            : "Nashr qilish"
        }
      >
        {isPublished ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </Button>

      <Button
        variant="danger"
        size="icon"
        onClick={onDelete}
        title="O'chirish"
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
}