"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { useFilter } from "@/context/FilterContext";
import { StudentFormModal } from "@/components/student/StudentFormModal";
import { StudentCsvModal } from "@/components/student/StudentCsvModal";
import { SpotlightTour } from "@/components/tutorial/SpotlightTour";
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
  CheckCircle2,
} from "lucide-react";

export default function StudentsPage() {
  const { t, language } = useLanguage();
  const { searchTerm, setSearchTerm, selectedClass, setSelectedClass, gradeNumber } = useFilter();

  const [students, setStudents] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
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

  const activeGrade = gradeNumber ? String(gradeNumber) : "all";

  const handleGradeFilterChange = (val: string) => {
    if (val === "all") {
      setSelectedClass("all");
    } else {
      setSelectedClass(`cls-${val}a`);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (activeGrade !== "all" && s.grade !== Number(activeGrade)) return false;
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
    link.setAttribute("download", `shikshasetu_students_class${activeGrade}.csv`);
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
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {language === "gu" ? "વિદ્યાર્થી ડિરેક્ટરી અને પ્રોફાઇલ્સ" : "Student Directory & 3D Profiles"}
              </h1>
              <Badge variant="indigo" size="sm">
                15 Enrolled
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage primary school enrollments, track 3D skill trees, and coordinate 5-step remedial plans.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="rounded-full text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>{t.actions.exportCsv}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCsvModal(true)}
              className="rounded-full text-xs"
            >
              <Upload className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>{t.actions.importCsv}</span>
            </Button>
            <div data-tour="students-add">
              <Button
                variant="saffron"
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="rounded-full text-xs font-bold"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1" />
                <span>{t.actions.addStudent}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <Card variant="glass" className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 border-slate-800">
          <div data-tour="students-search" className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={t.actions.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-slate-700 bg-slate-900 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:border-amber-500 outline-hidden"
            />
          </div>

          <div data-tour="students-filter" className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-400">Class:</span>
            <select
              value={activeGrade}
              aria-label="Filter students by class"
              onChange={(e) => handleGradeFilterChange(e.target.value)}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 outline-hidden cursor-pointer"
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
        </Card>

        {/* Student Cards Grid */}
        <div data-tour="students-table" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((std) => {
            const gapCount = getStudentGapCount(std.id);
            const isDemoCase = std.id === "std-aarav";

            return (
              <Card
                key={std.id}
                variant="glass"
                className={`p-5 flex flex-col justify-between transition-all border-slate-800 hover:border-amber-500/50 ${
                  isDemoCase
                    ? "ring-1 ring-amber-500/60 shadow-[0_0_20px_rgba(255,138,61,0.15)]"
                    : ""
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-indigo-600/30 text-amber-400 border border-amber-500/30 flex items-center justify-center font-heading font-black text-sm shrink-0">
                        {std.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/students/${std.id}`}
                            className="font-bold text-sm text-white hover:text-amber-400 transition-colors"
                          >
                            {std.displayName}
                          </Link>
                          {isDemoCase && (
                            <Badge variant="saffron" size="sm">
                              Demo Case
                            </Badge>
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
                    <p className="text-xs text-slate-300 line-clamp-2 italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                      &quot;{std.notes}&quot;
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {gapCount > 0 ? (
                      <Badge variant="needsSupport" size="sm" dot>
                        <AlertTriangle className="w-3 h-3 mr-1 text-rose-400" />
                        <span>{gapCount} Active Gap{gapCount > 1 ? "s" : ""}</span>
                      </Badge>
                    ) : (
                      <Badge variant="mastered" size="sm" dot>
                        <span>On Track</span>
                      </Badge>
                    )}
                  </div>

                  <Link href={`/students/${std.id}`}>
                    <Button variant="ghost" size="sm" className="text-xs text-amber-400 hover:text-white">
                      <span>3D Profile &rarr;</span>
                    </Button>
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
      {/* Guided Tour */}
      <SpotlightTour page="students" />
    </AppLayout>
  );
}
