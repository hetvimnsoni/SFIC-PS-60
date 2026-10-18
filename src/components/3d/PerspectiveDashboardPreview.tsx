"use client";

import React, { useState, useEffect, useRef } from "react";
import { DashboardPreview } from "@/components/landing/DashboardPreview";

export function PerspectiveDashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress from 0 (approaching) to 1 (centered in viewport)
      const start = windowHeight;
      const end = windowHeight * 0.2;
      const current = rect.top;

      let progress = 0;
      if (current < start) {
        progress = Math.min(1, Math.max(0, (start - current) / (start - end)));
      }
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Perspective transforms: starts at 12deg tilt, straightens to 0deg as user scrolls into it
  const rotateX = 12 * (1 - scrollProgress);
  const scale = 0.94 + 0.06 * scrollProgress;
  const shadowIntensity = 0.2 + 0.3 * scrollProgress;

  return (
    <div ref={containerRef} className="w-full perspective-[1400px]">
      <div
        className="transition-transform duration-300 ease-out will-change-transform rounded-3xl"
        style={{
          transform: `perspective(1400px) rotateX(${rotateX}deg) scale3d(${scale}, ${scale}, 1)`,
          transformOrigin: "center bottom",
          boxShadow: `0 25px 60px -15px rgba(15, 23, 42, ${shadowIntensity})`,
        }}
      >
        <DashboardPreview />
      </div>
    </div>
  );
}
