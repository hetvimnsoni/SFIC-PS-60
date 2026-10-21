"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, ArrowRight, ChevronDown, ChevronUp, CheckCircle2, Play } from "lucide-react";

export function HackathonDemoBanner() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 rounded-2xl border border-[#49352F]/15 bg-gradient-to-r from-[#F2DCB5]/90 via-[#FAF6E9] to-[#F2CAB3]/80 text-[#49352F] shadow-[0_8px_24px_rgba(73,53,47,0.06)] overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F2CAB3] border border-[#49352F]/15 text-[#49352F] font-bold shadow-xs">
            <Sparkles className="w-5 h-5 text-[#B26A1B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#B26A1B]">
                SFIC Gujarat Hackathon 2026
              </span>
              <span className="bg-white/80 border border-[#49352F]/12 text-[10px] text-[#49352F] px-2 py-0.5 rounded-full font-medium">
                Live Interactive Demo
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[#49352F] mt-0.5">
              Smart Tracking & Remedial Action: The 2-Minute Judge Walkthrough
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Link
            href="/students/std-aarav"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#49352F] hover:bg-[#2C1F1B] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:scale-102 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Aarav&apos;s Case</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-white/70 hover:bg-white text-[#49352F] border border-[#49352F]/15 transition-colors cursor-pointer"
            aria-label="Toggle details"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable walkthrough guide */}
      {isOpen && (
        <div className="border-t border-[#49352F]/10 bg-white/60 p-4 sm:p-6 text-xs text-[#49352F]">
          <p className="font-semibold text-[#B26A1B] mb-3">
            Recommended Step-by-Step Flow for Evaluators:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-white border border-[#49352F]/10 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#49352F] mb-1">
                <span className="w-4 h-4 rounded-full bg-[#F2CAB3] text-[#49352F] text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Initial Diagnostic</span>
              </div>
              <p className="text-[11px] text-[#7A6862]">
                Aarav (Class 4-A) scored 35% on Division Basics across 2 consecutive evaluations.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#49352F]/10 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#49352F] mb-1">
                <span className="w-4 h-4 rounded-full bg-[#F2CAB3] text-[#49352F] text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Gap Detection</span>
              </div>
              <p className="text-[11px] text-[#7A6862]">
                Engine flags &quot;Needs Support — High Priority&quot; with explainable pedagogical reasoning.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#49352F]/10 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#49352F] mb-1">
                <span className="w-4 h-4 rounded-full bg-[#F2CAB3] text-[#49352F] text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Targeted Remediation</span>
              </div>
              <p className="text-[11px] text-[#7A6862]">
                5-step plan with physical counters, equal sharing mats, and teacher instructions.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#49352F]/10 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#49352F] mb-1">
                <span className="w-4 h-4 rounded-full bg-[#F2CAB3] text-[#49352F] text-[10px] flex items-center justify-center font-bold">4</span>
                <span>Practice Activity</span>
              </div>
              <p className="text-[11px] text-[#7A6862]">
                Interactive student practice quiz with instant feedback and auto-scored attempt.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#49352F]/10 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#49352F] mb-1">
                <span className="w-4 h-4 rounded-full bg-[#2E7D5E] text-white text-[10px] flex items-center justify-center font-bold">5</span>
                <span>Reassessment & Gain</span>
              </div>
              <p className="text-[11px] text-[#7A6862]">
                Record new score (85%): engine logs +50 percentage-point gain and resolves gap!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
