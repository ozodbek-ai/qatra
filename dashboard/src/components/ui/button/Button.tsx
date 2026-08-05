import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import type { ButtonProps } from "./button.types";
import { buttonVariants } from "./button.variants";

export function Button({
  children,
  loading,
  leftIcon,
  rightIcon,
  className,
  variant,
  size,
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