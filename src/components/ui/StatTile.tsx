"use client";

import React, { useEffect, useState } from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "./Card";

export interface StatTileProps {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  change?: {
    value: number | string;
    trend: "up" | "down" | "neutral";
    label?: string;
  };
  icon?: LucideIcon;
  variant?: "saffron" | "mint" | "coral" | "indigo" | "neutral";
  sparklineData?: number[];
  description?: string;
  className?: string;
}

export function StatTile({
  label,
  value,
  prefix = "",
  suffix = "",
  change,
  icon: Icon,
  variant = "saffron",
  sparklineData,
  description,
  className = "",
}: StatTileProps) {
  const [displayValue, setDisplayValue] = useState<number | string>(
    typeof value === "number" ? 0 : value
  );

  // Animated count up for numerical values
  useEffect(() => {
    if (typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    const duration = 1200;
    const start = performance.now();
    const startVal = 0;
    const endVal = value;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progress = Math.min(1, elapsed / duration);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startVal + (endVal - startVal) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  const variantStyles = {
    saffron: {
      glow: "border-[#49352F]/10 hover:border-[#F2CAB3] shadow-xs",
      iconBg: "bg-[#F2CAB3] text-[#49352F] border border-[#49352F]/12",
      accent: "text-[#B26A1B]",
      stroke: "#F2CAB3",
    },
    mint: {
      glow: "border-[#49352F]/10 hover:border-[#2E7D5E]/30 shadow-xs",
      iconBg: "bg-[#EAF4EE] text-[#2E7D5E] border border-[#2E7D5E]/20",
      accent: "text-[#2E7D5E]",
      stroke: "#2E7D5E",
    },
    coral: {
      glow: "border-[#49352F]/10 hover:border-[#C54738]/30 shadow-xs",
      iconBg: "bg-[#FBECE9] text-[#C54738] border border-[#C54738]/20",
      accent: "text-[#C54738]",
      stroke: "#C54738",
    },
    indigo: {
      glow: "border-[#49352F]/10 hover:border-[#49352F]/20 shadow-xs",
      iconBg: "bg-[#F2DCB5]/80 text-[#49352F] border border-[#49352F]/15",
      accent: "text-[#49352F]",
      stroke: "#B8673E",
    },
    neutral: {
      glow: "border-[#49352F]/10 hover:border-[#49352F]/20 shadow-xs",
      iconBg: "bg-[#FAF6E9] text-[#7A6862] border border-[#49352F]/10",
      accent: "text-[#49352F]",
      stroke: "#7A6862",
    },
  }[variant];

  // SVG mini sparkline path generator
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const width = 80;
    const height = 28;

    const points = sparklineData.map((d, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((d - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return (
      <svg
        width={width}
        height={height}
        className="overflow-visible opacity-85"
        aria-hidden="true"
      >
        <polyline
          fill="none"
          stroke={variantStyles.stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points.join(" ")}
        />
      </svg>
    );
  };

  return (
    <Card
      variant="glass"
      className={`relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 ${variantStyles.glow} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A6862]">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            {prefix && (
              <span className="text-lg font-bold text-[#7A6862]">{prefix}</span>
            )}
            <span className="font-heading text-3xl font-extrabold tracking-tight text-[#49352F]">
              {displayValue}
            </span>
            {suffix && (
              <span className={`text-sm font-bold ${variantStyles.accent}`}>
                {suffix}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${variantStyles.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {(change || sparklineData || description) && (
        <div className="mt-4 flex items-center justify-between border-t border-[#49352F]/10 pt-3 text-xs">
          {change ? (
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${
                  change.trend === "up"
                    ? "text-[#2E7D5E]"
                    : change.trend === "down"
                    ? "text-[#C54738]"
                    : "text-[#7A6862]"
                }`}
              >
                {change.trend === "up" && <TrendingUp className="h-3.5 w-3.5" />}
                {change.trend === "down" && <TrendingDown className="h-3.5 w-3.5" />}
                {change.trend === "neutral" && <Minus className="h-3.5 w-3.5" />}
                {change.value}
              </span>
              {change.label && (
                <span className="text-[#7A6862]">{change.label}</span>
              )}
            </div>
          ) : description ? (
            <span className="text-[#7A6862]">{description}</span>
          ) : (
            <div />
          )}

          {renderSparkline()}
        </div>
      )}
    </Card>
  );
}
