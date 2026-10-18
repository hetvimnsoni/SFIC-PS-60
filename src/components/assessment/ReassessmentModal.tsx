"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { Badge } from "../ui/Badge";
import { calculatePercentage, calculatePercentagePointDelta } from "@/lib/engine/calculations";
import { TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

interface ReassessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  conceptId: string;
  conceptName: string;
  previousPercentage?: number;
  onSuccess?: () => void;
}

export function ReassessmentModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  conceptId,
  conceptName,
  previousPercentage = 35,
  onSuccess,
}: ReassessmentModalProps) {
  const [marksObtained, setMarksObtained] = useState<string>("17");
  const [maximumMarks, setMaximumMarks] = useState<string>("20");
  const [notes, setNotes] = useState<string>("Post-remedial intervention reassessment.");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMarksObtained("17");
      setMaximumMarks("20");
      setNotes(`Post-remedial intervention reassessment for ${conceptName}.`);
      setError(null);
    }
  }, [isOpen, conceptName]);

  const obtainedNum = parseFloat(marksObtained) || 0;
  const maxNum = parseFloat(maximumMarks) || 20;
  const currentPct = calculatePercentage(obtainedNum, maxNum);
  const deltaPp = calculatePercentagePointDelta(currentPct, previousPercentage);

  const newStatus =
    currentPct >= 80 ? "Mastered" : currentPct >= 60 ? "Developing" : "Needs Support";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (obtainedNum < 0 || obtainedNum > maxNum) {
      setError(`Marks obtained must be between 0 and ${maxNum}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/assessments/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results: [
            {
              assessmentId: `asm-retest-${Date.now()}`,
              studentId,
              conceptId,
              marksObtained: obtainedNum,
              maximumMarks: maxNum,
              notes,
              recordedAt: new Date().toISOString(),
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(data.error || "Failed to record reassessment");
      }
    } catch (err) {
      setError("Network error recording reassessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Record Concept Reassessment"
      description={`Measure remedial intervention outcomes for ${studentName} on ${conceptName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Baseline vs New Comparison Banner */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Baseline Score</div>
            <div className="text-lg font-bold text-slate-700 mt-0.5">{previousPercentage}%</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-indigo-600 uppercase">New Score</div>
            <div className="text-lg font-bold text-indigo-600 mt-0.5">{currentPct}%</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-emerald-600 uppercase">Delta Gain</div>
            <div className="text-lg font-bold text-emerald-600 mt-0.5">
              {deltaPp >= 0 ? `+${deltaPp}` : deltaPp} pp
            </div>
          </div>
        </div>

        {/* Status preview */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs">
          <span className="font-semibold text-slate-700">Projected Mastery Status:</span>
          <Badge
            variant={
              newStatus === "Mastered"
                ? "mastered"
                : newStatus === "Developing"
                ? "developing"
                : "needsSupport"
            }
          >
            {newStatus}
          </Badge>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Marks Obtained
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max={maxNum}
              required
              value={marksObtained}
              onChange={(e) => setMarksObtained(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Maximum Marks
            </label>
            <input
              type="number"
              min="1"
              required
              value={maximumMarks}
              onChange={(e) => setMaximumMarks(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-2 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Teacher Observation & Remedial Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden"
            placeholder="e.g. Student successfully used visual grouping cards without prompts."
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Recording..." : "Save & Recalculate Gaps"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
