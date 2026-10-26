"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      data-tour="language-toggle"
      className={`inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5 shadow-2xs ${className}`}
    >
      <div className="hidden 2xl:flex items-center px-1.5 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Languages className="w-3.5 h-3.5 mr-1 text-slate-400 dark:text-slate-500 shrink-0" />
        <span>Lang:</span>
      </div>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-label="Switch language to English"
        className={`px-2 lg:px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
          language === "en"
            ? "bg-indigo-600 text-white shadow-xs"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
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
            ? "bg-indigo-600 text-white shadow-xs"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
        }`}
      >
        <span className="hidden sm:inline">ગુજરાતી</span>
        <span className="sm:hidden">GU</span>
      </button>
    </div>
  );
}
