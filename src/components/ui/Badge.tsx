import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "needsSupport"
  | "developing"
  | "mastered"
  | "high"
  | "medium"
  | "low"
  | "suggested"
  | "approved"
  | "inProgress"
  | "completed"
  | "default"
  | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    needsSupport: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20",
    developing: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20",
    mastered: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
    high: "bg-red-100 text-red-800 border-red-300 font-bold",
    medium: "bg-amber-100 text-amber-800 border-amber-300 font-semibold",
    low: "bg-slate-100 text-slate-700 border-slate-200",
    suggested: "bg-blue-50 text-blue-700 border-blue-200",
    approved: "bg-purple-50 text-purple-700 border-purple-200",
    inProgress: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    default: "bg-slate-100 text-slate-800 border-slate-200",
    outline: "bg-transparent text-slate-700 border-slate-300",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border shadow-2xs transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
