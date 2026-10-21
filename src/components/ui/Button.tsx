"use client";

import React from "react";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "mint" | "coral" | "saffron" | "indigo";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-full select-none transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const sizeClasses = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-7 py-3 gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-[#F2CAB3] hover:bg-white text-[#49352F] font-bold border border-[#49352F]/16 shadow-[0_4px_14px_rgba(73,53,47,0.08)] hover:shadow-[0_8px_20px_rgba(73,53,47,0.14)] hover:-translate-y-0.5 focus-visible:ring-[#F2CAB3]",
    saffron:
      "bg-[#F2CAB3] hover:bg-white text-[#49352F] font-bold border border-[#49352F]/16 shadow-[0_4px_14px_rgba(73,53,47,0.08)] hover:shadow-[0_8px_20px_rgba(73,53,47,0.14)] hover:-translate-y-0.5 focus-visible:ring-[#F2CAB3]",
    secondary:
      "bg-white hover:bg-[#F2CAB3] text-[#49352F] font-semibold border border-[#49352F]/14 shadow-xs hover:-translate-y-0.5 focus-visible:ring-[#F2CAB3]",
    indigo:
      "bg-[#F2DCB5]/80 hover:bg-[#F2CAB3] text-[#49352F] font-semibold border border-[#49352F]/14 shadow-xs hover:-translate-y-0.5 focus-visible:ring-[#F2CAB3]",
    outline:
      "border border-[#49352F]/18 bg-white/70 hover:bg-[#F2CAB3]/40 text-[#49352F] font-semibold backdrop-blur-sm focus-visible:ring-[#F2CAB3]",
    ghost:
      "text-[#49352F] hover:bg-[#49352F]/8 font-medium focus-visible:ring-[#F2CAB3]",
    mint:
      "bg-[#EAF4EE] text-[#2E7D5E] hover:bg-[#2E7D5E] hover:text-white font-bold border border-[#2E7D5E]/25 shadow-xs hover:-translate-y-0.5 focus-visible:ring-[#2E7D5E]",
    coral:
      "bg-[#FBECE9] text-[#C54738] hover:bg-[#C54738] hover:text-white font-bold border border-[#C54738]/25 shadow-xs hover:-translate-y-0.5 focus-visible:ring-[#C54738]",
  };

  return (
    <button
      className={clsx(baseClasses, sizeClasses[size], variantClasses[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
