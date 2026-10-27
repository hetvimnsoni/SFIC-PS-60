import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "solid" | "interactive";
  glow?: boolean;
}

export function Card({
  variant = "glass",
  glow = false,
  className,
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    glass:
      "bg-white/95 dark:bg-[#26201C]/95 backdrop-blur-md border border-[#49352F]/10 dark:border-[#F2CAB3]/15 text-[#49352F] dark:text-[#F4F1E1] shadow-[0_8px_24px_rgba(73,53,47,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] rounded-[24px]",
    solid:
      "bg-white dark:bg-[#26201C] border border-[#49352F]/10 dark:border-[#F2CAB3]/15 text-[#49352F] dark:text-[#F4F1E1] shadow-xs rounded-[24px]",
    interactive:
      "bg-white/95 dark:bg-[#26201C]/95 border border-[#49352F]/10 dark:border-[#F2CAB3]/15 text-[#49352F] dark:text-[#F4F1E1] shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#F2CAB3] dark:hover:border-[#F2CAB3] transition-all duration-200 cursor-pointer rounded-[24px]",
  };

  return (
    <div
      className={cn(
        "p-5 text-[#49352F] dark:text-[#F4F1E1]",
        variantStyles[variant],
        glow && "ring-1 ring-[#F2CAB3] shadow-md shadow-[#F2CAB3]/25",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-[#49352F]/10 dark:border-[#F2CAB3]/15 pb-4 mb-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base sm:text-lg font-bold text-[#49352F] dark:text-[#F4F1E1] tracking-tight font-heading",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-[#7A6862] dark:text-[#FAF6E9]/70 mt-0.5", className)}
      {...props}
    >
      {children}
    </p>
  );
}
