import {
  BookOpen,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui";

type CourseActionsProps = {
  onLessons: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CourseActions({
  onLessons,
  onEdit,
  onDelete,
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