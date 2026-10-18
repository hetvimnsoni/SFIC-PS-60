"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { ActivityPlayerModal } from "@/components/activities/ActivityPlayerModal";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  BookOpen,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function RemedialPlansPage() {
  const { t } = useLanguage();

  const [plans, setPlans] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Activity player modal
  const [activeActivity, setActiveActivity] = useState<any>(null);
  const [targetStudent, setTargetStudent] = useState<any>(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const [resPlans, resAct] = await Promise.all([
        fetch("/api/remedial-plans"),
        fetch("/api/activities"),
      ]);
      const [dataPlans, dataAct] = await Promise.all([resPlans.json(), resAct.json()]);

      if (dataPlans.success) setPlans(dataPlans.plans || []);
      if (dataAct.success) setActivities(dataAct.activities || []);
    } catch (e) {
      console.error("Failed to load plans", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleUpdateStatus = async (planId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/remedial-plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: planId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPlans();
      }
    } catch (e) {
      console.error("Failed to update plan status", e);
    }
  };

  const handleLaunchPractice = (plan: any) => {
    const act = activities.find((a) => a.conceptId === plan.conceptId) || activities[0];
    setActiveActivity(act);
    setTargetStudent({ id: plan.studentId, name: plan.studentName });
  };

  const filteredPlans = plans.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Personalized Remedial Learning Plans
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Targeted step-by-step curricula generated to close student conceptual learning gaps.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter by Status:</span>
            <select
              value={statusFilter}
              aria-label="Filter remedial plans by status"
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Suggested">Suggested</option>
              <option value="Approved">Approved</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Needs Review">Needs Review</option>
            </select>
          </div>
          <span className="text-xs text-slate-400">
            {filteredPlans.length} active remedial plans
          </span>
        </div>

        {/* Plans List */}
        <div className="space-y-4">
          {filteredPlans.map((plan) => {
            const isCompleted = plan.status === "Completed";

            return (
              <Card
                key={plan.id}
                className={isCompleted ? "bg-emerald-50/20 border-l-4 border-l-emerald-500" : ""}
              >
                {/* Header of plan */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/students/${plan.studentId}`}
                        className="font-bold text-base text-slate-900 hover:text-indigo-600"
                      >
                        {plan.studentName}
                      </Link>
                      <Badge variant="outline" size="sm">
                        {plan.subjectCode}
                      </Badge>
                      <Badge
                        variant={
                          plan.status === "Approved"
                            ? "approved"
                            : plan.status === "Completed"
                            ? "completed"
                            : plan.status === "In Progress"
                            ? "inProgress"
                            : "suggested"
                        }
                      >
                        {plan.status}
                      </Badge>
                      <span className="text-xs text-slate-400 font-medium">
                        ⏱ {plan.estimatedMinutes} mins per session
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-800 mt-1">
                      Concept: {plan.conceptName}
                    </h3>
                  </div>

                  {/* Status Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-start">
                    {plan.status === "Suggested" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(plan.id, "Approved")}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        Approve Plan
                      </button>
                    )}
                    {plan.status === "Approved" && (
                      <button
                        type="button"
                        onClick={() => handleLaunchPractice(plan)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Activity</span>
                      </button>
                    )}
                    {plan.status === "In Progress" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(plan.id, "Completed")}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>

                {/* Plan Content */}
                <div className="mt-3 space-y-3">
                  <div className="text-xs text-slate-700">
                    <span className="font-bold text-indigo-950">Pedagogical Objective:</span>{" "}
                    {plan.learningObjective}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    <strong>Required Materials:</strong> {plan.requiredMaterials?.join(", ")}
                  </div>

                  {/* Step-by-step curriculum */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Step-by-Step Remediation Sequence:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {plan.steps?.map((step: any) => (
                        <div
                          key={step.stepNumber}
                          className="p-2.5 rounded-xl border border-slate-100 bg-white shadow-2xs text-xs"
                        >
                          <div className="flex items-center justify-between text-slate-800 font-semibold mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 text-[10px] flex items-center justify-center font-bold">
                                {step.stepNumber}
                              </span>
                              <span>{step.title}</span>
                            </span>
                            <span className="text-[10px] text-slate-400">{step.durationMinutes}m</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-snug">
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Teacher Instructions & Reassessment Criteria */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                      <span className="font-bold text-amber-900 block mb-0.5">Teacher Tips:</span>
                      <p className="text-amber-800">{plan.teacherInstructions}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                      <span className="font-bold text-indigo-900 block mb-0.5">
                        Reassessment Criteria:
                      </span>
                      <p className="text-indigo-800">{plan.reassessmentCriteria}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Activity Player Modal */}
      {activeActivity && (
        <ActivityPlayerModal
          activity={activeActivity}
          studentId={targetStudent?.id}
          studentName={targetStudent?.name}
          isOpen={Boolean(activeActivity)}
          onClose={() => setActiveActivity(null)}
          onCompleted={() => {
            fetchPlans();
          }}
        />
      )}
    </AppLayout>
  );
}
