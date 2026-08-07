import { Search, Plus } from "lucide-react";

import { Button, Input } from "@/components/ui";

type CoursesToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
};

export default function CoursesToolbar({
  search,
  onSearchChange,
  onCreate,
}: CoursesToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          size={18}
        />

        <Input
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="Kurs qidirish..."
          className="pl-10"
        />
      </div>

      <Button
        leftIcon={<Plus size={18} />}
        onClick={onCreate}
      >
        Kurs yaratish
      </Button>
    </div>
  );
}