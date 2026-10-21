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
  | "outline"
  | "saffron"
  | "mint"
  | "coral"
  | "indigo"
  | "amber";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  pulse = false,
  className,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    needsSupport:
      "bg-[#FBECE9] text-[#A93327] border border-[#A93327]/25 font-semibold",
    developing:
      "bg-[#FDF4E7] text-[#8D4E10] border border-[#8D4E10]/25 font-semibold",
    mastered:
      "bg-[#EAF4EE] text-[#2E7D5E] border border-[#2E7D5E]/25 font-semibold",
    high: "bg-[#FBECE9] text-[#A93327] border border-[#A93327]/30 font-bold",
    medium:
      "bg-[#FDF4E7] text-[#8D4E10] border border-[#8D4E10]/30 font-semibold",
    low: "bg-[#FAF6E9] text-[#49352F] border border-[#49352F]/12 font-medium",
    suggested:
      "bg-[#FAF6E9] text-[#49352F] border border-[#49352F]/15 font-medium",
    approved:
      "bg-[#EAF4EE] text-[#2E7D5E] border border-[#2E7D5E]/25 font-semibold",
    inProgress:
      "bg-[#FDF4E7] text-[#8D4E10] border border-[#8D4E10]/25 font-semibold",
    completed:
      "bg-[#EAF4EE] text-[#2E7D5E] border border-[#2E7D5E]/25 font-semibold",
    default:
      "bg-[#FAF6E9] text-[#49352F] border border-[#49352F]/14 font-medium",
    outline:
      "bg-transparent text-[#49352F] border border-[#49352F]/20 font-medium",
    saffron:
      "bg-[#F2CAB3] text-[#49352F] border border-[#49352F]/16 font-bold",
    mint:
      "bg-[#EAF4EE] text-[#2E7D5E] border border-[#2E7D5E]/25 font-semibold",
    coral:
      "bg-[#FBECE9] text-[#A93327] border border-[#A93327]/25 font-semibold",
    indigo:
      "bg-[#F2DCB5]/80 text-[#49352F] border border-[#49352F]/14 font-semibold",
    amber:
      "bg-[#FDF4E7] text-[#8D4E10] border border-[#8D4E10]/25 font-semibold",
  };

  const dotColors: Record<BadgeVariant, string> = {
    needsSupport: "bg-[#A93327]",
    developing: "bg-[#8D4E10]",
    mastered: "bg-[#2E7D5E]",
    high: "bg-[#A93327]",
    medium: "bg-[#8D4E10]",
    low: "bg-[#7A6862]",
    suggested: "bg-[#49352F]",
    approved: "bg-[#2E7D5E]",
    inProgress: "bg-[#8D4E10]",
    completed: "bg-[#2E7D5E]",
    default: "bg-[#49352F]",
    outline: "bg-[#49352F]",
    saffron: "bg-[#8D4E10]",
    mint: "bg-[#2E7D5E]",
    coral: "bg-[#A93327]",
    indigo: "bg-[#B8673E]",
    amber: "bg-[#8D4E10]",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 gap-1.5",
    md: "text-xs px-3 py-1 gap-2",
  };

  const showDot = dot || pulse;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border shadow-2xs transition-colors",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {showDot && (
        <span className="relative flex h-2 w-2 items-center justify-center" aria-hidden="true">
          {pulse && (
            <span
              className={cn(
                "animate-pulse motion-reduce:animate-none absolute inline-flex h-3 w-3 rounded-full opacity-40",
                dotColors[variant]
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex rounded-full h-1.5 w-1.5",
              dotColors[variant]
            )}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
