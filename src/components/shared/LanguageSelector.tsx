"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm ${className}`}>
      <div className="flex items-center px-2 py-1 text-xs font-medium text-slate-500">
        <Languages className="w-3.5 h-3.5 mr-1 text-slate-400" />
        <span className="hidden sm:inline">Lang:</span>
      </div>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          language === "en"
            ? "bg-indigo-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage("gu")}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          language === "gu"
            ? "bg-indigo-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`}
      >
        ગુજરાતી
      </button>
    </div>
  );
}
