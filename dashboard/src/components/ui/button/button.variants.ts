import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-[14px]",
    "font-semibold",
    "transition-all duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[var(--color-ring)]",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "select-none",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] text-white hover:opacity-90",

        secondary:
          "bg-[var(--color-surface)] text-white hover:bg-[var(--color-surface-hover)]",

        outline:
          "border border-[var(--color-border)] bg-transparent text-white hover:bg-[var(--color-surface)]",

        ghost:
          "text-white hover:bg-[var(--color-surface)]",

        danger:
          "bg-[var(--color-danger)] text-white hover:opacity-90",
      },

      size: {
        sm: "h-10 px-4 text-sm",

        md: "h-12 px-6",

        lg: "h-14 px-8 text-lg",

        icon: "h-12 w-12",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);