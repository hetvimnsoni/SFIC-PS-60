"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      data-tour="language-toggle"
      className={`inline-flex h-9 items-center rounded-xl border border-[#49352F]/15 dark:border-[#F2CAB3]/20 bg-white dark:bg-[#26201C] p-0.5 shadow-2xs ${className}`}
    >
      <div className="hidden 2xl:flex items-center px-1.5 py-1 text-xs font-medium text-[#7A6862] dark:text-[#FAF6E9]/60">
        <Languages className="w-3.5 h-3.5 mr-1 text-[#7A6862] dark:text-[#FAF6E9]/60 shrink-0" />
        <span>Lang:</span>
      </div>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-label="Switch language to English"
        className={`px-2 lg:px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
          language === "en"
            ? "bg-[#F2CAB3] dark:bg-[#F2CAB3]/30 text-[#49352F] dark:text-[#F4F1E1] font-bold shadow-xs"
            : "text-[#7A6862] dark:text-[#FAF6E9]/70 hover:text-[#49352F] dark:hover:text-[#F4F1E1] hover:bg-[#FAF6E9] dark:hover:bg-[#1E1916]"
        }`}
      >
        <span className="hidden sm:inline">English</span>
        <span className="sm:hidden">EN</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage("gu")}
        aria-label="Switch language to Gujarati"
        className={`px-2 lg:px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
          language === "gu"
            ? "bg-[#F2CAB3] dark:bg-[#F2CAB3]/30 text-[#49352F] dark:text-[#F4F1E1] font-bold shadow-xs"
            : "text-[#7A6862] dark:text-[#FAF6E9]/70 hover:text-[#49352F] dark:hover:text-[#F4F1E1] hover:bg-[#FAF6E9] dark:hover:bg-[#1E1916]"
        }`}
      >
        <span className="hidden sm:inline">ગુજરાતી</span>
        <span className="sm:hidden">GU</span>
      </button>
    </div>
  );
}
