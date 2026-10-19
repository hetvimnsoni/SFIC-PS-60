"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatTile } from "@/components/ui/StatTile";
import { BridgeProgress } from "@/components/ui/BridgeProgress";
import { ClassMasteryHeatmap3D, StudentMasteryPoint } from "@/components/3d/ClassMasteryHeatmap3D";
import { fireCelebrationConfetti } from "@/lib/confetti";
import { useLanguage } from "@/context/LanguageContext";
import { useFilter } from "@/context/FilterContext";
import { StudentFormModal } from "@/components/student/StudentFormModal";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  ClipboardCheck,
  ClipboardList,
  PlusCircle,
  FileSpreadsheet,
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Bot,
  PartyPopper,
  Flame,
} from "lucide-react";
import { AiWorkspaceView, AiTab } from "@/components/ai/AiWorkspaceView";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const { t, language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any>(null);

  // Filters
  const { selectedClass, setSelectedClass } = useFilter();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [dashboardView, setDashboardView] = useState<"overview" | "ai">("overview");
  const [aiTab, setAiTab] = useState<AiTab>("tutor");
  const [hasCelebrated, setHasCelebrated] = useState(false);

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

  const handleCelebrate = () => {
    fireCelebrationConfetti();
    setHasCelebrated(true);
    setTimeout(() => setHasCelebrated(false), 5000);
  };

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
  const totalStudents = filteredStudents.length || 15;
  const activeGaps = filteredGaps.filter(
    (g) => g.status === "Active" || g.status === "Under Intervention"
  );
  const studentsWithGaps = Array.from(new Set(activeGaps.map((g) => g.studentId))).length || 4;
  const activePlansCount = plans.filter((p) => p.status === "In Progress" || p.status === "Active").length || 3;
  const completedPlansCount = plans.filter((p) => p.status === "Completed").length || 1;

  // 3D Heatmap Dataset
  const heatmapStudents = ["Aarav Patel", "Pooja Sharma", "Karan Mehta", "Diya Joshi", "Dev Solanki"];
  const heatmapConcepts = ["Division Basics", "Fractions", "Vowel Blends", "Place Value 100s"];
  const heatmapData: StudentMasteryPoint[] = [
    { studentName: "Aarav Patel", conceptName: "Division Basics", score: 85 }, // Reassessed
    { studentName: "Aarav Patel", conceptName: "Fractions", score: 72 },
    { studentName: "Aarav Patel", conceptName: "Vowel Blends", score: 88 },
    { studentName: "Aarav Patel", conceptName: "Place Value 100s", score: 90 },

    { studentName: "Pooja Sharma", conceptName: "Division Basics", score: 65 },
    { studentName: "Pooja Sharma", conceptName: "Fractions", score: 60 },
    { studentName: "Pooja Sharma", conceptName: "Vowel Blends", score: 42 }, // Gap
    { studentName: "Pooja Sharma", conceptName: "Place Value 100s", score: 75 },

    { studentName: "Karan Mehta", conceptName: "Division Basics", score: 78 },
    { studentName: "Karan Mehta", conceptName: "Fractions", score: 48 }, // Gap
    { studentName: "Karan Mehta", conceptName: "Vowel Blends", score: 82 },
    { studentName: "Karan Mehta", conceptName: "Place Value 100s", score: 80 },

    { studentName: "Diya Joshi", conceptName: "Division Basics", score: 82 },
    { studentName: "Diya Joshi", conceptName: "Fractions", score: 74 },
    { studentName: "Diya Joshi", conceptName: "Vowel Blends", score: 52 }, // Gap
    { studentName: "Diya Joshi", conceptName: "Place Value 100s", score: 85 },

    { studentName: "Dev Solanki", conceptName: "Division Basics", score: 70 },
    { studentName: "Dev Solanki", conceptName: "Fractions", score: 62 },
    { studentName: "Dev Solanki", conceptName: "Vowel Blends", score: 80 },
    { studentName: "Dev Solanki", conceptName: "Place Value 100s", score: 55 }, // Gap
  ];

  // Curriculum Proficiency Chart Data
  const curriculumData = [
    { subject: "Math", score: 72, baseline: 54 },
    { subject: "Gujarati", score: 78, baseline: 62 },
    { subject: "English", score: 84, baseline: 70 },
    { subject: "EVS", score: 82, baseline: 68 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {language === "gu" ? "શિક્ષક ડેશબોર્ડ" : "Teacher Command Center"}
              </h1>
              <Badge variant="saffron" size="sm" pulse>
                PS-60 Live
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === "gu"
                ? "પ્રાથમિક શાળાના વિદ્યાર્થીઓની લર્નિંગ ગેપ્સ અને ૫-પગલાંની ઉપચારાત્મક પ્રગતિ."
                : "Tracking student learning gap detection, 5-step concrete manipulatives, and reassessment deltas."}
            </p>
          </div>

          {/* View Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800/90 p-1 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setDashboardView("overview")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  dashboardView === "overview"
                    ? "bg-amber-500 text-slate-950 shadow-sm font-black"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setDashboardView("ai")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  dashboardView === "ai"
                    ? "bg-indigo-600 text-white shadow-sm font-black"
                    : "text-indigo-600 dark:text-amber-400 hover:underline"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Workspace</span>
              </button>
            </div>

            <select
              value={selectedClass}
              aria-label="Filter dashboard by class"
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs outline-hidden cursor-pointer"
            >
              <option value="all">{t.dashboard.allClasses}</option>
              <option value="cls-3a">Class 3-A</option>
              <option value="cls-4a">Class 4-A</option>
              <option value="cls-5a">Class 5-A</option>
            </select>

            <Button
              variant="saffron"
              size="sm"
              onClick={() => setShowAddStudentModal(true)}
              className="rounded-full text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              <span>{t.actions.addStudent}</span>
            </Button>
          </div>
        </div>

        {dashboardView === "ai" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setDashboardView("overview")}
                className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                &larr; Back to Classroom Overview
              </button>
              <Link href="/ai" className="text-xs text-slate-400 hover:text-slate-200 font-medium">
                Open in Fullscreen Mode &rarr;
              </Link>
            </div>
            <AiWorkspaceView defaultTab={aiTab} embedded />
          </div>
        ) : (
          <>
            {/* 1. KPI Stat Tiles Row with Sparklines */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatTile
                label="Total Enrolled"
                value={totalStudents}
                icon={Users}
                variant="indigo"
                description="Classes 3, 4 & 5"
                sparklineData={[12, 13, 14, 15, 15]}
              />

              <StatTile
                label="Need Support"
                value={studentsWithGaps}
                icon={AlertTriangle}
                variant="coral"
                description="Score < 60% threshold"
                sparklineData={[6, 5, 5, 4, 4]}
                change={{ value: "-20%", trend: "down", label: "gaps closing" }}
              />

              <StatTile
                label="Active Plans"
                value={activePlansCount}
                icon={Layers}
                variant="saffron"
                description="5-step manipulatives"
                sparklineData={[1, 2, 3, 3, 3]}
              />

              <StatTile
                label="Reassessed Gain"
                value="+50 pp"
                icon={TrendingUp}
                variant="mint"
                description="Aarav: 35% -> 85%"
                sparklineData={[35, 45, 60, 75, 85]}
                change={{ value: "+50 pp", trend: "up", label: "mastery breakthrough" }}
              />
            </div>

            {/* 2. Recent Reassessment Wins Banner with Confetti */}
            <Card
              variant="glass"
              className="p-5 sm:p-6 border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-emerald-500/10 relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Pedagogical Win
                    </span>
                    <Badge variant="mint" size="sm">
                      Mastery Verified
                    </Badge>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    Aarav Patel (Class 4A) Crosses The Bridge: 35% &rarr; 85% (+50 pp)
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Following 5-step concrete division remediation with counters and number line worksheets, Aarav mastered equal sharing with remainders during formative reassessment.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    variant="saffron"
                    size="sm"
                    onClick={handleCelebrate}
                    className="rounded-full shadow-lg shadow-amber-500/20 text-xs px-4"
                  >
                    <PartyPopper className="w-4 h-4 mr-1.5" />
                    <span>{hasCelebrated ? "Celebrated! 🎉" : "Celebrate Win 🎉"}</span>
                  </Button>

                  <Link href="/students/std-aarav">
                    <Button variant="outline" size="sm" className="rounded-full text-xs">
                      Inspect Aarav &rarr;
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Aarav's Glowing Bridge Progress */}
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <BridgeProgress
                  score={85}
                  previousScore={35}
                  studentName="Aarav Patel"
                  height="md"
                />
              </div>
            </Card>

            {/* 3. Main Grid: 3D Class Mastery Heatmap & Curriculum Proficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 3D Class Mastery Heatmap (2 cols on lg) */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                      Class Mastery Heatmap (Students × Concepts)
                    </h3>
                    <Badge variant="saffron" size="sm">
                      Interactive 3D
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Drag to rotate 3D view
                  </span>
                </div>

                {/* 3D Heatmap Canvas Component */}
                <ClassMasteryHeatmap3D
                  data={heatmapData}
                  students={heatmapStudents}
                  concepts={heatmapConcepts}
                />
              </div>

              {/* Curriculum Proficiency Chart */}
              <Card variant="glass" className="p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                    Subject Proficiency
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Current cohort average vs baseline
                  </p>

                  <div className="h-[220px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={curriculumData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #334155",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="score" fill="#3DDBA9" radius={[6, 6, 0, 0]} name="Current Score" />
                        <Bar dataKey="baseline" fill="#FF8A3D" radius={[6, 6, 0, 0]} name="Baseline" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#3DDBA9]" />
                    <span>Current %</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#FF8A3D]" />
                    <span>Baseline %</span>
                  </div>
                  <Link href="/reports" className="text-amber-400 hover:underline font-bold">
                    Full Reports &rarr;
                  </Link>
                </div>
              </Card>
            </div>

            {/* 4. Immediate Attention Student List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                    Immediate Attention Required
                  </h3>
                  <p className="text-xs text-slate-400">
                    Students flagged below the 60% developing threshold needing active intervention
                  </p>
                </div>
                <Link href="/learning-gaps">
                  <Button variant="outline" size="sm" className="rounded-full text-xs">
                    View All Gaps &rarr;
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {[
                  {
                    id: "std-pooja",
                    name: "Pooja Sharma",
                    class: "Class 3-A",
                    subject: "Gujarati",
                    concept: "Vowel Blends (જોડાક્ષર)",
                    score: 42,
                    priority: "High",
                    reason: "Consistently misses consonant-vowel combinations during dictation.",
                    suggestedAction: "Step 2: Tactile Gujarati letter cards with pictorial word association.",
                  },
                  {
                    id: "std-karan",
                    name: "Karan Mehta",
                    class: "Class 5-A",
                    subject: "Mathematics",
                    concept: "Fractions Addition",
                    score: 48,
                    priority: "High",
                    reason: "Directly adds denominators (1/2 + 1/4 = 2/6) without finding common base.",
                    suggestedAction: "Step 2: Fraction strips and circle cutouts for physical equivalence.",
                  },
                  {
                    id: "std-diya",
                    name: "Diya Joshi",
                    class: "Class 4-A",
                    subject: "Gujarati",
                    concept: "Reading Comprehension",
                    score: 52,
                    priority: "Medium",
                    reason: "Decodes single words accurately but loses context in compound sentences.",
                    suggestedAction: "Step 3: Guided paired reading with comprehension question prompts.",
                  },
                  {
                    id: "std-dev",
                    name: "Dev Solanki",
                    class: "Class 3-A",
                    subject: "Mathematics",
                    concept: "Place Value 100s",
                    score: 55,
                    priority: "Medium",
                    reason: "Reverses tens and units column during borrowing in subtraction.",
                    suggestedAction: "Step 2: Dienes blocks (bundles of 10 and 100s) for regrouping.",
                  },
                ].map((item) => (
                  <Card
                    key={item.id}
                    variant="glass"
                    className="p-4 space-y-3 border-slate-800 hover:border-amber-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 font-heading font-black text-sm flex items-center justify-center shrink-0">
                          {item.score}%
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{item.name}</h4>
                            <span className="text-[11px] text-slate-400 font-medium">{item.class}</span>
                          </div>
                          <p className="text-xs text-amber-400 font-medium mt-0.5">
                            {item.subject} • {item.concept}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant={item.priority === "High" ? "high" : "medium"}
                        size="sm"
                        dot
                      >
                        {item.priority} Priority
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Why Flagged:</span>
                      {item.reason}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] text-slate-400 truncate max-w-[220px]">
                        {item.suggestedAction}
                      </span>
                      <Link href="/remedial-plans">
                        <Button variant="saffron" size="sm" className="rounded-full text-xs h-7 px-3">
                          Generate Plan &rarr;
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <StudentFormModal
          isOpen={showAddStudentModal}
          onClose={() => setShowAddStudentModal(false)}
          onSuccess={() => {
            setShowAddStudentModal(false);
            fetchDashboardData();
          }}
        />
      )}
    </AppLayout>
  );
}
