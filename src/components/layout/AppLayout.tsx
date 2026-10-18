"use client";

import React, { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { HackathonDemoBanner } from "./HackathonDemoBanner";

interface AppLayoutProps {
  children: React.ReactNode;
  showDemoBanner?: boolean;
}

export function AppLayout({ children, showDemoBanner = true }: AppLayoutProps) {
  const [currentClass, setCurrentClass] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a13] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar navigation */}
      <AppSidebar />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all">
        {/* Top header navigation */}
        <AppHeader
          currentClass={currentClass}
          onClassChange={setCurrentClass}
          onSearchChange={setSearchTerm}
        />

        {/* Page body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {showDemoBanner && <HackathonDemoBanner />}
          {children}
        </main>
      </div>
    </div>
  );
}
