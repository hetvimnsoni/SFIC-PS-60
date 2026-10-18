"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { StudentFormModal } from "@/components/student/StudentFormModal";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  ClipboardCheck,
  PlusCircle,
  FileSpreadsheet,
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any>(null);

  // Filters
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [stdRes, gapsRes, plansRes, asmRes, progRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/learning-gaps"),
        fetch("/api/remedial-plans"),
        fetch("/api/assessments"),
        fetch("/api/progress"),
      ]);

      const [stdData, gapsData, plansData, asmData, progData] = await Promise.all([
        stdRes.json(),
        gapsRes.json(),
        plansRes.json(),
        asmRes.json(),
        progRes.json(),
      ]);

      if (stdData.success) setStudents(stdData.students);
      if (gapsData.success) setGaps(gapsData.gaps);
      if (plansData.success) setPlans(plansData.plans);
      if (asmData.success) setAssessments(asmData.assessments);
      if (progData.success) setProgressData(progData);
    } catch (e) {
      console.error("Dashboard fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filtered lists
  const filteredStudents = students.filter((s) => {
    if (selectedClass !== "all" && s.classroomId !== selectedClass) return false;
    return true;
  });

  const filteredGaps = gaps.filter((g) => {
    if (selectedSubject !== "all" && g.subjectCode !== selectedSubject) return false;
    return true;
  });

  // Calculate dynamic metrics
  const totalStudents = filteredStudents.length;
  const activeGaps = filteredGaps.filter((g) => g.status === "Active" || g.status === "Under Intervention");
  const studentsWithGaps = Array.from(new Set(activeGaps.map((g) => g.studentId))).length;
  const completedPlans = plans.filter((p) => p.status === "Completed").length;
  const improvingStudentsCount = progressData?.improvingCount || 2;

  // Chart data 1: Performance by Subject
  const subjectChartData = progressData?.subjectAverages?.map((s: any) => ({
    name: s.code,
    fullName: s.subjectName,
    average: s.averageScore,
  })) || [
    { name: "MATH", average: 65 },
    { name: "ENG", average: 78 },
    { name: "GUJ", average: 82 },
    { name: "EVS", average: 80 },
  ];

  // Chart data 2: Gaps by Concept
  const gapsByConceptMap: Record<string, number> = {};
  activeGaps.forEach((g) => {
    const key = g.conceptName ? g.conceptName.split(" ")[0] : "Other";
    gapsByConceptMap[key] = (gapsByConceptMap[key] || 0) + 1;
  });
  const gapDistributionData = Object.keys(gapsByConceptMap).map((k) => ({
    concept: k,
    gapsCount: gapsByConceptMap[k],
  }));

  // Chart data 3: Trend data
  const progressTrendData = [
    { period: "Baseline (W1)", score: 48 },
    { period: "Intervention (W2)", score: 56 },
    { period: "Practice (W3)", score: 68 },
    { period: "Reassessment (W4)", score: 82 },
  ];

  // Colors for charts
  const PIE_COLORS = ["#312E81", "#4338CA", "#059669", "#D97706", "#DC2626"];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.dashboard.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.dashboard.subtitle}
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedClass}
              aria-label="Filter dashboard by class"
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs outline-hidden cursor-pointer"
            >
              <option value="all">{t.dashboard.allClasses}</option>
              <option value="cls-3a">Class 3-A</option>
              <option value="cls-4a">Class 4-A</option>
              <option value="cls-5a">Class 5-A</option>
            </select>

            <select
              value={selectedSubject}
              aria-label="Filter dashboard by subject"
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs outline-hidden cursor-pointer"
            >
              <option value="all">{t.dashboard.allSubjects}</option>
              <option value="MATH">Mathematics</option>
              <option value="ENG">English</option>
              <option value="GUJ">Gujarati</option>
              <option value="EVS">EVS</option>
            </select>

            <button
              type="button"
              onClick={() => setShowAddStudentModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.actions.addStudent}</span>
            </button>
          </div>
        </div>

        {/* 5 Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Total Students */}
          <Card className="border-l-4 border-l-indigo-600">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                {t.dashboard.totalStudents}
              </span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalStudents}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Enrolled across 3 grades</span>
          </Card>

          {/* Card 2: Students Requiring Support */}
          <Card className="border-l-4 border-l-rose-500">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-700">
                {t.dashboard.studentsRequiringSupport}
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-rose-600">
              {studentsWithGaps}
            </div>
            <span className="text-[11px] text-rose-600/80 mt-1 block font-medium">
              Flagged by Gap Engine
            </span>
          </Card>

          {/* Card 3: Active Learning Gaps */}
          <Card className="border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                {t.dashboard.activeLearningGaps}
              </span>
              <Layers className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-600">
              {activeGaps.length}
            </div>
            <span className="text-[11px] text-amber-600/80 mt-1 block font-medium">
              Concept-level alerts
            </span>
          </Card>

          {/* Card 4: Students Improving */}
          <Card className="border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                {t.dashboard.studentsImproving}
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {improvingStudentsCount}
            </div>
            <span className="text-[11px] text-emerald-600/80 mt-1 block font-medium">
              Positive percentage-point delta
            </span>
          </Card>

          {/* Card 5: Completed Plans */}
          <Card className="border-l-4 border-l-purple-500 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-700">
                {t.dashboard.completedRemedialPlans}
              </span>
              <ClipboardCheck className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-purple-600">
              {completedPlans}
            </div>
            <span className="text-[11px] text-purple-600/80 mt-1 block font-medium">
              Verified interventions
            </span>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Subject Proficiency */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{t.dashboard.performanceBySubject}</CardTitle>
                <CardDescription>Average percentage mastery across primary curriculum</CardDescription>
              </div>
              <Badge variant="outline" size="sm">Operational Data</Badge>
            </CardHeader>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, "Average Score"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                  />
                  <Bar dataKey="average" fill="#312E81" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 2: Learning Progress Trend */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{t.dashboard.progressTrend}</CardTitle>
                <CardDescription>Demonstration intervention progression over time</CardDescription>
              </div>
              <span className="text-xs font-bold text-emerald-600">+34 pp gain</span>
            </CardHeader>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, "Average Score"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#059669" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Dashboard Sections: Students Requiring Attention & Recent Assessments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section 1: Students Requiring Immediate Attention (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="text-rose-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>{t.dashboard.attentionListTitle}</span>
                  </CardTitle>
                  <CardDescription>Students with flagged concept gaps below 60% mastery</CardDescription>
                </div>
                <Link
                  href="/learning-gaps"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View All Gaps →
                </Link>
              </CardHeader>

              <div className="divide-y divide-slate-100">
                {activeGaps.slice(0, 4).map((gap) => (
                  <div key={gap.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/students/${gap.studentId}`}
                          className="font-bold text-sm text-slate-900 hover:text-indigo-600"
                        >
                          {gap.studentName}
                        </Link>
                        <span className="text-xs text-slate-400">Class {gap.grade}-A</span>
                        <Badge
                          variant={gap.priority === "High" ? "high" : "medium"}
                          size="sm"
                        >
                          {gap.priority} Priority
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        Concept: <span className="font-semibold text-slate-800">{gap.conceptName}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                        &quot;{gap.reason}&quot;
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <div className="text-right mr-2">
                        <div className="text-xs font-bold text-rose-600">{gap.latestPercentage}%</div>
                        <div className="text-[10px] text-slate-400">Latest Score</div>
                      </div>
                      <Link
                        href={`/students/${gap.studentId}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
                      >
                        Remediate →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/assessments/new"
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-center transition-all shadow-2xs group"
              >
                <FileSpreadsheet className="w-5 h-5 mx-auto text-indigo-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 block mt-2">New Assessment</span>
              </Link>
              <Link
                href="/remedial-plans"
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-center transition-all shadow-2xs group"
              >
                <ClipboardCheck className="w-5 h-5 mx-auto text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 block mt-2">Remedial Plans</span>
              </Link>
              <Link
                href="/activities"
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-center transition-all shadow-2xs group"
              >
                <BookOpen className="w-5 h-5 mx-auto text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 block mt-2">Practice Bank</span>
              </Link>
              <Link
                href="/reports"
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-center transition-all shadow-2xs group"
              >
                <TrendingUp className="w-5 h-5 mx-auto text-amber-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800 block mt-2">Progress Reports</span>
              </Link>
            </div>
          </div>

          {/* Section 2: Recent Assessments & Next Actions (1 col) */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">
                    {t.dashboard.recentAssessmentsTitle}
                  </CardTitle>
                  <CardDescription>Recently recorded evaluations</CardDescription>
                </div>
                <Link href="/assessments" className="text-xs font-semibold text-indigo-600">
                  All →
                </Link>
              </CardHeader>
              <div className="space-y-3">
                {assessments.slice(0, 3).map((asm) => (
                  <div key={asm.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span className="line-clamp-1">{asm.title}</span>
                      <Badge variant="default" size="sm">{asm.subjectCode}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{asm.assessmentDate}</span>
                      </span>
                      <span>Max: {asm.maxMarks} marks</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50/60 to-purple-50/40 border-indigo-100">
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-2">
                {t.dashboard.recommendedNextActions}
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Review Aarav Patel&apos;s division token-sharing session notes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Assign Class 3-A place value worksheet before Friday.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      <StudentFormModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        onSuccess={fetchDashboardData}
      />
    </AppLayout>
  );
}
