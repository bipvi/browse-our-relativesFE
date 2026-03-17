import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "bg-myP/20 text-myP border border-myP/30",
        variant === "outline" && "border border-myP/40 text-myP bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Badge }
