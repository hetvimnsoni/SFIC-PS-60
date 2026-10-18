"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ClipboardList,
  Gamepad2,
  BookOpen,
  CheckCircle2,
  Users,
  Building,
  GraduationCap,
} from "lucide-react";

export default function HomePage() {
  const { t } = useLanguage();

  const workflowSteps = [
    { num: 1, title: "Student Roster", desc: "Minimal registration without invasive data" },
    { num: 2, title: "Concept Assessment", desc: "Diagnostic tests mapped to specific skills" },
    { num: 3, title: "Gap Detection", desc: "Rule-based engine with explainable reasons" },
    { num: 4, title: "Remedial Plan", desc: "5-step targeted curriculum with manipulatives" },
    { num: 5, title: "Student Practice", desc: "Interactive digital quizzes & offline worksheets" },
    { num: 6, title: "Reassessment", desc: "Measure exact percentage-point growth" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-8 backdrop-blur-sm">
        <BrandLogo />
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto text-center">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-900 shadow-2xs mb-6">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>SFIC Gujarat Hackathon 2026 • Problem Statement PS-60</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Every Gap Identified.
          <br />
          <span className="text-indigo-600">Every Child Supported.</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Smart tracking and remedial action system for primary schools. Identifies individual learning gaps, generates concrete 5-step remedial plans, and empirically measures progress.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg transition-transform hover:scale-102 cursor-pointer"
          >
            <span>Explore Teacher Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/students/std-aarav"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold shadow-xs transition-transform hover:scale-102 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Launch Aarav&apos;s Demo Case (2 Mins)</span>
          </Link>
        </div>

        {/* Live Demo Status Pill */}
        <div className="mt-6 inline-flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Demonstration School Ready: 15 Students, 4 Subjects, Gandhinagar Demo Database</span>
        </div>
      </section>

      {/* Core Workflow Section */}
      <section className="bg-white border-y border-slate-200 py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              An Integrated 6-Stage Remedial Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              From first diagnostic test to verified mastery, every step is transparent and explainable.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {workflowSteps.map((step) => (
              <div
                key={step.num}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 text-center flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-3 shadow-xs">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">{step.title}</h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Explainable Gap Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent, rule-based algorithms detect whether a student needs support based on historical trends and configurable operational thresholds (80% / 60%).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Concrete Remedial Plans</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides step-by-step 15-20 minute sessions using tangible classroom manipulatives (counters, beads, arrays) aligned with Gujarat primary learning standards.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">True Delta Progress</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Measures absolute percentage-point gains (e.g. +50 pp) between baseline and reassessment, distinguishing true growth from relative percent illusions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo size={28} />
          <div className="text-center sm:text-right">
            <p className="font-semibold text-slate-700">SFIC Gujarat Hackathon 2026</p>
            <p className="text-[11px] text-slate-400">
              ShikshaSetu AI • Built with Next.js, TypeScript, Tailwind CSS, & Offline Database
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
