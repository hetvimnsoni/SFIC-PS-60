"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen,
  Calendar,
} from "lucide-react";

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<"attention" | "subjects" | "remedial">("attention");

  return (
    <div className="w-full rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden transition-all">
      {/* Top Browser / Window Chrome */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs font-semibold text-slate-500 hidden sm:inline">
            shikshasetu.edu.in/dashboard
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm">
            Interactive Live Demo Preview
          </Badge>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            <span>Open Full App</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <div className="flex items-center justify-between text-indigo-700">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Enrolled</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">15</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Classes 3, 4 & 5</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
            <div className="flex items-center justify-between text-rose-700">
              <span className="text-[11px] font-bold uppercase tracking-wider">Need Support</span>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-rose-600">4</div>
            <span className="text-[11px] text-rose-600/80 mt-0.5 block">Concepts &lt; 60%</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Plans</span>
              <Layers className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-amber-700">3</div>
            <span className="text-[11px] text-amber-700/80 mt-0.5 block">5-Step Manipulatives</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-[11px] font-bold uppercase tracking-wider">Reassessed Gain</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-600">+50 pp</div>
            <span className="text-[11px] text-emerald-600/80 mt-0.5 block">Aarav Patel (35% &rarr; 85%)</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("attention")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "attention"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Immediate Attention (4 Students)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("subjects")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "subjects"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Curriculum Proficiency
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("remedial")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "remedial"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            5-Step Remedial Plan
          </button>
        </div>

        {/* Tab Content 1: Attention List */}
        {activeTab === "attention" && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">Aarav Patel</span>
                  <span className="text-xs text-slate-500 font-medium">Class 4-A • STD-001</span>
                  <Badge variant="high" size="sm">
                    Needs Support
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">
                  Concept: <span className="font-semibold text-slate-800">Division as Equal Sharing</span> (Baseline Score: 35%)
                </p>
                <div className="text-[11px] text-indigo-700 bg-indigo-50/80 rounded-md px-2 py-0.5 inline-block">
                  Pedagogical Rule: Fails grouping beyond single-digit divisors without physical counters
                </div>
              </div>
              <Link
                href="/students/std-aarav"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shrink-0 cursor-pointer"
              >
                <span>View Profile & Reassess</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">Meera Shah</span>
                  <span className="text-xs text-slate-500 font-medium">Class 4-A • STD-002</span>
                  <Badge variant="medium" size="sm">
                    Developing
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">
                  Concept: <span className="font-semibold text-slate-800">Word Problems (Subtraction)</span> (Score: 65%)
                </p>
              </div>
              <Link
                href="/students/std-meera"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs shrink-0 cursor-pointer"
              >
                <span>View Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Tab Content 2: Curriculum Proficiency */}
        {activeTab === "subjects" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Mathematics</span>
                <span className="text-indigo-600 font-black">68% Avg</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: "68%" }} />
              </div>
              <span className="text-[11px] text-slate-500 mt-2 block">12/15 students on track</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Gujarati (ગુજરાતી)</span>
                <span className="text-emerald-600 font-black">84% Avg</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "84%" }} />
              </div>
              <span className="text-[11px] text-slate-500 mt-2 block">14/15 students on track</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>English</span>
                <span className="text-indigo-600 font-black">74% Avg</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "74%" }} />
              </div>
              <span className="text-[11px] text-slate-500 mt-2 block">13/15 students on track</span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>EVS (પર્યાવરણ)</span>
                <span className="text-emerald-600 font-black">81% Avg</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "81%" }} />
              </div>
              <span className="text-[11px] text-slate-500 mt-2 block">14/15 students on track</span>
            </div>
          </div>
        )}

        {/* Tab Content 3: 5-Step Remedial Plan */}
        {activeTab === "remedial" && (
          <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider">
                Active Protocol: Division as Equal Sharing (Aarav Patel)
              </span>
              <Badge variant="mastered" size="sm">
                Target: &ge; 80%
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-white border border-indigo-100 font-medium">
                <div className="text-indigo-600 font-bold mb-1">Step 1</div>
                Concrete Sharing with 20 beads
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-indigo-100 font-medium">
                <div className="text-indigo-600 font-bold mb-1">Step 2</div>
                Repeated Subtraction on Number Line
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-indigo-100 font-medium">
                <div className="text-indigo-600 font-bold mb-1">Step 3</div>
                Visual Array Diagrams
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-indigo-100 font-medium">
                <div className="text-indigo-600 font-bold mb-1">Step 4</div>
                Interactive Digital Quiz (3 Qs)
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 bg-emerald-50/30 font-medium text-emerald-900">
                <div className="text-emerald-700 font-bold mb-1">Step 5</div>
                Reassessment (Achieved 85%)
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA to explore real app */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready to explore real student profiles, gap detection rules, and printed worksheets?</span>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>Launch Complete Teacher Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
