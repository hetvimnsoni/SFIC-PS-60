"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { ActivityPlayerModal } from "@/components/activities/ActivityPlayerModal";
import { SpotlightTour } from "@/components/tutorial/SpotlightTour";
import { ContextualHelp } from "@/components/shared/ContextualHelp";
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
  Printer,
  Boxes,
  Compass,
  FileCheck,
  Award,
  Layers,
  Circle,
  CheckSquare,
  Square,
} from "lucide-react";

// Step material icons mapping
function getStepMaterialIcon(stepNum: number) {
  switch (stepNum) {
    case 1:
      return <ClipboardList className="w-4 h-4 text-sky-400" />;
    case 2:
      return <Boxes className="w-4 h-4 text-amber-400" />; // Beads & counters
    case 3:
      return <Compass className="w-4 h-4 text-teal-400" />; // Number lines & diagrams
    case 4:
      return <BookOpen className="w-4 h-4 text-indigo-400" />; // Flashcards & quizzes
    case 5:
      return <Award className="w-4 h-4 text-emerald-400" />; // Reassessment
    default:
      return <Layers className="w-4 h-4 text-amber-400" />;
  }
}

// Circular Progress Ring Component
function ProgressRing({
  completedSteps,
  totalSteps,
}: {
  completedSteps: number;
  totalSteps: number;
}) {
  const percentage = Math.round((completedSteps / Math.max(1, totalSteps)) * 100);
  const strokeWidth = 5;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg width="56" height="56" className="transform -rotate-90">
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke={percentage === 100 ? "#3DDBA9" : "#FF8A3D"}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute text-[11px] font-mono font-black text-white">
        {percentage}%
      </div>
    </div>
  );
}

export default function RemedialPlansPage() {
  const { t, language } = useLanguage();

  const [plans, setPlans] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Track completed step IDs for interactive checkboxes: planId -> set of completed step numbers
  const [completedStepsMap, setCompletedStepsMap] = useState<Record<string, number[]>>({});

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

      if (dataPlans.success) {
        setPlans(dataPlans.plans || []);
        // Initialize default completed steps from plan data or demo
        const initialMap: Record<string, number[]> = {};
        (dataPlans.plans || []).forEach((p: any) => {
          if (p.status === "Completed") {
            initialMap[p.id] = [1, 2, 3, 4, 5];
          } else if (p.status === "In Progress") {
            initialMap[p.id] = [1, 2];
          } else {
            initialMap[p.id] = [1];
          }
        });
        setCompletedStepsMap(initialMap);
      }
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

  const toggleStepCompleted = (planId: string, stepNumber: number) => {
    setCompletedStepsMap((prev) => {
      const current = prev[planId] || [];
      const updated = current.includes(stepNumber)
        ? current.filter((n) => n !== stepNumber)
        : [...current, stepNumber];
      return { ...prev, [planId]: updated };
    });
  };

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

  const handlePrintPlan = () => {
    window.print();
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
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {language === "gu" ? "૫-પગલાંની ઉપચારાત્મક શિક્ષણ યોજનાઓ" : "5-Step Concrete Remedial Plans"}
              </h1>
              <Badge variant="saffron" size="sm" pulse>
                Active Curricula
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Targeted step-by-step manipulative pathways (counting beads, number lines, flashcards) to close student learning gaps.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div data-tour="plan-print">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintPlan}
                className="rounded-full text-xs font-semibold print:hidden"
              >
                <Printer className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>Print A4 Plans</span>
              </Button>
            </div>

            <Link href="/ai?tab=remedial" className="print:hidden">
              <Button variant="saffron" size="sm" className="rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                <span>Generate Plan</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <Card variant="glass" className="p-3.5 flex items-center justify-between border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Filter by Status:</span>
            <select
              value={statusFilter}
              aria-label="Filter remedial plans by status"
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 outline-hidden cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Suggested">Suggested</option>
              <option value="Approved">Approved</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <span className="text-xs text-slate-400">
            {filteredPlans.length} active remedial plans
          </span>
        </Card>

        {/* Plans List */}
        <div className="space-y-6">
          {filteredPlans.map((plan) => {
            const completedList = completedStepsMap[plan.id] || [1];
            const steps = plan.steps && plan.steps.length > 0 ? plan.steps : [
              { stepNumber: 1, title: "Diagnostic Assessment", durationMinutes: 10, description: "Record baseline error patterns and identify specific confusion with remainders." },
              { stepNumber: 2, title: "Concrete Manipulatives (Beads & Counters)", durationMinutes: 20, description: "Physical equal-sharing practice with 12 and 15 beads grouped into bowls." },
              { stepNumber: 3, title: "Visual Number Lines", durationMinutes: 15, description: "Transition from physical beads to jumping backward on drawn number lines." },
              { stepNumber: 4, title: "Interactive Practice & Quizzes", durationMinutes: 15, description: "Digital tablet questions with immediate feedback and self-correction prompts." },
              { stepNumber: 5, title: "Formative Reassessment", durationMinutes: 10, description: "Final assessment to verify student crosses the 80% mastery threshold." },
            ];

            const isFullyCompleted = completedList.length >= steps.length;

            return (
              <Card
                key={plan.id}
                variant="glass"
                className={`p-6 border-slate-800 space-y-5 transition-all print:border-black print:bg-white print:text-black ${
                  isFullyCompleted ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-amber-500"
                }`}
              >
                {/* Header of Plan */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800 print:border-slate-300">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/students/${plan.studentId}`}
                        className="font-heading font-extrabold text-lg text-white hover:text-amber-400 transition-colors print:text-black"
                      >
                        {plan.studentName}
                      </Link>
                      <Badge variant="outline" size="sm">
                        {plan.subjectCode || "MATH"}
                      </Badge>
                      <Badge
                        variant={
                          plan.status === "Completed"
                            ? "completed"
                            : plan.status === "Approved"
                            ? "approved"
                            : "inProgress"
                        }
                        size="sm"
                        dot
                      >
                        {plan.status}
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">
                        ⏱ {plan.estimatedMinutes || 60} mins sequence
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-amber-400 mt-1 print:text-black">
                      Target Competency: {plan.conceptName}
                    </h3>

                    {plan.learningObjective && (
                      <p className="text-xs text-slate-300 max-w-2xl leading-relaxed print:text-slate-700">
                        <strong className="text-white print:text-black">Pedagogical Objective:</strong>{" "}
                        {plan.learningObjective}
                      </p>
                    )}
                  </div>

                  {/* Circular Progress Ring & Actions */}
                  <div className="flex items-center gap-4 self-end sm:self-start">
                    <div className="flex items-center gap-2 text-right">
                      <div className="hidden sm:block">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Progress
                        </span>
                        <span className="text-xs font-extrabold text-white print:text-black">
                          {completedList.length}/{steps.length} Steps
                        </span>
                      </div>
                      <ProgressRing
                        completedSteps={completedList.length}
                        totalSteps={steps.length}
                      />
                    </div>

                    {/* Quick Status Buttons */}
                    <div className="flex flex-col gap-1.5 print:hidden">
                      {plan.status === "Suggested" && (
                        <Button
                          variant="saffron"
                          size="sm"
                          onClick={() => handleUpdateStatus(plan.id, "Approved")}
                          className="rounded-full text-xs h-7"
                        >
                          Approve Plan
                        </Button>
                      )}
                      {plan.status === "Approved" && (
                        <Button
                          variant="mint"
                          size="sm"
                          onClick={() => handleLaunchPractice(plan)}
                          className="rounded-full text-xs h-7 font-bold"
                        >
                          <Play className="w-3 h-3 fill-current mr-1" />
                          <span>Start Activity</span>
                        </Button>
                      )}
                      {plan.status === "In Progress" && (
                        <Button
                          variant="mint"
                          size="sm"
                          onClick={() => handleUpdateStatus(plan.id, "Completed")}
                          className="rounded-full text-xs h-7"
                        >
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Required Materials Chips */}
                <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs print:bg-slate-100 print:text-black">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5 print:text-black">
                    <Boxes className="w-3.5 h-3.5 text-amber-400" />
                    Manipulatives Needed:
                  </span>
                  {(plan.requiredMaterials && plan.requiredMaterials.length > 0
                    ? plan.requiredMaterials
                    : ["Counting beads", "10-grouping bowls", "Drawn number lines", "Flashcards"]
                  ).map((mat: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200 text-[11px] font-medium print:bg-white print:border-slate-300 print:text-black"
                    >
                      {mat}
                    </span>
                  ))}
                </div>

                {/* 5-STEP VERTICAL STEPPER WITH MATERIAL ICONS & CHECKBOXES */}
                <div data-tour="plan-5steps" className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <span>5-Step Remedial Sequence</span>
                      <ContextualHelp termKey="remedialPlan" />
                    </span>
                    <span className="text-[11px] font-normal lowercase">Click checkbox to mark step done</span>
                  </div>

                  <div className="relative pl-6 space-y-3 border-l-2 border-slate-800 ml-3 print:border-slate-300">
                    {steps.map((step: any) => {
                      const isDone = completedList.includes(step.stepNumber);

                      return (
                        <div
                          key={step.stepNumber}
                          data-tour={step.stepNumber === 1 ? "plan-mark-done" : undefined}
                          onClick={() => toggleStepCompleted(plan.id, step.stepNumber)}
                          className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                            isDone
                              ? "bg-slate-900/40 border-emerald-500/40 text-slate-300"
                              : "bg-slate-900/80 border-slate-800 text-white hover:border-amber-500/40"
                          } print:bg-white print:border-slate-200 print:text-black`}
                        >
                          {/* Step Node Marker on Vertical Line */}
                          <div
                            className={`absolute -left-[35px] top-4 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border ${
                              isDone
                                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_10px_#3DDBA9]"
                                : "bg-slate-900 text-slate-300 border-slate-700"
                            } print:bg-white print:text-black print:border-black`}
                          >
                            {isDone ? "✓" : step.stepNumber}
                          </div>

                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-lg bg-slate-800/80 border border-slate-700">
                                  {getStepMaterialIcon(step.stepNumber)}
                                </div>
                                <h4
                                  className={`text-xs font-bold ${
                                    isDone ? "line-through text-slate-400" : "text-white"
                                  } print:text-black`}
                                >
                                  Step {step.stepNumber}: {step.title}
                                </h4>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {step.durationMinutes}m
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-300 leading-relaxed pl-7 print:text-slate-700">
                                {step.description}
                              </p>
                            </div>

                            {/* Mark-Done Interactive Checkbox */}
                            <div className="shrink-0 mt-1">
                              {isDone ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Teacher Instructions & Reassessment Criteria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-400 block text-[10px] uppercase">
                      Teacher Concrete Instructions:
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {plan.teacherInstructions || "Ensure student verbally explains remainder groups before transitioning from tactile beads to worksheet numbers."}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400 block text-[10px] uppercase">
                      Reassessment Target Benchmark:
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {plan.reassessmentCriteria || "Student achieves &ge; 80% independently on a 5-question formative check without counting manipulatives."}
                    </p>
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
      {/* Guided Tour */}
      <SpotlightTour page="remedialPlans" />
    </AppLayout>
  );
}
