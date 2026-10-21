"use client";

import React from "react";

export function BrandLogo({
  size = 38,
  showText = true,
  className = "",
}: {
  size?: number;
  showText?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Warm Bridge Glyph + Gujarati "શ" Icon */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#F2DCB5] via-[#FAF6E9] to-[#F2CAB3] border border-[#49352F]/15 shadow-[0_4px_14px_rgba(73,53,47,0.08)] overflow-hidden"
        style={{ width: size, height: size }}
      >
        {/* Soft arch behind letter */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40"
          viewBox="0 0 48 48"
          fill="none"
        >
          {/* Bridge cable arch */}
          <path
            d="M6 36 C18 18, 30 18, 42 36"
            stroke="#49352F"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Bridge vertical suspenders */}
          <line x1="15" y1="26" x2="15" y2="36" stroke="#2E7D5E" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="24" y1="21" x2="24" y2="36" stroke="#49352F" strokeWidth="1.5" />
          <line x1="33" y1="26" x2="33" y2="36" stroke="#2E7D5E" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>

        {/* Center Gujarati "શ" Character */}
        <span
          className="relative font-gujarati font-black text-[#49352F]"
          style={{ fontSize: `${Math.round(size * 0.48)}px` }}
        >
          શ
        </span>

        {/* Inner sage accent dot */}
        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#2E7D5E] shadow-[0_0_6px_rgba(46,125,94,0.4)]" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold text-base tracking-tight text-[#49352F] leading-none">
              Shiksha<span className="text-[#B26A1B]">Setu</span>
            </span>
            <span className="bg-[#F2CAB3] border border-[#49352F]/15 text-[#49352F] text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              AI
            </span>
          </div>
          <span className="text-[10px] font-semibold text-[#7A6862] tracking-wider uppercase mt-1">
            Learning Gap Bridge
          </span>
        </div>
      )}
    </div>
  );
}
