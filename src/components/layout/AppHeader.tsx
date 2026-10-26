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

  const searchInputRef = useRef<HTMLInputElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [urgentGaps, setUrgentGaps] = useState<any[]>([]);

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

  const handleSearchChange = (val: string) => {
    setCtxSearch(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleClearSearch = () => {
    handleSearchChange("");
    searchInputRef.current?.focus();
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && ctxSearch.trim()) {
      if (!pathname.startsWith("/students")) {
        router.push("/students");
      }
    }
  };

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search & Escape to close menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape") {
        setShowRoleMenu(false);
        setNotificationsOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (roleMenuRef.current && !roleMenuRef.current.contains(target)) {
        setShowRoleMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#49352F]/10 bg-[#F4F1E1]/90 px-2 sm:px-4 lg:px-6 backdrop-blur-md print:hidden transition-colors relative text-[#49352F]">
      {/* Mobile Full-Width Search Overlay */}
      {isMobileSearchOpen && (
        <div className="sm:hidden absolute inset-0 z-50 bg-[#FAF6E9] px-3 flex items-center gap-2 border-b border-[#49352F]/15 shadow-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A6862]" />
            <input
              autoFocus
              type="text"
              placeholder={language === "gu" ? "વિદ્યાર્થીઓ, ત્રુટિઓ શોધો..." : "Search students, gaps..."}
              value={ctxSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full h-10 rounded-xl border border-[#49352F]/20 bg-white py-2 pl-10 pr-8 text-xs text-[#49352F] placeholder-[#7A6862] outline-hidden focus:border-[#F2CAB3]"
            />
            {ctxSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#7A6862] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(false)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#49352F] hover:bg-[#F2DCB5]/40 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* 1. Left section: School info & Class selector */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
        <div className="hidden md:flex items-center gap-1.5 text-[#49352F] shrink-0">
          <Building className="h-4 w-4 text-[#B26A1B] shrink-0" />
          <span
            className="font-semibold text-xs lg:text-sm tracking-tight text-[#49352F] truncate max-w-[120px] lg:max-w-[150px] 2xl:max-w-none"
            title={`${t.app.demoSchoolName} (GUJ-GNR-042)`}
          >
            {t.app.demoSchoolName}
          </span>
          <span className="hidden 2xl:inline-block text-[11px] text-[#7A6862] font-normal shrink-0">
            (GUJ-GNR-042)
          </span>
        </div>

        {/* Current Class Selector */}
        <div className="flex items-center gap-1 bg-white border border-[#49352F]/15 rounded-xl px-1.5 sm:px-2 py-1 shadow-xs shrink-0 max-w-[90px] sm:max-w-[140px] xl:max-w-none">
          <GraduationCap className="h-3.5 w-3.5 text-[#7A6862] shrink-0" />
          <select
            value={currentClass}
            aria-label="Filter by class"
            onChange={(e) => handleClassChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-[#49352F] outline-hidden cursor-pointer max-w-[65px] sm:max-w-[110px] xl:max-w-none truncate"
          >
            <option value="all">{t.dashboard.allClasses}</option>
            <option value="cls-3a">Class 3 - Section A</option>
            <option value="cls-4a">Class 4 - Section A</option>
            <option value="cls-5a">Class 5 - Section A</option>
          </select>
        </div>
      </div>

      {/* 2. Center Search - Prominent, Large, and Accessible */}
      <div className="hidden xl:flex items-center flex-1 min-w-0 max-w-xs md:max-w-sm lg:max-w-md mx-2">
        <div className="relative w-full min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A6862] pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={
              language === "gu"
                ? "વિદ્યાર્થીઓ, લર્નિંગ ગેપ્સ અથવા વિષય શોધો..."
                : "Search students, learning gaps, concepts..."
            }
            value={ctxSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full h-9 rounded-2xl border-2 border-[#49352F]/15 bg-white py-1.5 pl-9 pr-14 text-xs sm:text-sm text-[#49352F] placeholder-[#7A6862] focus:bg-white focus:border-[#F2CAB3] focus:ring-3 focus:ring-[#F2CAB3]/30 outline-hidden transition-all shadow-xs"
          />
          {ctxSearch ? (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#7A6862] hover:text-[#49352F] hover:bg-[#FAF6E9] transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="hidden md:inline-flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-[#FAF6E9] border border-[#49352F]/15 text-[10px] font-mono font-semibold text-[#7A6862] pointer-events-none">
              Ctrl K
            </span>
          )}
        </div>
      </div>

      {/* 3. Right section: Demo tag, Language, Theme Toggle, Notifications, User Role */}
      <div className="flex items-center gap-1 sm:gap-1.5 2xl:gap-2 shrink-0 ml-auto">
        {/* Mobile / Tablet Search Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileSearchOpen(true)}
          className="xl:hidden p-2 rounded-xl border border-[#49352F]/15 bg-white text-[#49352F] hover:bg-[#FAF6E9] cursor-pointer shrink-0"
          aria-label="Open Search"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* AI Workspace Quick Launch */}
        <Link
          href="/ai"
          aria-label="AI Hub Workspace"
          className="inline-flex items-center gap-1.5 bg-[#F2CAB3] hover:bg-white text-[#49352F] border border-[#49352F]/15 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B26A1B] shrink-0" aria-hidden="true" />
          <span className="hidden xl:inline">AI Hub</span>
        </Link>

        {/* Hackathon Demo Tag */}
        <div className="hidden xl:inline-flex items-center gap-1 bg-[#F2DCB5]/60 border border-[#49352F]/15 text-[#49352F] px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0">
          <Sparkles className="w-3 h-3 text-[#B26A1B] shrink-0" aria-hidden="true" />
          <span className="hidden 2xl:inline">SFIC Gujarat Hackathon Demo</span>
          <span className="hidden xl:inline 2xl:hidden">SFIC Demo</span>
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
          className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#49352F]/15 bg-white hover:bg-[#F2CAB3] text-[#49352F] text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap shrink-0"
          aria-label={t.tutorial?.replayTour || "Start Page Guided Tour"}
          title={t.tutorial?.replayTour || "Start Page Guided Tour"}
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#B26A1B] shrink-0" aria-hidden="true" />
          <span className="hidden 2xl:inline whitespace-nowrap">{t.tutorial?.replayTour || "Replay Tour"}</span>
        </button>

        {/* Tutorial & Help Center Link */}
        <Link
          href="/tutorial"
          aria-label={t.tutorial?.pageTitle || "Help & Tutorial Center"}
          className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#49352F]/15 bg-white hover:bg-[#F2CAB3] text-[#49352F] text-xs font-bold transition-all shadow-xs whitespace-nowrap shrink-0"
          title={t.tutorial?.pageTitle || "Help & Tutorial Center"}
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#B26A1B] shrink-0" aria-hidden="true" />
          <span className="hidden 2xl:inline whitespace-nowrap">{t.nav?.tutorial || "Tutorial & Help"}</span>
        </Link>

        {/* Language Selector */}
        <div className="shrink-0">
          <LanguageSelector />
        </div>

        {/* Dark/Light Theme Toggle */}
        <div className="shrink-0">
          <ThemeToggle />
        </div>

        {/* Notifications Icon with active indicator */}
        <div ref={notificationsRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-[#49352F] hover:bg-[#FAF6E9] border border-[#49352F]/15 bg-white transition-colors cursor-pointer shadow-xs shrink-0"
            title="Learning Gap Notifications"
          >
            <Bell className="w-4 h-4" />
            {urgentGaps.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C54738] ring-2 ring-white animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-3 shadow-xl border border-[#49352F]/15 z-50">
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

        {/* User Profile & Role Switcher (Account Center) */}
        <div ref={roleMenuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            aria-expanded={showRoleMenu}
            aria-haspopup="true"
            aria-label="Account Center and Role Switcher"
            className="flex items-center gap-1 sm:gap-2 p-1.5 sm:pl-2 sm:pr-2.5 rounded-xl border border-[#49352F]/15 bg-white hover:bg-[#FAF6E9] transition-colors cursor-pointer shadow-xs whitespace-nowrap shrink-0"
          >
            <div className="w-6 h-6 rounded-full bg-[#F2CAB3] border border-[#49352F]/15 text-[#49352F] flex items-center justify-center text-xs font-bold shrink-0">
              {role === "admin" ? "A" : role === "parent" ? "P" : "T"}
            </div>
            <div className="text-left hidden xl:block shrink-0">
              <div className="text-xs font-semibold text-[#49352F] leading-tight truncate max-w-[80px] 2xl:max-w-none">
                {user?.name || "Teacher"}
              </div>
              <div className="text-[10px] text-[#B26A1B] font-medium capitalize truncate max-w-[80px] 2xl:max-w-none">
                {role === "admin" ? t.app.adminRole : role === "parent" ? "Guardian/Parent" : t.app.teacherRole}
              </div>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-[#7A6862] shrink-0" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-[#49352F]/15 z-50">
              <div className="px-3 py-2 border-b border-[#49352F]/10 mb-1">
                <p className="text-[11px] font-semibold text-[#7A6862] uppercase tracking-wider">
                  Switch Active Role
                </p>
                <p className="text-xs text-[#7A6862] mt-0.5">Explore with different permissions</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  switchRole("teacher");
                  setShowRoleMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-left transition-colors cursor-pointer ${
                  role === "teacher"
                    ? "bg-[#F2CAB3]/40 text-[#49352F] font-semibold"
                    : "text-[#49352F] hover:bg-[#FAF6E9]"
                }`}
              >
                <UserCheck className="w-4 h-4 text-[#2E7D5E]" />
                <div>
                  <div className="font-semibold text-[#49352F]">Pooja Sharma</div>
                  <div className="text-[10px] text-[#7A6862]">Class Teacher (Class 4-A)</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole("admin");
                  setShowRoleMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-left transition-colors mt-1 cursor-pointer ${
                  role === "admin"
                    ? "bg-[#F2CAB3]/40 text-[#49352F] font-semibold"
                    : "text-[#49352F] hover:bg-[#FAF6E9]"
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-[#B26A1B]" />
                <div>
                  <div className="font-semibold text-[#49352F]">Principal R.K. Trivedi</div>
                  <div className="text-[10px] text-[#7A6862]">School Administrator</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole("parent");
                  setShowRoleMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-left transition-colors mt-1 cursor-pointer ${
                  role === "parent"
                    ? "bg-[#F2CAB3]/40 text-[#49352F] font-semibold"
                    : "text-[#49352F] hover:bg-[#FAF6E9]"
                }`}
              >
                <Users className="w-4 h-4 text-[#49352F]" />
                <div>
                  <div className="font-semibold text-[#49352F]">Dineshbhai Patel</div>
                  <div className="text-[10px] text-[#7A6862]">Parent (Aarav Patel, Class 5-A)</div>
                </div>
              </button>

              <div className="border-t border-[#49352F]/10 my-1 pt-1">
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
