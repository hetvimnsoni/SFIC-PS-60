"use client";

import React from "react";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export interface BridgeProgressProps {
  score: number; // 0 to 100
  previousScore?: number; // Optional baseline for reassessment delta (e.g., 35 -> 85)
  thresholdDeveloping?: number; // default 60%
  thresholdMastery?: number; // default 80%
  showPlanks?: boolean;
  showLabels?: boolean;
  animated?: boolean;
  height?: "sm" | "md" | "lg";
  className?: string;
  studentName?: string;
}

export function BridgeProgress({
  score,
  previousScore,
  thresholdDeveloping = 60,
  thresholdMastery = 80,
  showPlanks = true,
  showLabels = true,
  animated = true,
  height = "md",
  className = "",
  studentName,
}: BridgeProgressProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const clampedPrev = previousScore !== undefined ? Math.max(0, Math.min(100, previousScore)) : null;
  const isMastered = clampedScore >= thresholdMastery;
  const isDeveloping = clampedScore >= thresholdDeveloping && !isMastered;
  const isGap = clampedScore < thresholdDeveloping;

  const heightClasses = {
    sm: "h-3",
    md: "h-5",
    lg: "h-7",
  }[height];

  // Number of bridge planks to render
  const plankCount = 20;

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#49352F]">
              {studentName ? `${studentName}'s Bridge` : "Learning Bridge"}
            </span>
            {clampedPrev !== null && (
              <span className="rounded-full bg-[#EAF4EE] px-2 py-0.5 font-bold text-[#1E5C44] border border-[#2E7D5E]/30">
                +{clampedScore - clampedPrev} pp gain
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {clampedPrev !== null && (
              <span className="text-[#5C4B45] line-through">
                {clampedPrev}%
              </span>
            )}
            <span
              className={`font-heading text-sm font-extrabold ${
                isMastered
                  ? "text-[#1E5C44]"
                  : isDeveloping
                  ? "text-[#8D4E10]"
                  : "text-[#A93327]"
              }`}
            >
              {clampedScore}%
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A6862]">
              {isMastered ? "Mastered" : isDeveloping ? "Developing" : "Needs Support"}
            </span>
          </div>
        </div>
      )}

      {/* Main Bridge Track */}
      <div className="relative">
        {/* Bridge Track Rail */}
        <div
          className={`relative w-full overflow-hidden rounded-full bg-[#FAF6E9] border border-[#49352F]/15 p-0.5 shadow-inner ${heightClasses}`}
        >
          {/* Subtle plank background dividers */}
          {showPlanks && (
            <div className="absolute inset-0 flex justify-between px-1 pointer-events-none z-10 opacity-30">
              {Array.from({ length: plankCount }).map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 h-full bg-[#49352F]/20"
                  style={{ left: `${(i / plankCount) * 100}%` }}
                />
              ))}
            </div>
          )}

          {/* Previous baseline marker track if reassessment */}
          {clampedPrev !== null && (
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#49352F]/10 rounded-full border-r-2 border-[#49352F]/30"
              style={{ width: `${clampedPrev}%` }}
            />
          )}

          {/* Active Glowing Bridge Planks Fill */}
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
              isMastered
                ? "bg-gradient-to-r from-[#F2CAB3] via-[#B26A1B] to-[#2E7D5E] shadow-xs"
                : isDeveloping
                ? "bg-gradient-to-r from-[#C54738] to-[#B26A1B] shadow-xs"
                : "bg-gradient-to-r from-[#C54738] to-rose-400 shadow-xs"
            }`}
            style={{ width: `${clampedScore}%` }}
          >
            {/* Shimmer light beam crossing the bridge */}
            {animated && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            )}
          </div>
        </div>

        {/* 60% Developing Threshold Marker */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center"
          style={{ left: `${thresholdDeveloping}%` }}
        >
          <div className="w-0.5 h-full bg-[#B26A1B]/60 border-dashed" />
        </div>

        {/* 80% Mastery Threshold Marker */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center"
          style={{ left: `${thresholdMastery}%` }}
        >
          <div className="w-0.5 h-full bg-[#2E7D5E]/60" />
        </div>
      </div>

      {/* Threshold Labels Bottom Key */}
      {showLabels && (
        <div className="flex items-center justify-between text-[10px] text-[#7A6862] px-0.5">
          <span>0% Gap</span>
          <span
            className="text-[#B26A1B] cursor-help font-medium"
            title="60% Developing threshold"
            style={{ transform: "translateX(-20%)" }}
          >
            | 60% Target
          </span>
          <span
            className="text-[#2E7D5E] cursor-help font-medium"
            title="80% Mastery benchmark"
            style={{ transform: "translateX(-20%)" }}
          >
            | 80% Mastery
          </span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}
