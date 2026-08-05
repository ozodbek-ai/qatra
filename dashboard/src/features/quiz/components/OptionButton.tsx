import { Button } from "@/components/ui";

interface Props {
  text: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionButton({
  text,
  selected,
  onClick,
}: Props) {
  return (
    <Button
      type="button"
      variant={selected ? "primary" : "outline"}
      className="w-full justify-start"
      onClick={onClick}
    >
      {text}
    </Button>
  );
}