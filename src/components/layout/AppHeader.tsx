"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useFilter } from "@/context/FilterContext";
import { LanguageSelector } from "../shared/LanguageSelector";
import {
  Bell,
  Search,
  UserCheck,
  Building,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ShieldAlert,
  LogOut,
} from "lucide-react";

interface AppHeaderProps {
  currentClass?: string;
  onClassChange?: (cls: string) => void;
  onSearchChange?: (term: string) => void;
}

export function AppHeader({
  currentClass: propClass,
  onClassChange,
  onSearchChange,
}: AppHeaderProps) {
  const router = useRouter();
  const { user, role, switchRole, logout } = useAuth();
  const { t } = useLanguage();
  const {
    selectedClass: ctxClass,
    setSelectedClass: setCtxClass,
    searchTerm: ctxSearch,
    setSearchTerm: setCtxSearch,
  } = useFilter();

  const currentClass = propClass !== undefined ? propClass : ctxClass;
  const handleClassChange = (val: string) => {
    setCtxClass(val);
    if (onClassChange) onClassChange(val);
  };

  const handleSearchChange = (val: string) => {
    setCtxSearch(val);
    if (onSearchChange) onSearchChange(val);
  };

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [urgentGaps, setUrgentGaps] = useState<any[]>([]);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetch("/api/learning-gaps?priority=High&status=Active");
        const data = await res.json();
        if (data.success) {
          setUrgentGaps(data.gaps || []);
        }
      } catch {
        // quiet fallback
      }
    }
    loadAlerts();
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-sm print:hidden">
      {/* Left section: School info & Class selector */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden md:flex items-center gap-2 text-slate-700">
          <Building className="h-4 w-4 text-indigo-600 shrink-0" />
          <span className="font-semibold text-xs lg:text-sm tracking-tight text-slate-800">
            {t.app.demoSchoolName}
          </span>
          <span className="hidden xl:inline-block text-[11px] text-slate-400 font-normal">
            (GUJ-GNR-042)
          </span>
        </div>

        {/* Current Class Selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
          <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
          <select
            value={currentClass}
            aria-label="Filter by class"
            onChange={(e) => handleClassChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="all">{t.dashboard.allClasses}</option>
            <option value="cls-3a">Class 3 - Section A</option>
            <option value="cls-4a">Class 4 - Section A</option>
            <option value="cls-5a">Class 5 - Section A</option>
          </select>
        </div>
      </div>

      {/* Center Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.actions.search}
            value={ctxSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Right section: Demo tag, Language, Notifications, User Role */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Workspace Quick Launch */}
        <Link
          href="/ai"
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Hub</span>
        </Link>

        {/* Hackathon Demo Tag */}
        <div className="hidden lg:inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full text-[11px] font-semibold">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>SFIC Gujarat Hackathon Demo</span>
        </div>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Notifications Icon with active indicator */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Learning Gap Notifications"
          >
            <Bell className="w-4 h-4" />
            {urgentGaps.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white p-3 shadow-xl ring-1 ring-slate-900/10 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-xs text-slate-800">Learning Gap Alerts</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-bold">
                  {urgentGaps.length} Urgent
                </span>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                {urgentGaps.length === 0 ? (
                  <p className="text-slate-500 text-center py-2 text-xs">
                    No active high priority gaps detected!
                  </p>
                ) : (
                  urgentGaps.slice(0, 3).map((gap) => (
                    <Link
                      key={gap.id}
                      href={`/students/${gap.studentId}`}
                      onClick={() => setNotificationsOpen(false)}
                      className="block p-2 rounded-lg bg-amber-50/70 hover:bg-amber-100/70 border border-amber-100 transition-colors"
                    >
                      <p className="font-semibold text-slate-900">
                        {gap.studentName} (Class {gap.grade}-A)
                      </p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Needs Support in {gap.conceptName} ({gap.latestPercentage}%).
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              {role === "admin" ? "A" : "T"}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-slate-900 leading-tight">
                {user?.name || "Teacher"}
              </div>
              <div className="text-[10px] text-indigo-600 font-medium capitalize">
                {role === "admin" ? t.app.adminRole : t.app.teacherRole}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-2 shadow-xl ring-1 ring-slate-900/10 z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </p>
                <p className="text-xs text-slate-600 mt-0.5">Explore with different permissions</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  switchRole("teacher");
                  setShowRoleMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors cursor-pointer ${
                  role === "teacher" ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <div>
                  <div className="font-semibold">Pooja Sharma</div>
                  <div className="text-[10px] text-slate-500">Class Teacher (Class 4-A)</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole("admin");
                  setShowRoleMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors mt-1 cursor-pointer ${
                  role === "admin" ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <div>
                  <div className="font-semibold">Principal R.K. Trivedi</div>
                  <div className="text-[10px] text-slate-500">School Administrator</div>
                </div>
              </button>

              <div className="border-t border-slate-100 my-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setShowRoleMenu(false);
                    router.push("/");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>{t.nav?.logout || "Sign Out"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
