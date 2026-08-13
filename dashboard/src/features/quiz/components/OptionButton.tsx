import { Button } from "@/components/ui";

interface Props {
  text: string;
  selected: boolean;
  onClick: () => void;
  multiple?: boolean;
}

export default function OptionButton({
  text,
  selected,
  onClick,
  multiple = false,
}: Props) {
  return (
    <Button
      type="button"
      variant={
        selected
          ? "primary"
          : "outline"
      }
      className="w-full justify-start gap-3"
      onClick={onClick}
    >
      <span
        className={
          multiple
            ? "flex h-5 w-5 items-center justify-center rounded border text-xs"
            : "flex h-5 w-5 items-center justify-center rounded-full border text-xs"
        }
      >
        {selected ? "✓" : ""}
      </span>

      {text}
    </Button>
  );
}