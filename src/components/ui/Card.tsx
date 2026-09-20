import * as React from "react";
import { clsx } from "clsx";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-xl border border-gray-200 bg-white text-gray-900 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:ring-2 hover:ring-offset-2 hover:ring-offset-transparent hover:ring-gradient-to-tr hover:from-primary hover:to-accent",
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

export { Card };
