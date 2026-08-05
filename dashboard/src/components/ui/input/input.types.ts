import type { InputHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

import { inputVariants } from "./input.variants";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}