interface OptionButtonProps {
  text: string;
  selected: boolean;
  multiple: boolean;
  onClick: () => void;
}

export default function OptionButton({
  text,
  selected,
  multiple,
  onClick,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3 text-left transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",

        selected
          ? "border-blue-500 bg-blue-50 text-slate-900 shadow-sm"
          : "border-slate-300 bg-white text-slate-800 hover:border-blue-400 hover:bg-slate-50",
      ].join(" ")}
    >
      {/* Checkbox / Radio */}
      <span
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-all",

          multiple
            ? "rounded"
            : "rounded-full",

          selected
            ? "border-blue-600 bg-blue-600"
            : "border-slate-400 bg-white",
        ].join(" ")}
      >
        {selected && (
          <span className="text-xs font-bold text-white">
            ✓
          </span>
        )}
      </span>

      {/* Variant text */}
      <span
        className={[
          "font-medium",
          selected
            ? "text-blue-900"
            : "text-slate-800",
        ].join(" ")}
      >
        {text}
      </span>
    </button>
  );
}