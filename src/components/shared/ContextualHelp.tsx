"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { HelpCircle, ExternalLink, X } from "lucide-react";

export type HelpTermKey =
  | "masteryThreshold"
  | "gapDetection"
  | "delta"
  | "remedialPlan";

interface ContextualHelpProps {
  termKey?: HelpTermKey;
  customTitle?: string;
  customDesc?: string;
  tutorialTab?: string;
  className?: string;
}

const TERM_DEFAULTS: Record<
  HelpTermKey,
  {
    titleEn: string;
    titleGu: string;
    descEn: string;
    descGu: string;
    tab: string;
  }
> = {
  masteryThreshold: {
    titleEn: "60% Mastery Benchmark",
    titleGu: "૬૦% નિપુણતા બેન્ચમાર્ક",
    descEn:
      "Scores below 60% trigger an automatic Learning Gap flag. 60–79% indicates Developing proficiency, and 80%+ marks verified Mastery.",
    descGu:
      "૬૦% થી ઓછા ગુણ પર આપોઆપ ત્રુટિ ફ્લેગ થાય છે. ૬૦–૭૯% વિકાસશીલ અને ૮૦%+ નિપુણ દરજ્જો આપે છે.",
    tab: "faq",
  },
  gapDetection: {
    titleEn: "Deterministic Gap Detection",
    titleGu: "પારદર્શક ત્રુટિ ઓળખ એન્જિન",
    descEn:
      "Transparent diagnostic rules compare student assessment results directly to NIPUN Bharat learning outcomes with zero black-box obscurity.",
    descGu:
      "મૂલ્યાંકન પરિણામોની નિપુણ ભારત માપદંડો સાથે સીધી સરખામણી કરી બાળક ક્યાં અટક્યું તેનું સ્પષ્ટ કારણ દર્શાવાય છે.",
    tab: "workflow",
  },
  delta: {
    titleEn: "Percentage-Point Delta (+pp)",
    titleGu: "પર્સેન્ટેજ-પોઇન્ટ વૃદ્ધિ (+pp)",
    descEn:
      "The absolute numerical increase in score from baseline to post-intervention re-test (e.g. 35% to 85% = +50 pp gain).",
    descGu:
      "પ્રારંભિક ટેસ્ટ અને ઉપચાર પછીના પુનઃટેસ્ટ વચ્ચેનો ચોખ્ખો વધારો (જેમ કે ૩૫% થી ૮૫% = +૫૦ pp સુધારો).",
    tab: "glossary",
  },
  remedialPlan: {
    titleEn: "5-Step Remedial Plan",
    titleGu: "૫-પગલાંની ઉપચારાત્મક યોજના",
    descEn:
      "Structured concrete teaching steps starting with physical manipulatives (beads, bowls) before advancing to visual diagrams and equations.",
    descGu:
      "મણકા-સળીઓ જેવા મૂર્ત સાધનોથી શરૂ કરી ક્રમશઃ ચિત્રો અને ગણતરી તરફ આગળ વધતી રચનાત્મક શિક્ષણ પદ્ધતિ.",
    tab: "lessons",
  },
};

export function ContextualHelp({
  termKey,
  customTitle,
  customDesc,
  tutorialTab,
  className = "",
}: ContextualHelpProps) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const config = termKey ? TERM_DEFAULTS[termKey] : null;

  const title =
    customTitle ||
    (config
      ? language === "gu"
        ? config.titleGu
        : config.titleEn
      : "Quick Help");

  const desc =
    customDesc ||
    (config
      ? language === "gu"
        ? config.descGu
        : config.descEn
      : "Contextual educational reference.");

  const tab = tutorialTab || (config ? config.tab : "faq");

  return (
    <span className={`relative inline-flex items-center align-middle ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer ml-1"
        aria-label={`Learn more about ${title}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 rounded-2xl bg-[#14123D]/95 border border-[#FF8A3D]/40 p-3 shadow-2xl backdrop-blur-xl z-50 text-white space-y-1.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <span>{title}</span>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded-sm"
              aria-label="Close popover"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug font-normal">
            {desc}
          </p>

          <div className="pt-1 flex items-center justify-end">
            <Link
              href={`/tutorial?tab=${tab}`}
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-bold text-[#3DDBA9] hover:underline flex items-center gap-0.5"
            >
              <span>{t.help?.learnMore || (language === "gu" ? "ટ્યુટોરિયલમાં વધુ જુઓ" : "Learn more in Tutorial")}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      )}
    </span>
  );
}
