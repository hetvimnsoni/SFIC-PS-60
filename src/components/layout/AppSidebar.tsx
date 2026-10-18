"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { BrandLogo } from "../shared/BrandLogo";
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  AlertTriangle,
  ClipboardList,
  Gamepad2,
  TrendingUp,
  FileText,
  Settings,
  RotateCcw,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const navItems = [
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    {
      href: "/ai",
      label: t.nav.aiWorkspace || "AI Workspace",
      icon: Sparkles,
      badge: "AI 5-in-1",
      badgeColor: "bg-cyan-500 text-slate-950 font-black",
    },
    { href: "/students", label: t.nav.students, icon: Users },
    { href: "/assessments", label: t.nav.assessments, icon: FileSpreadsheet },
    {
      href: "/learning-gaps",
      label: t.nav.learningGaps,
      icon: AlertTriangle,
      badge: "Active",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    { href: "/remedial-plans", label: t.nav.remedialPlans, icon: ClipboardList },
    { href: "/activities", label: t.nav.activities, icon: Gamepad2 },
    { href: "/progress", label: t.nav.progress, icon: TrendingUp },
    { href: "/reports", label: t.nav.reports, icon: FileText },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/reset-demo", { method: "POST" });
      if (res.ok) {
        setShowResetConfirm(false);
        router.refresh();
        window.location.reload();
      }
    } catch (e) {
      console.error("Reset failed", e);
    } finally {
      setIsResetting(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-3 left-3 z-50 p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm lg:hidden cursor-pointer print:hidden"
        aria-label="Toggle Navigation"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden print:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white shadow-xs transition-transform duration-200 ease-in-out lg:translate-x-0 print:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center px-5 border-b border-slate-100">
          <Link href="/dashboard" onClick={() => setIsMobileOpen(false)}>
            <BrandLogo />
          </Link>
        </div>

        {/* Guided Demo Shortcut Card */}
        <div className="mx-3 mt-3 p-3 rounded-xl bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 border border-indigo-100">
          <div className="flex items-center gap-1.5 text-indigo-900 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Hackathon Guided Demo</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 leading-snug">
            Evaluate Aarav&apos;s division gap remediation in 2 minutes.
          </p>
          <Link
            href="/students/std-aarav"
            onClick={() => setIsMobileOpen(false)}
            className="mt-2 block w-full py-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-semibold transition-colors"
          >
            Launch Demo Case →
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors group cursor-pointer ${
                  active
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      active ? "bg-white/20 text-white" : item.badgeColor || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Utility: Demo Data Reset */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.actions.resetDemo}</span>
          </button>
        </div>
      </aside>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Reset Demo Data?</h3>
            <p className="text-xs text-slate-600 mt-2">
              This will restore the 15 demonstration students, initial assessment scores, learning gaps, and remedial plans to their original state.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                {t.actions.cancel}
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={handleResetDemo}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isResetting ? "Resetting..." : "Confirm Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
