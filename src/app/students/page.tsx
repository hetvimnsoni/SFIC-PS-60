"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import { StudentFormModal } from "@/components/student/StudentFormModal";
import { StudentCsvModal } from "@/components/student/StudentCsvModal";
import {
  Users,
  Search,
  PlusCircle,
  Upload,
  Download,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function StudentsPage() {
  const { t } = useLanguage();

  const [students, setStudents] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Modals
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const [stdRes, gapsRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/learning-gaps"),
      ]);
      const [stdData, gapsData] = await Promise.all([stdRes.json(), gapsRes.json()]);
      if (stdData.success) setStudents(stdData.students);
      if (gapsData.success) setGaps(gapsData.gaps);
    } catch (e) {
      console.error("Failed to load students", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    if (gradeFilter !== "all" && s.grade !== Number(gradeFilter)) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        s.displayName.toLowerCase().includes(term) ||
        s.studentCode.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const getStudentGapCount = (studentId: string) => {
    return gaps.filter((g) => g.studentId === studentId && (g.status === "Active" || g.status === "Under Intervention")).length;
  };

  const handleExportCsv = () => {
    const headers = ["StudentCode", "DisplayName", "Grade", "Section", "Status", "ActiveGaps"];
    const rows = filteredStudents.map((s) => [
      s.studentCode,
      `"${s.displayName}"`,
      s.grade,
      s.section,
      s.enrollmentStatus,
      getStudentGapCount(s.id),
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shikshasetu_students_class${gradeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Student Directory & Competency Profiles
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage student enrollment, monitor concept mastery, and coordinate remedial interventions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
              onClick={() => setShowCsvModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.actions.importCsv}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.actions.addStudent}</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={t.actions.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500">Filter:</span>
            <select
              value={gradeFilter}
              aria-label="Filter students by class"
              onChange={(e) => setGradeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
            >
              <option value="all">All Classes (1-5)</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
              <option value="5">Class 5</option>
            </select>
            <span className="text-xs text-slate-400 ml-2">
              Showing {filteredStudents.length} students
            </span>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((std) => {
            const gapCount = getStudentGapCount(std.id);
            const isDemoCase = std.id === "std-aarav";

            return (
              <Card
                key={std.id}
                className={`flex flex-col justify-between transition-all ${
                  isDemoCase
                    ? "ring-2 ring-indigo-500/80 bg-gradient-to-br from-indigo-50/40 to-white"
                    : ""
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {std.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/students/${std.id}`}
                            className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors"
                          >
                            {std.displayName}
                          </Link>
                          {isDemoCase && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Demo Case</span>
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">
                          {std.studentCode}
                        </span>
                      </div>
                    </div>

                    <Badge variant="outline" size="sm">
                      Class {std.grade}-{std.section}
                    </Badge>
                  </div>

                  {std.notes && (
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 italic">
                      &quot;{std.notes}&quot;
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {gapCount > 0 ? (
                      <Badge variant="needsSupport" size="sm">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        <span>{gapCount} Active Gap{gapCount > 1 ? "s" : ""}</span>
                      </Badge>
                    ) : (
                      <Badge variant="mastered" size="sm">
                        <span>On Track</span>
                      </Badge>
                    )}
                  </div>

                  <Link
                    href={`/students/${std.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Student Modal */}
      <StudentFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchStudents}
      />

      {/* CSV Import Modal */}
      <StudentCsvModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        existingCodes={students.map((s) => s.studentCode)}
        onSuccess={fetchStudents}
      />
    </AppLayout>
  );
}
