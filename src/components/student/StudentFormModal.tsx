"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { AlertCircle } from "lucide-react";
import type { Student } from "@/lib/types";

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
  onSuccess: () => void;
}

export function StudentFormModal({
  isOpen,
  onClose,
  student,
  onSuccess,
}: StudentFormModalProps) {
  const [studentCode, setStudentCode] = useState(student?.studentCode || "");
  const [displayName, setDisplayName] = useState(student?.displayName || "");
  const [grade, setGrade] = useState<number>(student?.grade || 4);
  const [section, setSection] = useState(student?.section || "A");
  const [classroomId, setClassroomId] = useState(student?.classroomId || "cls-4a");
  const [notes, setNotes] = useState(student?.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setStudentCode(student.studentCode);
      setDisplayName(student.displayName);
      setGrade(student.grade);
      setSection(student.section);
      setNotes(student.notes || "");
    } else if (isOpen) {
      setStudentCode(`MPS-4A-${Date.now().toString().slice(-4)}`);
    }
  }, [student, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !studentCode.trim()) {
      setError("Please provide both student name and roll code.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const url = student ? `/api/students/${student.id}` : "/api/students";
      const method = student ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentCode,
          displayName,
          grade: Number(grade),
          section,
          classroomId: `cls-${grade}${section.toLowerCase()}`,
          notes,
          enrollmentStatus: "active",
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Failed to save student record");
      }
    } catch {
      setError("Network error saving student");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={student ? "Edit Student Details" : "Register New Student"}
      description="Record primary school enrollment information. Sensitive family/biometric data is not collected."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#49352F] mb-1">
            Student Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Aarav Patel"
            className="w-full rounded-xl border border-[#49352F]/15 bg-white p-2.5 text-sm text-[#49352F] focus:border-[#B26A1B] focus:ring-1 focus:ring-[#B26A1B] outline-hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#49352F] mb-1">
              Student Code / Roll <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              placeholder="e.g. MPS-4A-12"
              className="w-full rounded-xl border border-[#49352F]/15 bg-white p-2.5 text-sm font-mono text-[#49352F] focus:border-[#B26A1B] focus:ring-1 focus:ring-[#B26A1B] outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#49352F] mb-1">Grade (Class)</label>
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full rounded-xl border border-[#49352F]/15 bg-white p-2.5 text-sm text-[#49352F] focus:border-[#B26A1B] focus:ring-1 focus:ring-[#B26A1B] outline-hidden cursor-pointer"
            >
              <option value={1}>Class 1</option>
              <option value={2}>Class 2</option>
              <option value={3}>Class 3</option>
              <option value={4}>Class 4</option>
              <option value={5}>Class 5</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#49352F] mb-1">Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full rounded-xl border border-[#49352F]/15 bg-white p-2.5 text-sm text-[#49352F] focus:border-[#B26A1B] focus:ring-1 focus:ring-[#B26A1B] outline-hidden cursor-pointer"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#49352F] mb-1">
            Teacher Notes & Observations
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Responsive to visual charts; needs extra time for reading."
            className="w-full rounded-xl border border-[#49352F]/15 bg-white p-2.5 text-xs text-[#49352F] placeholder-[#7A6862]/60 focus:border-[#B26A1B] focus:ring-1 focus:ring-[#B26A1B] outline-hidden"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#49352F]/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#7A6862] hover:bg-[#FAF6E9] hover:text-[#49352F] rounded-xl cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold bg-[#F2CAB3] hover:bg-white text-[#49352F] border border-[#49352F]/16 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : student ? "Update Student" : "Register Student"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
