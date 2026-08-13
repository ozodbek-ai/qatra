import type { SelectHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

import { selectVariants } from "./select.variants";

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {}