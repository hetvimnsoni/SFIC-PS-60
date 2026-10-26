"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatTile } from "@/components/ui/StatTile";
import { BridgeProgress } from "@/components/ui/BridgeProgress";
import type { SkillNode } from "@/components/3d/StudentSkillTree3D";
import { useLanguage } from "@/context/LanguageContext";
import { SpotlightTour } from "@/components/tutorial/SpotlightTour";
import { ContextualHelp } from "@/components/shared/ContextualHelp";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  ClipboardList,
  Gamepad2,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Award,
  Edit,
  Play,
  RotateCcw,
  Layers,
  BrainCircuit,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const StudentSkillTree3D = dynamic(
  () => import("@/components/3d/StudentSkillTree3D").then((m) => m.StudentSkillTree3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[420px] rounded-3xl bg-[#FAF6E9] border border-[#49352F]/15 flex items-center justify-center text-[#7A6862] text-xs">
        <Sparkles className="w-4 h-4 animate-spin text-[#B26A1B] mr-2" />
        <span>Loading 3D Skill Graph...</span>
      </div>
    ),
  }
);

const ReassessmentModal = dynamic(
  () => import("@/components/assessment/ReassessmentModal").then((m) => m.ReassessmentModal),
  { ssr: false }
);

const ActivityPlayerModal = dynamic(
  () => import("@/components/activities/ActivityPlayerModal").then((m) => m.ActivityPlayerModal),
  { ssr: false }
);

const StudentFormModal = dynamic(
  () => import("@/components/student/StudentFormModal").then((m) => m.StudentFormModal),
  { ssr: false }
);

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, language } = useLanguage();

  const [student, setStudent] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [remedialPlans, setRemedialPlans] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active tab: default to 3D Skill Tree for immediate WOW factor!
  const [activeTab, setActiveTab] = useState<"skilltree" | "gaps" | "mastery" | "history" | "plans">("skilltree");

  // Modals
  const [showReassessModal, setShowReassessModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedConceptForReassessment, setSelectedConceptForReassessment] = useState<any>(null);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const [resStd, resAct] = await Promise.all([
        fetch(`/api/students/${id}`),
        fetch("/api/activities"),
      ]);

      const [dataStd, dataAct] = await Promise.all([resStd.json(), resAct.json()]);

      if (dataStd.success) {
        setStudent(dataStd.student);
        setResults(dataStd.results || []);
        setGaps(dataStd.gaps || []);
        setRemedialPlans(dataStd.remedialPlans || []);
        setAttempts(dataStd.attempts || []);
      }
      if (dataAct.success) {
        setActivities(dataAct.activities || []);
      }
    } catch (e) {
      console.error("Failed to fetch student details", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("shikshasetu_step_student_opened"));
    }
  }, [id]);

  if (loading && !student) {
    return (
      <AppLayout>
        <div className="py-20 text-center space-y-3">
          <Sparkles className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
          <p className="text-xs font-semibold text-slate-400">
            Loading student competency bridge &amp; 3D skill tree...
          </p>
        </div>
      </AppLayout>
    );
  }

  if (!student) {
    return (
      <AppLayout>
        <div className="py-16 text-center space-y-3">
          <p className="text-base font-bold text-white">Student not found</p>
          <Link href="/students" className="text-xs font-semibold text-amber-400 hover:underline">
            &larr; Back to Student Directory
          </Link>
        </div>
      </AppLayout>
    );
  }

  const activeGaps = gaps.filter((g) => g.status === "Active" || g.status === "Under Intervention");
  const resolvedGaps = gaps.filter((g) => g.status === "Resolved");
  const divisionGap = gaps.find((g) => g.conceptId === "c-div-01") || gaps[0];
  const divisionActivity = activities.find((a) => a.conceptId === "c-div-01") || activities[0];

  // Calculate overall student average
  const totalScore = results.reduce((acc, curr) => acc + curr.percentage, 0);
  const avgScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;

  // Chart data for concept mastery
  const conceptScoresData = gaps.map((g) => ({
    name: g.conceptName ? g.conceptName.split(" ")[0] : "Concept",
    latest: g.latestPercentage || 0,
    previous: g.previousPercentage || g.latestPercentage || 0,
  }));

  const openReassessment = (conceptId: string, conceptName: string, prevPct: number) => {
    setSelectedConceptForReassessment({ conceptId, conceptName, prevPct });
    setShowReassessModal(true);
  };

  // Build Skill Nodes dynamically for 3D Tree based on student's actual records
  const defaultLayoutPositions: [number, number, number][] = [
    [-1.8, -0.6, 0],
    [-1.2, 0.4, 0.4],
    [-0.3, 0.8, -0.2],
    [0.7, 0.2, 0.3],
    [1.6, -0.4, -0.3],
    [2.3, 0.5, 0.2],
  ];

  const studentEvaluatedConcepts = Array.from(new Set(results.map((r) => r.conceptId)));
  const studentGapConceptIds = gaps.map((g) => g.conceptId);
  const allStudentConceptIds = Array.from(new Set([...studentGapConceptIds, ...studentEvaluatedConcepts]));

  let skillNodes: SkillNode[] = [];

  if (allStudentConceptIds.length > 0) {
    const subset = allStudentConceptIds.slice(0, 6);
    skillNodes = subset.map((cId, idx) => {
      const gap = gaps.find((g) => g.conceptId === cId);
      const studentResults = results
        .filter((r) => r.conceptId === cId)
        .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

      const latestScore = studentResults[0]?.percentage ?? gap?.latestPercentage ?? 75;
      const conceptName = gap?.conceptName || (cId.replace("c-", "").replace("-01", "").toUpperCase());
      const subject = gap?.subjectCode || "Math";

      const isMastered = latestScore >= 80;
      const isGap = latestScore < 60;
      const nodeStatus: "mastered" | "developing" | "gap" | "locked" = isMastered
        ? "mastered"
        : isGap
        ? "gap"
        : "developing";

      const pos = defaultLayoutPositions[idx] || [idx * 0.8 - 1.5, idx % 2 === 0 ? 0.3 : -0.3, 0];
      const nextId = idx < subset.length - 1 ? `node-${subset[idx + 1]}` : undefined;

      return {
        id: `node-${cId}`,
        name: conceptName,
        subject,
        score: latestScore,
        status: nodeStatus,
        reason: gap?.reason,
        baselineScore: gap?.previousPercentage || latestScore,
        position: pos,
        connectedTo: nextId ? [nextId] : undefined,
      };
    });
  }

  // If student has no recorded concepts yet, provide foundational progression nodes
  if (skillNodes.length === 0) {
    skillNodes = [
      {
        id: "node-place-val",
        name: "Place Value 100s",
        subject: "Math",
        score: avgScore || 80,
        status: (avgScore || 80) >= 80 ? "mastered" : "developing",
        position: [-1.8, -0.6, 0],
        connectedTo: ["node-add-sub"],
      },
      {
        id: "node-add-sub",
        name: "Multi-digit Addition",
        subject: "Math",
        score: avgScore ? Math.min(100, avgScore + 5) : 85,
        status: "mastered",
        position: [-1.2, 0.4, 0.4],
      },
    ];
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/students"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A6862] hover:text-[#49352F]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Students</span>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditModal(true)}
            className="rounded-full text-xs bg-white hover:bg-[#F2CAB3] text-[#49352F] border border-[#49352F]/15"
          >
            <Edit className="w-3 h-3 mr-1" />
            <span>Edit Profile</span>
          </Button>
        </div>

        {/* Profile Card Header */}
        <Card variant="glass" className="p-6 border-[#49352F]/15 bg-white text-[#49352F] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F2CAB3] border border-[#49352F]/15 text-[#49352F] flex items-center justify-center font-heading font-black text-2xl shadow-xs shrink-0">
              {student.displayName.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#49352F] tracking-tight">
                  {student.displayName}
                </h1>
                <Badge variant="outline" size="sm">
                  Class {student.grade}-{student.section}
                </Badge>
                {student.id === "std-aarav" && (
                  <Badge variant="saffron" size="sm" pulse>
                    SFIC Gujarat Key Demo
                  </Badge>
                )}
              </div>
              <p className="font-mono text-xs text-[#7A6862]">Roll: {student.studentCode} • Enrolled 2026</p>
              {student.notes && (
                <p className="text-xs text-[#7A6862] max-w-xl italic mt-1">
                  &quot;{student.notes}&quot;
                </p>
              )}
            </div>
          </div>

          {/* Quick Intervention Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditModal(true)}
              className="rounded-full text-xs bg-white hover:bg-[#F2CAB3] text-[#49352F] border border-[#49352F]/15"
            >
              <Edit className="w-3.5 h-3.5 mr-1" />
              <span>Edit Profile</span>
            </Button>

            {divisionActivity && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowActivityModal(true)}
                className="rounded-full text-xs bg-white hover:bg-[#F2CAB3] text-[#49352F] border border-[#49352F]/15"
              >
                <Play className="w-3.5 h-3.5 fill-current mr-1" />
                <span>Practice Activity</span>
              </Button>
            )}

            <div data-tour="student-reassess-form">
              <Button
                variant="saffron"
                size="sm"
                onClick={() =>
                  openReassessment(
                    divisionGap?.conceptId || "c-div-01",
                    divisionGap?.conceptName || "Division Basics",
                    divisionGap?.previousPercentage || 35
                  )
                }
                className="rounded-full text-xs font-black shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Record Reassessment</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* 4 Summary Stat Tiles */}
        <div data-tour="student-scores" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatTile
            label="Average Performance"
            value={avgScore}
            suffix="%"
            icon={TrendingUp}
            variant="indigo"
            description={`Across ${results.length} assessments`}
            sparklineData={[50, 58, 65, 74, avgScore]}
          />

          <StatTile
            label="Active Learning Gaps"
            value={activeGaps.length}
            icon={AlertTriangle}
            variant={activeGaps.length > 0 ? "coral" : "mint"}
            description={activeGaps.length === 0 ? "All concepts mastered!" : "Requires 5-step intervention"}
          />

          <StatTile
            label="Active Remedial Plans"
            value={remedialPlans.length}
            icon={Layers}
            variant="saffron"
            description="5-step manipulatives"
          />

          <StatTile
            label="Activities Completed"
            value={attempts.length}
            icon={Gamepad2}
            variant="mint"
            description="Interactive practice sessions"
          />
        </div>

        {/* Navigation Tabs Bar */}
        <div role="tablist" aria-label="Student details views" className="flex items-center gap-2 border-b border-[#49352F]/10 pb-2 overflow-x-auto">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "skilltree"}
            onClick={() => setActiveTab("skilltree")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "skilltree"
                ? "bg-[#F2CAB3] text-[#49352F] shadow-xs font-black border border-[#49352F]/15"
                : "text-[#7A6862] hover:text-[#49352F] hover:bg-[#FAF6E9]"
            }`}
          >
            3D Skill Tree (Interactive)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "gaps"}
            onClick={() => setActiveTab("gaps")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "gaps"
                ? "bg-[#F2CAB3] text-[#49352F] shadow-xs font-black border border-[#49352F]/15"
                : "text-[#7A6862] hover:text-[#49352F] hover:bg-[#FAF6E9]"
            }`}
          >
            Learning Gaps &amp; The Bridge ({gaps.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "mastery"}
            onClick={() => setActiveTab("mastery")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "mastery"
                ? "bg-[#F2CAB3] text-[#49352F] shadow-xs font-black border border-[#49352F]/15"
                : "text-[#7A6862] hover:text-[#49352F] hover:bg-[#FAF6E9]"
            }`}
          >
            Mastery Analytics
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "history"
                ? "bg-[#F2CAB3] text-[#49352F] shadow-xs font-black border border-[#49352F]/15"
                : "text-[#7A6862] hover:text-[#49352F] hover:bg-[#FAF6E9]"
            }`}
          >
            Assessment History ({results.length})
          </button>
        </div>

        {/* Tab 1: 3D SKILL TREE (Signature Feature) */}
        {activeTab === "skilltree" && (
          <div className="space-y-4">
            <StudentSkillTree3D
              studentName={student.displayName}
              skills={skillNodes}
              onGeneratePlan={() => {
                window.location.href = "/remedial-plans";
              }}
            />
          </div>
        )}

        {/* Tab 2: Learning Gaps & The Bridge */}
        {activeTab === "gaps" && (
          <div className="space-y-4">
            {gaps.length === 0 ? (
              <Card variant="glass" className="p-8 text-center text-[#7A6862] bg-white border-[#49352F]/12">
                No learning gaps recorded for this student.
              </Card>
            ) : (
              gaps.map((gap) => (
                <Card
                  key={gap.id}
                  variant="glass"
                  className="p-5 border-[#49352F]/12 bg-white text-[#49352F] space-y-4 hover:border-[#49352F]/25 transition-all shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-lg font-bold text-[#49352F]">
                          {gap.conceptName}
                        </h3>
                        <Badge
                          variant={
                            gap.priority === "High"
                              ? "high"
                              : gap.priority === "Medium"
                              ? "medium"
                              : "low"
                          }
                          size="sm"
                          dot
                        >
                          {gap.priority} Priority
                        </Badge>
                        <Badge
                          variant={gap.status === "Resolved" ? "completed" : "inProgress"}
                          size="sm"
                        >
                          {gap.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#B26A1B] font-medium">
                        Subject: {gap.subjectName || "Mathematics"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="saffron"
                        size="sm"
                        onClick={() =>
                          openReassessment(
                            gap.conceptId,
                            gap.conceptName,
                            gap.previousPercentage || gap.latestPercentage
                          )
                        }
                        className="rounded-full text-xs font-bold"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        <span>Reassess Delta</span>
                      </Button>

                      <Link
                        href="/remedial-plans"
                        data-tour="student-remedial-btn"
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            window.dispatchEvent(new CustomEvent("shikshasetu_step_plan_generated"));
                          }
                        }}
                      >
                        <Button variant="outline" size="sm" className="rounded-full text-xs bg-white hover:bg-[#F2CAB3] text-[#49352F] border border-[#49352F]/15">
                          <span>5-Step Plan &rarr;</span>
                        </Button>
                      </Link>
                      <ContextualHelp termKey="remedialPlan" />
                    </div>
                  </div>

                  {/* Bridge Progress Visual */}
                  <BridgeProgress
                    score={gap.latestPercentage}
                    previousScore={gap.previousPercentage}
                    studentName={student.displayName}
                    height="md"
                  />

                  {/* Explainable AI Diagnosis */}
                  {gap.reason && (
                    <div data-tour="student-gap-reason" className="p-3 rounded-xl bg-[#FAF6E9] border border-[#49352F]/10 text-xs space-y-1 text-[#49352F]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-[#7A6862] flex items-center gap-1">
                          <BrainCircuit className="w-3.5 h-3.5 text-[#B26A1B]" />
                          Algorithmic Explanation:
                        </span>
                        <ContextualHelp termKey="gapDetection" />
                      </div>
                      <p className="text-[#49352F] leading-relaxed">{gap.reason}</p>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Mastery Analytics */}
        {activeTab === "mastery" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="glass" className="p-5 bg-white border-[#49352F]/12 text-[#49352F] shadow-xs">
              <h3 className="font-heading text-base font-bold text-[#49352F] mb-2">
                Concept Scores Comparison
              </h3>
              <p className="text-xs text-[#7A6862] mb-4">Baseline vs Reassessment %</p>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conceptScoresData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#49352F" opacity={0.1} />
                    <XAxis dataKey="name" tick={{ fill: "#7A6862", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#7A6862", fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FAF6E9",
                        border: "1px solid rgba(73,53,47,0.15)",
                        borderRadius: "12px",
                        color: "#49352F",
                      }}
                    />
                    <Bar dataKey="latest" fill="#2E7D5E" name="Latest Score %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="previous" fill="#F2CAB3" name="Baseline %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card variant="glass" className="p-5 flex flex-col justify-between bg-white border-[#49352F]/12 text-[#49352F] shadow-xs">
              <div>
                <h3 className="font-heading text-base font-bold text-[#49352F] mb-2">
                  Pedagogical Mastery Verdict
                </h3>
                <div className="space-y-3 mt-4 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF6E9] border border-[#49352F]/10">
                    <span className="text-[#7A6862] block font-semibold">Mastery Benchmark</span>
                    <span className="text-lg font-black text-[#2E7D5E]">80% Threshold</span>
                    <p className="text-[11px] text-[#7A6862] mt-0.5">
                      Student demonstrates independent problem-solving without prompt assistance.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF6E9] border border-[#49352F]/10">
                    <span className="text-[#7A6862] block font-semibold">Developing Benchmark</span>
                    <span className="text-lg font-black text-[#B26A1B]">60% Threshold</span>
                    <p className="text-[11px] text-[#7A6862] mt-0.5">
                      Basic conceptual familiarity; requires occasional manipulative or visual aid.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/reports">
                <Button variant="outline" size="sm" className="w-full rounded-xl text-xs mt-4 bg-white hover:bg-[#F2CAB3] text-[#49352F] border border-[#49352F]/15">
                  Generate Printable Report Card &rarr;
                </Button>
              </Link>
            </Card>
          </div>
        )}

        {/* Tab 4: Assessment History */}
        {activeTab === "history" && (
          <Card variant="glass" className="p-5 overflow-x-auto border-[#49352F]/12 bg-white text-[#49352F] shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#49352F]/10 text-[#7A6862]">
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Assessment Title</th>
                  <th className="p-3 font-semibold">Marks</th>
                  <th className="p-3 font-semibold">Percentage</th>
                  <th className="p-3 font-semibold">Mastery Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res) => {
                  const isMastered = res.percentage >= 80;
                  const isGap = res.percentage < 60;
                  return (
                    <tr key={res.id} className="border-b border-[#49352F]/8 hover:bg-[#FAF6E9]/60">
                      <td className="p-3 text-[#7A6862]">
                        {new Date(res.recordedAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-bold text-[#49352F]">{res.assessmentTitle || "Diagnostic Assessment"}</td>
                      <td className="p-3 text-[#7A6862]">
                        {res.marksObtained} / {res.maximumMarks}
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-black ${
                            isMastered
                              ? "text-[#2E7D5E]"
                              : isGap
                              ? "text-[#C54738]"
                              : "text-[#B26A1B]"
                          }`}
                        >
                          {res.percentage}%
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={isMastered ? "mastered" : isGap ? "needsSupport" : "developing"}
                          size="sm"
                          dot
                        >
                          {isMastered ? "Mastered" : isGap ? "Needs Support" : "Developing"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Modals */}
      {showReassessModal && (
        <ReassessmentModal
          isOpen={showReassessModal}
          onClose={() => setShowReassessModal(false)}
          studentId={student.id}
          studentName={student.displayName}
          conceptId={selectedConceptForReassessment?.conceptId || "c-div-01"}
          conceptName={selectedConceptForReassessment?.conceptName || "Division Basics"}
          previousPercentage={selectedConceptForReassessment?.prevPct || 35}
          onSuccess={() => {
            fetchStudentData();
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("shikshasetu_step_reassessed"));
            }
          }}
        />
      )}

      {showActivityModal && (
        <ActivityPlayerModal
          isOpen={showActivityModal}
          onClose={() => setShowActivityModal(false)}
          activity={divisionActivity}
          studentId={student.id}
          studentName={student.displayName}
          onCompleted={() => fetchStudentData()}
        />
      )}

      {showEditModal && (
        <StudentFormModal
          isOpen={showEditModal}
          student={student}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => fetchStudentData()}
        />
      )}

      {/* Guided Tour */}
      <SpotlightTour page="studentDetail" />
    </AppLayout>
  );
}
