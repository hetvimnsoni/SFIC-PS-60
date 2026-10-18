"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { ReassessmentModal } from "@/components/assessment/ReassessmentModal";
import { ActivityPlayerModal } from "@/components/activities/ActivityPlayerModal";
import { StudentFormModal } from "@/components/student/StudentFormModal";
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

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLanguage();

  const [student, setStudent] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [remedialPlans, setRemedialPlans] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active tab
  const [activeTab, setActiveTab] = useState<"gaps" | "mastery" | "history" | "plans">("gaps");

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
  }, [id]);

  if (loading && !student) {
    return (
      <AppLayout>
        <div className="py-12 text-center text-xs font-semibold text-slate-500">
          Loading student learning profile...
        </div>
      </AppLayout>
    );
  }

  if (!student) {
    return (
      <AppLayout>
        <div className="py-12 text-center space-y-3">
          <p className="text-base font-bold text-slate-900">Student not found</p>
          <Link href="/students" className="text-xs font-semibold text-indigo-600">
            ← Back to Student Directory
          </Link>
        </div>
      </AppLayout>
    );
  }

  const activeGaps = gaps.filter((g) => g.status === "Active" || g.status === "Under Intervention");
  const resolvedGaps = gaps.filter((g) => g.status === "Resolved");
  const divisionGap = gaps.find((g) => g.conceptId === "c-div-01");
  const divisionActivity = activities.find((a) => a.conceptId === "c-div-01") || activities[0];

  // Calculate overall student average
  const totalScore = results.reduce((acc, curr) => acc + curr.percentage, 0);
  const avgScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;

  // Chart data for concept mastery
  const conceptScoresData = gaps.map((g) => ({
    name: g.conceptName.split(" ")[0],
    latest: g.latestPercentage,
    previous: g.previousPercentage || g.latestPercentage,
  }));

  const openReassessment = (conceptId: string, conceptName: string, prevPct: number) => {
    setSelectedConceptForReassessment({ conceptId, conceptName, prevPct });
    setShowReassessModal(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/students"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Students</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
          >
            <Edit className="w-3 h-3" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0">
              {student.displayName.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {student.displayName}
                </h1>
                <Badge variant="outline" size="sm">
                  Class {student.grade}-{student.section}
                </Badge>
                {student.id === "std-aarav" && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>SFIC Key Demo Student</span>
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-slate-400">Roll: {student.studentCode}</p>
              {student.notes && (
                <p className="text-xs text-slate-600 max-w-xl italic mt-1">
                  &quot;{student.notes}&quot;
                </p>
              )}
            </div>
          </div>

          {/* Quick Intervention Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            {divisionActivity && (
              <button
                type="button"
                onClick={() => setShowActivityModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Practice Activity</span>
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                openReassessment(
                  divisionGap?.conceptId || "c-div-01",
                  divisionGap?.conceptName || "Division Basics",
                  divisionGap?.latestPercentage || 35
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Record Reassessment</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Average Performance
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{avgScore}%</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Across {results.length} tests</span>
          </Card>

          <Card>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-700">
              Active Learning Gaps
            </div>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">{activeGaps.length}</div>
            <span className="text-[11px] text-rose-600/80 mt-1 block">
              {activeGaps.length === 0 ? "All concepts mastered!" : "Requires intervention"}
            </span>
          </Card>

          <Card>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-purple-700">
              Active Remedial Plans
            </div>
            <div className="text-2xl font-extrabold text-purple-600 mt-1">{remedialPlans.length}</div>
            <span className="text-[11px] text-purple-600/80 mt-1 block">Targeted curricula</span>
          </Card>

          <Card>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Activities Completed
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{attempts.length}</div>
            <span className="text-[11px] text-emerald-600/80 mt-1 block">Practice attempts</span>
          </Card>
        </div>

        {/* Tabs Bar */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-6">
            <button
              type="button"
              onClick={() => setActiveTab("gaps")}
              className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "gaps"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Learning Gaps & Remediation ({gaps.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mastery")}
              className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "mastery"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Concept Mastery & Progress Chart
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "history"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Assessment History ({results.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("plans")}
              className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "plans"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Remedial Plans ({remedialPlans.length})
            </button>
          </nav>
        </div>

        {/* Tab 1: Learning Gaps & Remediation */}
        {activeTab === "gaps" && (
          <div className="space-y-4">
            {gaps.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white border border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-900">No Learning Gaps Detected</p>
                <p className="text-xs text-slate-500 mt-1">
                  All recorded assessments are meeting or exceeding operational mastery thresholds.
                </p>
              </div>
            ) : (
              gaps.map((gap) => {
                const plan = remedialPlans.find((p) => p.conceptId === gap.conceptId);
                const isMastered = gap.masteryStatus === "Mastered";

                return (
                  <Card
                    key={gap.id}
                    className={
                      isMastered
                        ? "border-l-4 border-l-emerald-500 bg-emerald-50/20"
                        : "border-l-4 border-l-rose-500"
                    }
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">
                            {gap.conceptName}
                          </h3>
                          <Badge
                            variant={
                              isMastered
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

                        {/* Explainable Gap Detection Reason Box */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <span className="font-semibold text-indigo-900 block mb-0.5">
                            Transparent Gap Detection Reasoning:
                          </span>
                          <p className="text-slate-700 italic">&quot;{gap.reason}&quot;</p>
                        </div>

                        {/* Telemetry row */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                          <span>Attempts recorded: <strong>{gap.attemptsCount}</strong></span>
                          <span>Latest Score: <strong className={isMastered ? "text-emerald-600" : "text-rose-600"}>{gap.latestPercentage}%</strong></span>
                          {gap.previousPercentage !== undefined && (
                            <span>Baseline: <strong>{gap.previousPercentage}%</strong></span>
                          )}
                          {gap.deltaPercentagePoints !== undefined && (
                            <span className="font-bold text-emerald-600">
                              Gain: +{gap.deltaPercentagePoints} pp
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            openReassessment(gap.conceptId, gap.conceptName, gap.latestPercentage)
                          }
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Record Reassessment
                        </button>
                        {divisionActivity && (
                          <button
                            type="button"
                            onClick={() => setShowActivityModal(true)}
                            className="px-4 py-2 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Practice Quiz
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Associated Remedial Plan Details if present */}
                    {plan && (
                      <div className="mt-4 pt-4 border-t border-slate-100 bg-indigo-50/30 -mx-5 -mb-5 p-5 rounded-b-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                            <ClipboardList className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Prescribed Remedial Intervention</span>
                          </span>
                          <Badge variant={plan.status === "Approved" ? "approved" : "inProgress"} size="sm">
                            {plan.status}
                          </Badge>
                        </div>

                        <p className="text-xs font-semibold text-slate-800">
                          Objective: <span className="font-normal text-slate-700">{plan.learningObjective}</span>
                        </p>

                        <div className="mt-2 text-xs text-slate-600">
                          <strong>Required Materials:</strong> {plan.requiredMaterials.join(", ")}
                        </div>

                        {/* 5-step curriculum */}
                        <div className="mt-3 space-y-1.5">
                          {plan.steps.map((st: any) => (
                            <div key={st.stepNumber} className="flex items-start gap-2 text-xs">
                              <span className="w-4 h-4 rounded-full bg-indigo-200 text-indigo-900 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {st.stepNumber}
                              </span>
                              <div>
                                <strong className="text-slate-800">{st.title}:</strong>{" "}
                                <span className="text-slate-600">{st.description}</span>{" "}
                                <span className="text-[10px] text-slate-400">({st.durationMinutes} mins)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Concept Mastery & Progress Chart */}
        {activeTab === "mastery" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Concept Scores & Before/After Comparison</CardTitle>
                  <CardDescription>
                    Visualizing baseline vs reassessment performance per concept
                  </CardDescription>
                </div>
              </CardHeader>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conceptScoresData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, "Score"]}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                    />
                    <Bar dataKey="previous" fill="#94A3B8" name="Initial Baseline" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="latest" fill="#312E81" name="Latest Score" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 3: Assessment History */}
        {activeTab === "history" && (
          <Card>
            <CardHeader>
              <CardTitle>Recorded Assessment History</CardTitle>
              <CardDescription>
                All concept-level evaluations recorded chronologically
              </CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Concept</th>
                    <th className="p-3">Marks</th>
                    <th className="p-3">Percentage</th>
                    <th className="p-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-medium text-slate-600">
                        {new Date(r.recordedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{r.conceptId}</td>
                      <td className="p-3 font-bold">{r.marksObtained} / {r.maximumMarks}</td>
                      <td className="p-3">
                        <Badge
                          variant={
                            r.percentage >= 80
                              ? "mastered"
                              : r.percentage >= 60
                              ? "developing"
                              : "needsSupport"
                          }
                          size="sm"
                        >
                          {r.percentage}%
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-500 italic">{r.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Tab 4: Remedial Plans */}
        {activeTab === "plans" && (
          <div className="space-y-4">
            {remedialPlans.map((plan) => (
              <Card key={plan.id}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{plan.conceptName}</h3>
                    <p className="text-xs text-slate-500">Plan ID: {plan.id}</p>
                  </div>
                  <Badge variant="approved">{plan.status}</Badge>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <p><strong>Learning Objective:</strong> {plan.learningObjective}</p>
                  <p><strong>Teacher Instructions:</strong> {plan.teacherInstructions}</p>
                  <p><strong>Estimated Session Time:</strong> {plan.estimatedMinutes} minutes</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reassessment Modal */}
      {selectedConceptForReassessment && (
        <ReassessmentModal
          isOpen={showReassessModal}
          onClose={() => setShowReassessModal(false)}
          studentId={student.id}
          studentName={student.displayName}
          conceptId={selectedConceptForReassessment.conceptId}
          conceptName={selectedConceptForReassessment.conceptName}
          previousPercentage={selectedConceptForReassessment.prevPct}
          onSuccess={fetchStudentData}
        />
      )}

      {/* Interactive Practice Activity Player Modal */}
      <ActivityPlayerModal
        activity={divisionActivity}
        studentId={student.id}
        studentName={student.displayName}
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        onCompleted={fetchStudentData}
      />

      {/* Edit Student Modal */}
      <StudentFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        student={student}
        onSuccess={fetchStudentData}
      />
    </AppLayout>
  );
}
