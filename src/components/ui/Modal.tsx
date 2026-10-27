"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "lg",
  footer,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#49352F]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={cn(
          "w-full rounded-3xl bg-white dark:bg-[#26201C] border border-[#49352F]/12 dark:border-[#F2CAB3]/20 shadow-[0_20px_60px_rgba(73,53,47,0.18)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden max-h-[90vh] flex flex-col text-[#49352F] dark:text-[#F4F1E1] relative",
          maxWidthClasses[maxWidth]
        )}
      >
        {/* Subtle accent top line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#F2CAB3] via-[#F2DCB5] to-[#2E7D5E]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#49352F]/10 dark:border-[#F2CAB3]/15 px-6 py-4 bg-[#FAF6E9] dark:bg-[#1E1916]">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#49352F] dark:text-[#F4F1E1] tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-[#7A6862] dark:text-[#FAF6E9]/70 mt-0.5">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-[#7A6862] dark:text-[#FAF6E9]/70 hover:text-[#49352F] dark:hover:text-[#F4F1E1] hover:bg-[#F2CAB3]/30 dark:hover:bg-[#F2CAB3]/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-[#26201C] text-[#49352F] dark:text-[#F4F1E1]">{children}</div>

        {/* Optional footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-[#49352F]/10 dark:border-[#F2CAB3]/15 px-6 py-4 bg-[#FAF6E9] dark:bg-[#1E1916]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
