"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { ReassessmentModal } from "@/components/assessment/ReassessmentModal";
import {
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  Filter,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
} from "lucide-react";

export default function LearningGapsPage() {
  const { t } = useLanguage();

  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [generatingPlanId, setGeneratingPlanId] = useState<string | null>(null);

  // Reassessment modal state
  const [reassessModalOpen, setReassessModalOpen] = useState(false);
  const [targetGapForReassessment, setTargetGapForReassessment] = useState<any>(null);

  const fetchGaps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/learning-gaps");
      const data = await res.json();
      if (data.success) {
        setGaps(data.gaps || []);
      }
    } catch (e) {
      console.error("Failed to load learning gaps", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaps();
  }, []);

  const handleGeneratePlan = async (gapId: string) => {
    setGeneratingPlanId(gapId);
    try {
      const res = await fetch("/api/remedial-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gapId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchGaps();
      }
    } catch (e) {
      console.error("Error creating plan", e);
    } finally {
      setGeneratingPlanId(null);
    }
  };

  const filteredGaps = gaps.filter((g) => {
    if (priorityFilter !== "all" && g.priority !== priorityFilter) return false;
    if (statusFilter !== "all" && g.status !== statusFilter) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Learning-Gap Detection Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Transparent pedagogical gap detection identifying student conceptual roadblocks with actionable next steps.
            </p>
          </div>
        </div>

        {/* Operational Thresholds Disclosure Alert */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700">
            <span className="font-bold text-indigo-900">Configured Operational Thresholds:</span>{" "}
            <strong>80–100% Mastered</strong> • <strong>60–79% Developing</strong> •{" "}
            <strong>Below 60% Needs Support</strong>. Priority is determined by repeated low
            assessments (&ge;2 attempts) and historical decline trajectories.
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Priority:</span>
              <select
                value={priorityFilter}
                aria-label="Filter learning gaps by priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              <select
                value={statusFilter}
                aria-label="Filter learning gaps by status"
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Under Intervention">Under Intervention</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <span className="text-xs text-slate-400">
            Showing {filteredGaps.length} detected learning gaps
          </span>
        </div>

        {/* Learning Gaps List */}
        <div className="space-y-4">
          {filteredGaps.map((gap) => {
            const isResolved = gap.status === "Resolved" || gap.masteryStatus === "Mastered";

            return (
              <Card
                key={gap.id}
                className={
                  isResolved
                    ? "border-l-4 border-l-emerald-500 bg-emerald-50/20"
                    : gap.priority === "High"
                    ? "border-l-4 border-l-rose-500"
                    : "border-l-4 border-l-amber-500"
                }
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/students/${gap.studentId}`}
                        className="font-bold text-base text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {gap.studentName}
                      </Link>
                      <Badge variant="outline" size="sm">
                        Class {gap.grade}-A
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {gap.subjectCode}
                      </Badge>
                      <Badge
                        variant={
                          isResolved
                            ? "mastered"
                            : gap.masteryStatus === "Developing"
                            ? "developing"
                            : "needsSupport"
                        }
                      >
                        {gap.masteryStatus}
                      </Badge>
                      <Badge
                        variant={gap.priority === "High" ? "high" : "medium"}
                        size="sm"
                      >
                        {gap.priority} Priority
                      </Badge>
                    </div>

                    <h3 className="font-bold text-sm text-slate-800">
                      Concept: {gap.conceptName}
                    </h3>

                    {/* Explainable Reasoning */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-semibold text-indigo-900 block mb-0.5">
                        Detection Rule & Explanation:
                      </span>
                      <p className="text-slate-700 italic">&quot;{gap.reason}&quot;</p>
                    </div>

                    {/* Telemetry info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>Evaluations recorded: <strong>{gap.attemptsCount}</strong></span>
                      <span>
                        Latest Score:{" "}
                        <strong className={isResolved ? "text-emerald-600" : "text-rose-600"}>
                          {gap.latestPercentage}%
                        </strong>
                      </span>
                      {gap.previousPercentage !== undefined && (
                        <span>Previous: <strong>{gap.previousPercentage}%</strong></span>
                      )}
                      {gap.deltaPercentagePoints !== undefined && (
                        <span className="font-bold text-emerald-600">
                          Trajectory: +{gap.deltaPercentagePoints} pp
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 self-end md:self-start">
                    {gap.remedialPlanId ? (
                      <Link
                        href="/remedial-plans"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold transition-colors"
                      >
                        <ClipboardList className="w-3.5 h-3.5" />
                        <span>View Remedial Plan</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={generatingPlanId === gap.id}
                        onClick={() => handleGeneratePlan(gap.id)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {generatingPlanId === gap.id ? "Generating..." : "Generate Remedial Plan"}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setTargetGapForReassessment(gap);
                        setReassessModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>Record Reassessment</span>
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Reassessment Modal */}
      {targetGapForReassessment && (
        <ReassessmentModal
          isOpen={reassessModalOpen}
          onClose={() => setReassessModalOpen(false)}
          studentId={targetGapForReassessment.studentId}
          studentName={targetGapForReassessment.studentName}
          conceptId={targetGapForReassessment.conceptId}
          conceptName={targetGapForReassessment.conceptName}
          previousPercentage={targetGapForReassessment.latestPercentage}
          onSuccess={fetchGaps}
        />
      )}
    </AppLayout>
  );
}
