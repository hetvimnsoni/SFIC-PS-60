"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useFilter } from "@/context/FilterContext";
import { LanguageSelector } from "../shared/LanguageSelector";
import { ThemeToggle } from "../shared/ThemeToggle";
import { triggerPageTour } from "@/components/tutorial/SpotlightTour";
import { GlobalSearch } from "./GlobalSearch";
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
  RotateCcw,
  HelpCircle,
  X,
  Users,
  MoreHorizontal,
  Compass,
  Check,
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
  const pathname = usePathname();
  const { user, role, switchRole, logout } = useAuth();
  const { t, language } = useLanguage();

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [urgentGaps, setUrgentGaps] = useState<any[]>([]);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const getPageTourKey = (path: string): string => {
    if (path === "/dashboard" || path === "/") return "dashboard";
    if (path.startsWith("/students/") && path !== "/students") return "studentDetail";
    if (path.startsWith("/students")) return "students";
    if (path.startsWith("/learning-gaps")) return "learningGaps";
    if (path.startsWith("/remedial-plans")) return "remedialPlans";
    if (path.startsWith("/reports")) return "reports";
    return "dashboard";
  };

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

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (roleMenuRef.current && !roleMenuRef.current.contains(target)) {
        setShowRoleMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setShowMoreMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowRoleMenu(false);
        setShowMoreMenu(false);
        setNotificationsOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch learning gap alerts
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

  // Role display helper
  const getRoleBadgeInitial = () => {
    if (role === "admin") return "A";
    if (role === "parent") return "P";
    return "T";
  };

  const getRoleLabel = () => {
    if (role === "admin") return t.app?.adminRole || "Administrator";
    if (role === "parent") return "Parent / Guardian";
    return t.app?.teacherRole || "Class Teacher";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#49352F]/10 bg-[#F4F1E1]/95 px-3 sm:px-4 lg:px-6 backdrop-blur-md print:hidden transition-colors text-[#49352F] gap-2 lg:gap-4">
      {/* Mobile Full-Width Search Drawer */}
      {isMobileSearchOpen && (
        <div className="sm:hidden absolute inset-0 z-50 bg-[#FAF6E9] px-3 flex items-center gap-2 border-b border-[#49352F]/15 shadow-md">
          <div className="flex-1">
            <GlobalSearch
              onSearchChange={(val) => {
                if (onSearchChange) onSearchChange(val);
              }}
              className="max-w-none w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(false)}
            className="px-3 py-2 rounded-xl text-xs font-bold text-[#49352F] hover:bg-[#F2DCB5]/40 transition-colors cursor-pointer shrink-0"
          >
            Close
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: LEFT — SCHOOL IDENTITY & CLASS SELECTION                       */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* School Identity */}
        <div
          className="flex items-center gap-2 text-[#49352F] group cursor-default"
          title={`${t.app?.demoSchoolName || "Model Primary School, Gandhinagar"} (GUJ-GNR-042)`}
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-[#49352F]/15 flex items-center justify-center shrink-0 shadow-2xs">
            <Building className="h-4 w-4 text-[#B26A1B]" />
          </div>
          <div className="hidden sm:block max-w-[150px] md:max-w-[190px] xl:max-w-[230px]">
            <span className="font-semibold text-xs tracking-tight text-[#49352F] block truncate">
              {t.app?.demoSchoolName || "Model Primary School, Gandhinagar"}
            </span>
            <span className="text-[10px] text-[#7A6862] font-mono block leading-none mt-0.5">
              GUJ-GNR-042
            </span>
          </div>
        </div>

        {/* Current Class Selector Dropdown */}
        <div className="flex items-center gap-1.5 bg-white border border-[#49352F]/15 rounded-xl px-2.5 py-1.5 shadow-xs shrink-0">
          <GraduationCap className="h-3.5 w-3.5 text-[#7A6862]" />
          <select
            value={currentClass}
            aria-label="Filter by class"
            onChange={(e) => handleClassChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-[#49352F] outline-hidden cursor-pointer"
          >
            <option value="all">{t.dashboard?.allClasses || "All Classes"}</option>
            <option value="cls-3a">Class 3 - Section A</option>
            <option value="cls-4a">Class 4 - Section A</option>
            <option value="cls-5a">Class 5 - Section A</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: CENTER — PROMINENT GLOBAL SEARCH BAR                           */}
      {/* ========================================================================= */}
      <div className="hidden sm:flex items-center justify-center flex-1 max-w-[420px] min-w-[200px] sm:min-w-[240px] md:min-w-[280px] mx-1 md:mx-3">
        <GlobalSearch
          onSearchChange={(val) => {
            if (onSearchChange) onSearchChange(val);
          }}
          className="w-full"
        />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: RIGHT — ACTIONS & DEDICATED ACCOUNT CENTER                     */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Mobile Search Toggle Icon */}
        <button
          type="button"
          onClick={() => setIsMobileSearchOpen(true)}
          className="sm:hidden p-2 rounded-xl border border-[#49352F]/15 bg-white text-[#49352F] hover:bg-[#FAF6E9] transition-colors cursor-pointer shadow-xs"
          aria-label="Open Search"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* AI Workspace Quick Launch */}
        <Link
          href="/ai"
          aria-label="AI Hub Workspace"
          className="inline-flex items-center gap-1.5 bg-[#F2CAB3] hover:bg-white text-[#49352F] border border-[#49352F]/15 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all whitespace-nowrap active:scale-95"
          title="AI Parent-School Language Bridge Workspace"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B26A1B] shrink-0" aria-hidden="true" />
          <span className="hidden md:inline">AI Hub</span>
        </Link>

        {/* Secondary Actions: Visible on Wide (2xl), otherwise in "More" Menu */}
        <div className="hidden 2xl:flex items-center gap-2">
          {/* Hackathon Demo Tag */}
          <div className="inline-flex items-center gap-1 bg-[#F2DCB5]/60 border border-[#49352F]/15 text-[#49352F] px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-[#B26A1B] shrink-0" aria-hidden="true" />
            <span>SFIC Gujarat Hackathon Demo</span>
          </div>

          {/* Replay Tour Button */}
          <button
            type="button"
            onClick={() => {
              const pageKey = getPageTourKey(pathname);
              if (typeof window !== "undefined") {
                localStorage.removeItem(`shikshasetu_tour_completed_${pageKey}`);
              }
              triggerPageTour(pageKey);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#49352F]/15 bg-white hover:bg-[#F2CAB3] text-[#49352F] text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            aria-label={t.tutorial?.replayTour || "Start Page Guided Tour"}
            title={t.tutorial?.replayTour || "Start Page Guided Tour"}
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#B26A1B] shrink-0" aria-hidden="true" />
            <span>{t.tutorial?.replayTour || "Tour"}</span>
          </button>

          {/* Tutorial & Help Center Link */}
          <Link
            href="/tutorial"
            aria-label={t.tutorial?.pageTitle || "Help & Tutorial Center"}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#49352F]/15 bg-white hover:bg-[#F2CAB3] text-[#49352F] text-xs font-bold transition-all shadow-xs whitespace-nowrap"
            title={t.tutorial?.pageTitle || "Help & Tutorial Center"}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#B26A1B] shrink-0" aria-hidden="true" />
            <span>{t.nav?.tutorial || "Tutorial"}</span>
          </Link>
        </div>

        {/* "More Tools" Dropdown on Screens < 2xl */}
        <div ref={moreMenuRef} className="relative 2xl:hidden">
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer shadow-xs flex items-center justify-center ${
              showMoreMenu
                ? "bg-[#F2CAB3] border-[#49352F]/30 text-[#49352F]"
                : "bg-white border-[#49352F]/15 hover:bg-[#FAF6E9] text-[#49352F]"
            }`}
            aria-label="More tools and demo options"
            title="More Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-2xl border border-[#49352F]/15 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-[#49352F]/10 mb-1">
                <p className="text-[11px] font-semibold text-[#7A6862] uppercase tracking-wider">
                  Platform Tools & Demo
                </p>
              </div>

              {/* Hackathon Demo Tag */}
              <div className="p-2 mb-1 rounded-xl bg-[#FAF6E9] border border-[#49352F]/10 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-[#49352F]">
                  <Sparkles className="w-3.5 h-3.5 text-[#B26A1B]" />
                  <span>SFIC Gujarat Hackathon Demo</span>
                </div>
                <p className="text-[11px] text-[#7A6862] mt-0.5">
                  AI Parent-School Language Bridge • Gandhinagar
                </p>
              </div>

              {/* Replay Guided Tour */}
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  const pageKey = getPageTourKey(pathname);
                  if (typeof window !== "undefined") {
                    localStorage.removeItem(`shikshasetu_tour_completed_${pageKey}`);
                  }
                  triggerPageTour(pageKey);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#49352F] hover:bg-[#FAF6E9] rounded-xl transition-colors text-left cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#B26A1B]" />
                <span>{t.tutorial?.replayTour || "Replay Guided Tour"}</span>
              </button>

              {/* Tutorial & Help */}
              <Link
                href="/tutorial"
                onClick={() => setShowMoreMenu(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#49352F] hover:bg-[#FAF6E9] rounded-xl transition-colors text-left"
              >
                <HelpCircle className="w-4 h-4 text-[#B26A1B]" />
                <span>{t.tutorial?.pageTitle || "Help & Tutorial Center"}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Dark/Light Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Icon with active indicator */}
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-[#49352F] hover:bg-[#FAF6E9] border border-[#49352F]/15 bg-white transition-colors cursor-pointer shadow-xs"
            aria-label="Learning Gap Notifications"
            title="Learning Gap Notifications"
          >
            <Bell className="w-4 h-4" />
            {urgentGaps.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C54738] ring-2 ring-white animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-3 shadow-2xl border border-[#49352F]/15 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-[#49352F]/10">
                <span className="font-semibold text-xs text-[#49352F]">Learning Gap Alerts</span>
                <span className="text-[10px] bg-[#C54738]/15 text-[#C54738] border border-[#C54738]/20 px-1.5 py-0.5 rounded-full font-bold">
                  {urgentGaps.length} Urgent
                </span>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                {urgentGaps.length === 0 ? (
                  <p className="text-[#7A6862] text-center py-2 text-xs">
                    No active high priority gaps detected!
                  </p>
                ) : (
                  urgentGaps.slice(0, 3).map((gap) => (
                    <Link
                      key={gap.id}
                      href={`/students/${gap.studentId}`}
                      onClick={() => setNotificationsOpen(false)}
                      className="block p-2 rounded-xl bg-[#FAF6E9] hover:bg-[#F2DCB5]/40 border border-[#49352F]/10 transition-colors"
                    >
                      <p className="font-semibold text-[#49352F]">
                        {gap.studentName} (Class {gap.grade}-A)
                      </p>
                      <p className="text-[#7A6862] text-[11px] mt-0.5">
                        Needs Support in {gap.conceptName} ({gap.latestPercentage}%).
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DEDICATED, FULLY VISIBLE ACCOUNT CENTER                                    */}
        {/* ========================================================================= */}
        <div ref={roleMenuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            aria-expanded={showRoleMenu}
            aria-haspopup="menu"
            aria-label="Account Center and Role Switcher"
            className={`flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs whitespace-nowrap ${
              showRoleMenu
                ? "bg-[#FAF6E9] border-[#B26A1B] ring-2 ring-[#F2CAB3]/40"
                : "bg-white border-[#49352F]/15 hover:bg-[#FAF6E9] hover:border-[#49352F]/30"
            }`}
          >
            {/* Circular Profile Avatar */}
            <div className="w-7 h-7 rounded-full bg-[#F2CAB3] border border-[#49352F]/20 text-[#49352F] flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              {getRoleBadgeInitial()}
            </div>

            {/* Account Details Label */}
            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold text-[#49352F] leading-tight">
                {user?.name || "Pooja Sharma"}
              </div>
              <div className="text-[10px] text-[#B26A1B] font-medium">
                {getRoleLabel()}
              </div>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 text-[#7A6862] shrink-0 transition-transform duration-150 ${
                showRoleMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Account Center Dropdown Menu */}
          {showRoleMenu && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-72 rounded-2xl bg-white p-2.5 shadow-2xl border border-[#49352F]/15 z-50 animate-in fade-in-50 zoom-in-95 duration-100"
            >
              {/* Account Details Header */}
              <div className="p-3 bg-[#FAF6E9] rounded-xl border border-[#49352F]/10 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#F2CAB3] border border-[#49352F]/20 text-[#49352F] flex items-center justify-center text-sm font-bold shrink-0 shadow-xs">
                    {getRoleBadgeInitial()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-xs text-[#49352F] truncate">
                      {user?.name || "Pooja Sharma"}
                    </p>
                    <p className="text-[11px] text-[#7A6862] truncate">
                      {user?.email || "teacher@shikshasetu.edu.in"}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-[#B26A1B] bg-white border border-[#49352F]/15 px-1.5 py-0.5 rounded-md">
                      {getRoleLabel()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Switcher Section */}
              <div className="px-2 py-1 text-[11px] font-semibold text-[#7A6862] uppercase tracking-wider">
                Switch Active Persona
              </div>

              <div className="space-y-1 mt-1">
                {/* Teacher Role */}
                <button
                  type="button"
                  onClick={() => {
                    switchRole("teacher");
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    role === "teacher"
                      ? "bg-[#F2CAB3]/50 text-[#49352F] font-semibold"
                      : "text-[#49352F] hover:bg-[#FAF6E9]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-white border border-[#49352F]/10 shrink-0">
                      <UserCheck className="w-3.5 h-3.5 text-[#2E7D5E]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#49352F] truncate">Pooja Sharma</div>
                      <div className="text-[10px] text-[#7A6862] truncate">Class Teacher (Class 4-A)</div>
                    </div>
                  </div>
                  {role === "teacher" && (
                    <Check className="w-4 h-4 text-[#B26A1B] shrink-0" />
                  )}
                </button>

                {/* Administrator Role */}
                <button
                  type="button"
                  onClick={() => {
                    switchRole("admin");
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    role === "admin"
                      ? "bg-[#F2CAB3]/50 text-[#49352F] font-semibold"
                      : "text-[#49352F] hover:bg-[#FAF6E9]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-white border border-[#49352F]/10 shrink-0">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#B26A1B]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#49352F] truncate">Principal R.K. Trivedi</div>
                      <div className="text-[10px] text-[#7A6862] truncate">School Administrator</div>
                    </div>
                  </div>
                  {role === "admin" && (
                    <Check className="w-4 h-4 text-[#B26A1B] shrink-0" />
                  )}
                </button>

                {/* Parent Role */}
                <button
                  type="button"
                  onClick={() => {
                    switchRole("parent");
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    role === "parent"
                      ? "bg-[#F2CAB3]/50 text-[#49352F] font-semibold"
                      : "text-[#49352F] hover:bg-[#FAF6E9]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-white border border-[#49352F]/10 shrink-0">
                      <Users className="w-3.5 h-3.5 text-[#49352F]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#49352F] truncate">Dineshbhai Patel</div>
                      <div className="text-[10px] text-[#7A6862] truncate">Parent (Aarav Patel, Class 4-A)</div>
                    </div>
                  </div>
                  {role === "parent" && (
                    <Check className="w-4 h-4 text-[#B26A1B] shrink-0" />
                  )}
                </button>
              </div>

              {/* Account Actions Footer */}
              <div className="border-t border-[#49352F]/10 mt-2 pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setShowRoleMenu(false);
                    router.push("/");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#C54738] hover:bg-[#C54738]/10 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-[#C54738]" />
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
