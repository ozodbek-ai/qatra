import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-[14px]",
    "font-semibold",
    "transition-all duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-blue-500",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "select-none",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-blue-600 text-white hover:bg-blue-700",

        secondary:
          "bg-slate-800 text-white hover:bg-slate-700",

        outline:
          "border border-slate-700 bg-transparent text-white hover:bg-slate-900",

        ghost:
          "text-slate-200 hover:bg-slate-800",

        danger:
          "bg-red-600 text-white hover:bg-red-700",
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;

  leftIcon?: React.ReactNode;

  rightIcon?: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        leftIcon
      )}

      {children}

      {!loading && rightIcon}
    </button>
  );
}