"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";
import { Menu, X, ArrowRight, Sparkles, LogIn, Compass } from "lucide-react";

export function LandingNavbar() {
  const { t, language } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("#hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 25);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);

      // Active section detection
      const sections = ["#hero", "#challenge", "#diagnostics", "#how-it-works", "#impact", "#contact"];
      for (const sec of sections) {
        const el = document.querySelector(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: language === "gu" ? "મુખ્ય પૃષ્ઠ" : "Home", href: "#hero" },
    { label: language === "gu" ? "શિક્ષણ ત્રુટિ" : "The Challenge", href: "#challenge" },
    { label: language === "gu" ? "નિદાન પ્રણાલી" : "Diagnostics", href: "#diagnostics" },
    { label: language === "gu" ? "કાર્ય પદ્ધતિ" : "How It Works", href: "#how-it-works" },
    { label: language === "gu" ? "અસર" : "Our Impact", href: "#impact" },
    { label: language === "gu" ? "સંપર્ક" : "Contact", href: "#contact" },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* 3D Electric Glowing Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-slate-900/40 z-50 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-sky-400 shadow-[0_0_12px_#00f0ff] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg py-3"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="#hero" onClick={(e) => handleSmoothScroll(e, "#hero")} className="cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                શ
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                  ShikshaSetu AI
                  <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.2 rounded-full">3D</span>
                </span>
                <span className="text-[9px] text-slate-400 tracking-wider font-medium uppercase">
                  Smart Tracking System
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links with Active Indicator */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 border border-slate-700/80 bg-slate-900/60 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.nav?.login || "Sign In"}</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all cursor-pointer"
            >
              <span>{language === "gu" ? "શરૂ કરો" : "Get Started"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 border border-slate-700 bg-slate-900/80 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-full bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800 shadow-2xl px-5 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    activeSection === item.href
                      ? "text-cyan-400 bg-cyan-950/60"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>{t.nav?.login || "Sign In"}</span>
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                <span>{language === "gu" ? "ડેશબોર્ડ ખોલો" : "Explore Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
