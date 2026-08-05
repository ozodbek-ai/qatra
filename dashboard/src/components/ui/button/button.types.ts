import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "./button.variants";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}