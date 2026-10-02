"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    size?: "sm" | "default" | "lg";
    variant?: "default" | "winter" | "frost";
    indeterminate?: boolean;
  }
>(({ className, size = "default", variant = "default", indeterminate, ...props }, ref) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const variantClasses = {
    default: "border-primary text-primary shadow",
    winter: "border-cyan-400/50 bg-cyan-950/20 text-cyan-400 shadow-cyan-500/20",
    frost: "border-white/20 bg-white/5 text-white shadow-white/10",
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer shrink-0 rounded-md border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        sizeClasses[size],
        variantClasses[variant],
        "transition-all duration-200 ease-in-out",
        "hover:border-cyan-400/70 hover:shadow-lg hover:shadow-cyan-500/20",
        "data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500",
        "data-[state=checked]:border-cyan-400 data-[state=checked]:shadow-lg data-[state=checked]:shadow-cyan-500/30",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className={cn(
          "transition-transform duration-200",
          size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"
        )} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
