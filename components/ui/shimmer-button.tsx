import * as React from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, size = "md", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium text-white transition-all duration-300",
          "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-[length:200%_100%] animate-pulse-glow",
          "hover:scale-105 active:scale-95",
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-6 text-base",
          size === "lg" && "h-13 px-8 text-lg",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
