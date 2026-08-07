import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui";

type CourseActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function CourseActions({
  onEdit,
  onDelete,
}: CourseActionsProps) {
  return (
    <div className="flex items-center gap-2">
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