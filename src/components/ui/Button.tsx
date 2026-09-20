import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-']):pointer-events-none] [&_svg:not([class*='size-']):size-4] [&_svg:not([class*='size-']):shrink-0]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-tr from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 hover:scale-[1.02]",
        destructive:
          "bg-gradient-to-tr from-destructive to-red-600 text-destructive-foreground hover:from-destructive/90 hover:to-red-600/90 hover:scale-[1.02]",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
        secondary:
          "bg-gradient-to-tr from-secondary to-slate-600 text-secondary-foreground hover:from-secondary/90 hover:to-slate-600/90 hover:scale-[1.02]",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
        link: "underline-offset-4 hover:underline text-primary hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
