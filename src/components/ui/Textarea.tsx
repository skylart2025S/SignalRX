import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const textareaVariants = cva(
  "flex min-h-[zwrap] w-full rounded-border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:px-0 file:py-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
}

export function Textarea(
  { className, size, ...props }: TextareaProps
) {
  return (
    <textarea
      className={clsx(textareaVariants({ size }), className, "text-gray-900")}
      {...props}
    />
  );
}
Textarea.displayName = "Textarea";
