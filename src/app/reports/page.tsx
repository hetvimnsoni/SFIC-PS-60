"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import {
  FileText,
  Printer,
  Download,
  Users,
  Award,
  Sparkles,
  Building,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function ReportsPage() {
  const { t } = useLanguage();

  const [reportType, setReportType] = useState<
    "student" | "classGap" | "subject" | "parentSummary"
  >("student");
  const [selectedStudentId, setSelectedStudentId] = useState("std-aarav");
  const [students, setStudents] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resStd, resGaps, resPlans, resAsm] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/learning-gaps"),
          fetch("/api/remedial-plans"),
          fetch("/api/assessments"),
        ]);
        const [dataStd, dataGaps, dataPlans, dataAsm] = await Promise.all([
          resStd.json(),
          resGaps.json(),
          resPlans.json(),
          resAsm.json(),
        ]);

        if (dataStd.success) setStudents(dataStd.students || []);
        if (dataGaps.success) setGaps(dataGaps.gaps || []);
        if (dataPlans.success) setPlans(dataPlans.plans || []);
      } catch (e) {
        console.error("Failed to load report data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentGaps = gaps.filter((g) => g.studentId === selectedStudent?.id);
  const studentPlans = plans.filter((p) => p.studentId === selectedStudent?.id);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = ["Student", "Code", "Class", "Concept", "LatestScore", "Status", "Priority"];
    const rows = gaps.map((g) => [
      `"${g.studentName}"`,
      g.studentId,
      `Class ${g.grade}-A`,
      `"${g.conceptName}"`,
      `${g.latestPercentage}%`,
      g.masteryStatus,
      g.priority,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shikshasetu_learning_gaps_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header - Hidden on Print */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Reports, Audit Summaries & Worksheets
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Printable official progress cards, parent-friendly learning summaries, and CSV data exports.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.actions.exportCsv}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.actions.printReport}</span>
            </button>
          </div>
        </div>

        {/* Report Type Selector & Student Chooser - Hidden on Print */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setReportType("student")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                reportType === "student"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Individual Student Report
            </button>
            <button
              type="button"
              onClick={() => setReportType("parentSummary")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                reportType === "parentSummary"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Parent-Friendly Summary
            </button>
            <button
              type="button"
              onClick={() => setReportType("classGap")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                reportType === "classGap"
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Class Learning-Gap Audit
            </button>
          </div>

          {(reportType === "student" || reportType === "parentSummary") && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Student:</span>
              <select
                value={selectedStudentId}
                aria-label="Select student for report"
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-hidden cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.displayName} (Class {s.grade}-{s.section})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* REPORT CANVAS (PRINT FRIENDLY) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm print:border-none print:shadow-none print:p-0">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-white flex items-center justify-center font-bold text-xl print:border print:border-slate-900 shrink-0">
                SS
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight uppercase">
                  Model Primary School, Gandhinagar
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Gujarat State Primary Education Department • SFIC System PS-60
                </p>
                <p className="text-[11px] text-slate-400">
                  School Code: GUJ-GNR-042 • Academic Year: 2026–27
                </p>
              </div>
            </div>

            <div className="text-right">
              <Badge variant="outline" size="md">
                Official Report
              </Badge>
              <div className="text-[11px] text-slate-500 mt-1">
                Generated: {new Date().toLocaleDateString("en-IN")}
              </div>
            </div>
          </div>

          {/* REPORT 1: INDIVIDUAL STUDENT REPORT */}
          {reportType === "student" && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                    Student Name
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {selectedStudent?.displayName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                    Roll Code
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-800">
                    {selectedStudent?.studentCode}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                    Class & Section
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    Class {selectedStudent?.grade} - Section {selectedStudent?.section}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                    Status
                  </span>
                  <span className="text-sm font-bold text-emerald-600">Active Enrollment</span>
                </div>
              </div>

              {/* Learning Gaps Overview */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Concept Mastery & Detected Learning Gaps
                </h3>
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Concept</th>
                        <th className="p-3">Latest Score</th>
                        <th className="p-3">Mastery Status</th>
                        <th className="p-3">Diagnostic Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentGaps.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-400">
                            No learning gaps currently flagged. Student is demonstrating expected mastery.
                          </td>
                        </tr>
                      ) : (
                        studentGaps.map((g) => (
                          <tr key={g.id}>
                            <td className="p-3 font-semibold text-slate-900">{g.conceptName}</td>
                            <td className="p-3 font-bold text-slate-800">{g.latestPercentage}%</td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  g.masteryStatus === "Mastered"
                                    ? "mastered"
                                    : g.masteryStatus === "Developing"
                                    ? "developing"
                                    : "needsSupport"
                                }
                                size="sm"
                              >
                                {g.masteryStatus}
                              </Badge>
                            </td>
                            <td className="p-3 text-slate-600 italic">{g.reason}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Remedial Interventions Prescribed */}
              {studentPlans.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Prescribed Targeted Remediation
                  </h3>
                  {studentPlans.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-950 text-sm">{p.conceptName}</span>
                        <Badge variant="approved" size="sm">{p.status}</Badge>
                      </div>
                      <p><strong>Objective:</strong> {p.learningObjective}</p>
                      <p><strong>Required Materials:</strong> {p.requiredMaterials?.join(", ")}</p>
                      <p><strong>Reassessment Criteria:</strong> {p.reassessmentCriteria}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REPORT 2: PARENT FRIENDLY SUMMARY */}
          {reportType === "parentSummary" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200">
                <h3 className="text-base font-bold text-amber-950">
                  Dear Parents / Guardians of {selectedStudent?.displayName},
                </h3>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                  At Model Primary School, we use ShikshaSetu AI to understand each child&apos;s individual learning style and ensure no fundamental concepts are missed. This summary highlights what your child does well and simple, fun ways you can support them at home.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                  <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Areas of Strength & Growth</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-700 ml-4 list-disc">
                    <li>Active classroom participation and creative problem-solving.</li>
                    <li>Strong curiosity during science, environmental, and storytelling lessons.</li>
                    <li>Shows steady improvement when working with visual diagrams and hands-on objects.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                  <h4 className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Concepts Currently Practicing</span>
                  </h4>
                  {studentGaps.map((g) => (
                    <div key={g.id} className="p-2 rounded-xl bg-white border border-indigo-100">
                      <span className="font-bold text-slate-800">{g.conceptName}</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Focus: Practicing equal grouping using everyday objects like spoons, buttons, or beads.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <span className="font-bold text-slate-900">Recommended Home Activities:</span>
                <p className="text-slate-600">
                  • Spend 10 minutes sharing snacks (e.g. 12 biscuits among 3 family members) to reinforce division as equal sharing.
                </p>
                <p className="text-slate-600">
                  • Encourage daily 15-minute Gujarati and English bedtime story reading.
                </p>
              </div>
            </div>
          )}

          {/* REPORT 3: CLASS GAP AUDIT */}
          {reportType === "classGap" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-600 pb-2">
                <span className="font-bold">Total Flagged Learning Gaps across Class 4-A: {gaps.length}</span>
                <span>Configured Mastery Threshold: 80%</span>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Student</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Concept</th>
                      <th className="p-3">Latest %</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {gaps.map((g) => (
                      <tr key={g.id}>
                        <td className="p-3 font-bold text-slate-900">{g.studentName}</td>
                        <td className="p-3 font-mono">{g.subjectCode}</td>
                        <td className="p-3 font-semibold text-slate-800">{g.conceptName}</td>
                        <td className="p-3 font-bold text-slate-700">{g.latestPercentage}%</td>
                        <td className="p-3">
                          <Badge variant={g.priority === "High" ? "high" : "medium"} size="sm">
                            {g.priority}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={g.status === "Resolved" ? "mastered" : "inProgress"} size="sm">
                            {g.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Official Signatures Row */}
          <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-3 gap-4 text-xs text-slate-600">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <span className="block mt-1 font-semibold">Class Teacher Signature</span>
              <span className="text-[10px] text-slate-400">Pooja Sharma</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <span className="block mt-1 font-semibold">Principal / Administrator</span>
              <span className="text-[10px] text-slate-400">Principal R.K. Trivedi</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
              <span className="block mt-1 font-semibold">Parent / Guardian Signature</span>
              <span className="text-[10px] text-slate-400">Date: ____________</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
