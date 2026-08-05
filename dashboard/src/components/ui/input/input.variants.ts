import { cva } from "class-variance-authority";

export const inputVariants = cva(
  [
    "flex h-12 w-full rounded-[14px]",
    "border",
    "bg-[var(--color-surface)]",
    "px-4",
    "text-sm",
    "text-[var(--color-text)]",
    "placeholder:text-[var(--color-muted)]",
    "transition-all duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[var(--color-ring)]",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default:
          "border-[var(--color-border)]",

        error:
          "border-red-500 focus-visible:ring-red-500",

        success:
          "border-green-500 focus-visible:ring-green-500",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);