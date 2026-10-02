"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  variant?: "default" | "winter" | "success" | "gradient"
  size?: "sm" | "default" | "lg"
  showValue?: boolean
  animated?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    variant = "default",
    size = "default",
    showValue = false,
    animated = true,
    ...props 
  }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    const variantClasses = {
      default: "bg-primary",
      winter: "bg-gradient-to-r from-cyan-400 to-blue-500",
      success: "bg-gradient-to-r from-emerald-400 to-teal-500",
      gradient: "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400",
    };
    
    const sizeClasses = {
      sm: "h-1",
      default: "h-2",
      lg: "h-3",
    };

    return (
      <div className="w-full">
        <div
          ref={ref}
          className={cn(
            "relative overflow-hidden rounded-full bg-secondary",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out",
              variantClasses[variant],
              animated && "animate-pulse-subtle",
            )}
            style={{ width: `${percentage}%` }}
          >
            {animated && percentage > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
          </div>
        </div>
        {showValue && (
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{Math.round(percentage)}%</span>
            <span>{value}/{max}</span>
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
