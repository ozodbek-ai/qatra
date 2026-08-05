import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { inputVariants } from "./input.variants";
import type { InputProps } from "./input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          inputVariants({ variant }),
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";