import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { textareaVariants } from "./textarea.variants";
import type { TextareaProps } from "./textarea.types";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, variant, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        textareaVariants({ variant }),
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";