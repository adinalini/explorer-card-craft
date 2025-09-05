import { cn } from "@/lib/utils"
import { CSSProperties } from "react"

interface BlobProps {
  className?: string
  variant?: "pink" | "yellow" | "orange"
  size?: "sm" | "md" | "lg"
  style?: CSSProperties
}

export function Blob({ className, variant = "pink", size = "md", style }: BlobProps) {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32", 
    lg: "w-48 h-48"
  }
  
  const variantClasses = {
    pink: "bg-gradient-to-br from-primary to-secondary",
    yellow: "bg-gradient-to-br from-accent to-primary",
    orange: "bg-gradient-to-br from-secondary to-accent"
  }
  
  return (
    <div
      className={cn(
        "absolute rounded-full blur-xl opacity-70 animate-pulse",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={style}
    />
  )
}