import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { selectVariants } from "./select.variants";
import type { SelectProps } from "./select.types";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectProps
>(({ className, variant, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        selectVariants({ variant }),
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";