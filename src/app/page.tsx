"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { RobotCanvas } from "@/components/3d/RobotCanvas";
import { Tilt3DCard } from "@/components/3d/Tilt3DCard";
import { PerspectiveDashboardPreview } from "@/components/3d/PerspectiveDashboardPreview";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  Users,
  Compass,
  Layers,
  Award,
  ChevronDown,
  BookOpen,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  BrainCircuit,
  Lightbulb,
  GraduationCap,
  Heart,
  Send,
  Mail,
  MapPin,
  ExternalLink,
  Cpu,
  Eye,
  Activity,
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.querySelector(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackEmail) {
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 4000);
      setFeedbackEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500 selection:text-black flex flex-col justify-between scroll-smooth overflow-x-hidden font-sans">
      {/* 1. Sticky Transparent-to-Glass 3D Navbar */}
      <LandingNavbar />

      {/* ================================================================ */}
      {/* 2. CINEMATIC 3D HERO SECTION (Inspired by Reference Image)      */}
      {/* ================================================================ */}
      <section
        id="hero"
        className="relative min-h-[92vh] lg:min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-20 flex flex-col justify-between items-center overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.35),rgba(7,11,20,1))]"
      >
        {/* Atmospheric Studio Spotlight Vignette */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] sm:h-[600px] bg-[radial-gradient(circle,rgba(0,240,255,0.15)_0%,rgba(99,102,241,0.08)_40%,transparent_70%)] pointer-events-none -z-10 blur-2xl" />

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            {/* Left Column: Headline, Subtitle, CTAs */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-6 z-10">
              {/* Hackathon Badge with Electric Cyan Accent */}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)] backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>SFIC Gujarat Hackathon 2026 • Problem Statement PS-60</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                {language === "gu" ? (
                  <>
                    દરેક શિક્ષણ ત્રુટિ{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]">
                      એક નવી તક છે.
                    </span>
                  </>
                ) : (
                  <>
                    Every Learning Gap Is an{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]">
                      Opportunity.
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {language === "gu"
                  ? "શિક્ષકોને શિક્ષણ ત્રુટિઓ શોધવામાં, વ્યક્તિગત સહાય આપવામાં અને દરેક બાળકને આત્મવિશ્વાસ સાથે શીખવવામાં મદદ કરે છે."
                  : "Helping teachers discover learning gaps, deliver personalized support, and empower every child to learn with confidence."}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-sm font-extrabold shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>{language === "gu" ? "શિક્ષાસેતુ AI જુઓ" : "Explore ShikshaSetu AI"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-bold shadow-md hover:border-slate-500 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>{language === "gu" ? "આ કેવી રીતે કાર્ય કરે છે?" : "Discover How It Works"}</span>
                </a>
              </div>

              {/* Live Status Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-semibold text-slate-200">100% Offline-First AI</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Zero Paid External APIs</span>
                </div>
              </div>
            </div>

            {/* Right Column: Prominent 3D Robot Mascot (ShikshaBot) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
              {/* Floating Speech Bubble */}
              <div className="mb-2 z-20 transition-all duration-300">
                <div className="relative bg-slate-900/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.2)] text-slate-100 text-xs font-semibold text-center leading-snug">
                  <div className="flex items-center justify-center gap-1.5 text-cyan-400 mb-0.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest">ShikshaBot 3D</span>
                  </div>
                  <p>{language === "gu" ? "નમસ્તે! હું શિક્ષાબોટ છું. ચાલો સાથે મળીને શિક્ષણને વધુ બહેતર બનાવીએ!" : "Hi! I'm ShikshaBot. Let's make learning better for everyone!"}</p>
                </div>
              </div>

              {/* Real WebGL 3D Canvas with Cursor Tracking & Studio Lighting */}
              <RobotCanvas scrollProgress={scrollProgress} />
            </div>
          </div>
        </div>

        {/* Cinematic "↓ SCROLL ↓" Indicator Inspired by Reference Image */}
        <div className="mt-8 text-center">
          <a
            href="#challenge"
            onClick={(e) => handleSmoothScroll(e, "#challenge")}
            aria-label="Scroll down to explore sections"
            className="inline-flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors animate-bounce cursor-pointer group"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover:text-cyan-400">
              ↓ SCROLL ↓
            </span>
          </a>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3. SECTION 2: THE CHALLENGE (3D Tilt Cards)                     */}
      {/* ================================================================ */}
      <section id="challenge" className="py-20 sm:py-28 bg-[#0b0f19] border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/40 px-3.5 py-1 rounded-full border border-rose-800/60 uppercase tracking-widest">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>The Primary Education Reality</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {language === "gu" ? "દરેક બાળકની શીખવાની ગતિ અલગ હોય છે." : "Every Child Learns Differently."}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Students struggle with different concepts, and teachers need clear insights to provide targeted support in crowded classrooms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <Tilt3DCard glowColor="rgba(244, 63, 94, 0.2)">
              <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 shadow-xl backdrop-blur-md h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-5 font-black text-lg border border-rose-500/30">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Learning Gaps Go Unnoticed
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    In a classroom of 30+ students, subtle conceptual hurdles in foundational division, place value, or language comprehension often get lost behind aggregate test marks.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Hidden until year-end exams</span>
                </div>
              </div>
            </Tilt3DCard>

            {/* Card 2 */}
            <Tilt3DCard glowColor="rgba(245, 158, 11, 0.2)">
              <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 shadow-xl backdrop-blur-md h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-5 font-black text-lg border border-amber-500/30">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Every Student Needs Different Support
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    One-size-fits-all rote repetition fails. One child needs physical counting beads, while another needs visual number lines and scaffolded peer support.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Requires targeted pedagogy</span>
                </div>
              </div>
            </Tilt3DCard>

            {/* Card 3 */}
            <Tilt3DCard glowColor="rgba(0, 240, 255, 0.2)">
              <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 shadow-xl backdrop-blur-md h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 font-black text-lg border border-cyan-500/30">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Progress Should Be Measurable
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Without empirical percentage-point tracking before and after an intervention, teachers and parents cannot verify whether a gap has genuinely closed.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Objective proof of mastery</span>
                </div>
              </div>
            </Tilt3DCard>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 4. SECTION 3: OUR SOLUTION (3D Learning Pipeline)               */}
      {/* ================================================================ */}
      <section id="solution" className="py-20 sm:py-28 bg-[#070b14] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-950/40 px-3.5 py-1 rounded-full border border-cyan-800/60 uppercase tracking-widest">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Integrated Pedagogical Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {language === "gu" ? "તમારો સ્માર્ટ શિક્ષણ સાથી." : "Meet Your Smarter Learning Companion."}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              ShikshaSetu AI helps teachers identify student learning difficulties and organize structured remedial curricula in minutes.
            </p>
          </div>

          {/* 4-Stage Workflow with Progressive Illumination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Phase 1 */}
            <Tilt3DCard glowColor="rgba(99, 102, 241, 0.25)">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 shadow-xl backdrop-blur-md h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold uppercase text-indigo-400 tracking-wider mb-1">Phase 1</div>
                  <h4 className="text-base font-bold text-white mb-2">Concept Assessment</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Record periodic classroom marks tied directly to granular competency benchmarks.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Single-click scoring grid</span>
                </div>
              </div>
            </Tilt3DCard>

            {/* Phase 2 */}
            <Tilt3DCard glowColor="rgba(245, 158, 11, 0.25)">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 shadow-xl backdrop-blur-md h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-1">Phase 2</div>
                  <h4 className="text-base font-bold text-white mb-2">Gap Detection</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Rule-based engine flags students needing support with transparent human explanations.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explainable logic</span>
                </div>
              </div>
            </Tilt3DCard>

            {/* Phase 3 */}
            <Tilt3DCard glowColor="rgba(56, 189, 248, 0.25)">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 shadow-xl backdrop-blur-md h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/30">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold uppercase text-sky-400 tracking-wider mb-1">Phase 3</div>
                  <h4 className="text-base font-bold text-white mb-2">Personalized Remediation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generates concrete 5-step lesson plans using low-cost materials like beads and number lines.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Digital & printed formats</span>
                </div>
              </div>
            </Tilt3DCard>

            {/* Phase 4 */}
            <Tilt3DCard glowColor="rgba(0, 240, 255, 0.3)">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.15)] backdrop-blur-md h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-4 border border-cyan-500/30">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold uppercase text-cyan-400 tracking-wider mb-1">Phase 4</div>
                  <h4 className="text-base font-bold text-white mb-2">Empirical Reassessment</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Measures true percentage-point delta to verify that the student has achieved mastery.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-semibold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verified +50 pp recovery</span>
                </div>
              </div>
            </Tilt3DCard>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. SECTION 4: PLATFORM FEATURES (3D Perspective Cards)          */}
      {/* ================================================================ */}
      <section id="features" className="py-20 sm:py-28 bg-[#0b0f19] border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-950/40 px-3.5 py-1 rounded-full border border-cyan-800/60 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core System Modules</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {language === "gu" ? "શિક્ષકો માટે જરૂરી તમામ સાધનો." : "Everything Teachers Need to Support Every Learner."}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Four integrated pedagogical pillars designed for primary school classrooms, available in English and Gujarati.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Tilt3DCard glowColor="rgba(99, 102, 241, 0.3)">
              <div className="p-7 rounded-3xl bg-slate-900/85 border border-slate-800 hover:border-indigo-500/60 shadow-xl backdrop-blur-md h-full flex flex-col justify-between group cursor-pointer">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/40 group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-6 h-6 text-indigo-300" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    1. Smart Gap Detection
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    Rule-based algorithmic identification flags conceptual roadblocks with transparent, pedagogical reasons.
                  </p>
                </div>
                <div className="text-xs font-bold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Gap Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Tilt3DCard>

            {/* Feature 2 */}
            <Tilt3DCard glowColor="rgba(245, 158, 11, 0.3)">
              <div className="p-7 rounded-3xl bg-slate-900/85 border border-slate-800 hover:border-amber-500/60 shadow-xl backdrop-blur-md h-full flex flex-col justify-between group cursor-pointer">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/30 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/40 group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6 text-amber-300" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    2. Personalized Remedial Plans
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    Actionable 5-step curriculum using physical classroom manipulatives like beads, number lines, and flashcards.
                  </p>
                </div>
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore Plans</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Tilt3DCard>

            {/* Feature 3 */}
            <Tilt3DCard glowColor="rgba(56, 189, 248, 0.3)">
              <div className="p-7 rounded-3xl bg-slate-900/85 border border-slate-800 hover:border-sky-500/60 shadow-xl backdrop-blur-md h-full flex flex-col justify-between group cursor-pointer">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/30 text-sky-400 flex items-center justify-center mb-5 border border-sky-500/40 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-sky-300" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    3. Interactive Activities & Quizzes
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    Interactive digital quizzes with real-time feedback, plus printable offline paper worksheets for rural classrooms.
                  </p>
                </div>
                <div className="text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Launch Quiz Bank</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Tilt3DCard>

            {/* Feature 4 */}
            <Tilt3DCard glowColor="rgba(0, 240, 255, 0.3)">
              <div className="p-7 rounded-3xl bg-slate-900/85 border border-slate-800 hover:border-cyan-500/60 shadow-xl backdrop-blur-md h-full flex flex-col justify-between group cursor-pointer">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/30 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/40 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    4. Student Progress Analytics
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    Empirical before/after percentage-point tracking, classroom mastery trends, and print-ready report cards.
                  </p>
                </div>
                <div className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>See Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Tilt3DCard>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. SECTION 5: INTERACTIVE 3D DASHBOARD PREVIEW                  */}
      {/* ================================================================ */}
      <section id="preview" className="py-20 sm:py-28 bg-[#070b14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-950/40 px-3.5 py-1 rounded-full border border-cyan-800/60 uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5" />
              <span>Live Demonstration Console</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {language === "gu" ? "વર્ગખંડનું સ્માર્ટ પૂર્વાવલોકન" : "Interactive Dashboard Preview"}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Explore the actual intelligence interface teachers use every day to identify learning gaps and trigger personalized remediation.
            </p>
          </div>

          {/* Perspective 3D Straightening Dashboard Container */}
          <div className="max-w-5xl mx-auto">
            <PerspectiveDashboardPreview />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7. SECTION 6: HOW IT WORKS                                      */}
      {/* ================================================================ */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#0b0f19] border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-950/40 px-3.5 py-1 rounded-full border border-cyan-800/60 uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5" />
              <span>4-Step Classroom Flow</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {language === "gu" ? "આ કેવી રીતે કાર્ય કરે છે?" : "How ShikshaSetu AI Works in Practice"}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              A continuous improvement cycle designed to fit naturally into everyday primary teaching schedules.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row items-start gap-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-black text-lg shrink-0 border border-indigo-500/40">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  Assess Student Understanding
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Teachers enter marks on short, concept-focused diagnostic assessments (e.g. 5 questions on 2-digit division). The system safely calculates percentages without manual spreadsheets.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col sm:flex-row items-start gap-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/30 text-amber-400 flex items-center justify-center font-black text-lg shrink-0 border border-amber-500/40">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  Identify Specific Learning Gaps
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  The rule engine flags students scoring under the 60% mastery threshold. It provides an explicit, pedagogical reason &mdash; e.g. &ldquo;Fails equal sharing with remainders without visual aid.&rdquo;
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col sm:flex-row items-start gap-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/30 text-sky-400 flex items-center justify-center font-black text-lg shrink-0 border border-sky-500/40">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  Deliver Personalized Remedial Activities
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  With one click, an actionable 5-step remedial plan is generated with specific hands-on manipulatives (beads, counters, flashcards) and interactive quizzes.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col sm:flex-row items-start gap-5 p-6 rounded-3xl bg-cyan-950/30 border border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/30 text-cyan-300 flex items-center justify-center font-black text-lg shrink-0 border border-cyan-500/40">
                4
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  Measure Improvement Through Reassessment
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Following the intervention, the teacher enters the re-test score. The system automatically computes the positive percentage-point delta and upgrades the student to &ldquo;Mastered.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 8. SECTION 7: STUDENT LEARNING IMPACT                           */}
      {/* ================================================================ */}
      <section id="impact" className="py-20 sm:py-28 bg-[#070b14] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-950/40 px-3.5 py-1 rounded-full border border-cyan-800/60 uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              <span>Verifiable Pedagogical Results</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {language === "gu" ? "નાના પગલાં. મજબૂત પાયો." : "Small Steps. Stronger Foundations."}
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Empirical evidence from our demonstration cohort showing how targeted remediation closes learning gaps.
            </p>
          </div>

          {/* 4 Impact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mb-12">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 text-center backdrop-blur-md">
              <div className="text-3xl sm:text-5xl font-black text-cyan-400 mb-1 drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">+50 pp</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Demonstrated Growth</div>
              <p className="text-[11px] text-slate-400 mt-2">Aarav Patel (Class 4): 35% &rarr; 85% in Division Basics</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 text-center backdrop-blur-md">
              <div className="text-3xl sm:text-5xl font-black text-sky-400 mb-1">100%</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Offline Resilience</div>
              <p className="text-[11px] text-slate-400 mt-2">Runs locally in rural schools without paid API dependencies</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 text-center backdrop-blur-md">
              <div className="text-3xl sm:text-5xl font-black text-amber-400 mb-1">5-Step</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Concrete Curricula</div>
              <p className="text-[11px] text-slate-400 mt-2">Physical manipulatives, grouping, and guided drills</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 text-center backdrop-blur-md">
              <div className="text-3xl sm:text-5xl font-black text-indigo-400 mb-1">2 Modes</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Digital & Paper</div>
              <p className="text-[11px] text-slate-400 mt-2">Interactive student quizzes plus print-ready paper sheets</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 9. SECTION 8: FINAL 3D CALL TO ACTION                           */}
      {/* ================================================================ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#070b14] text-white relative overflow-hidden border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-950/60 border border-cyan-800/60 px-4 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Dedicated to Gujarat Primary Education</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === "gu" ? "ચાલો દરેક બાળકને આગળ વધારીએ." : "Let's Help Every Child Move Forward."}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {language === "gu"
              ? "આજથી જ શિક્ષણ ત્રુટિઓ ઓળખો અને વર્ગખંડના શિક્ષણને સાર્થક બનાવો."
              : "Start identifying learning gaps and turn classroom insights into meaningful action for every student."}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-cyan-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-sm font-black shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{language === "gu" ? "ડેશબોર્ડ ખોલો" : "Get Started Now"}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <a
              href="#features"
              onClick={(e) => handleSmoothScroll(e, "#features")}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white text-sm font-bold transition-all cursor-pointer"
            >
              <span>{language === "gu" ? "વિશેષતાઓ જુઓ" : "Explore Features"}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 10. SECTION 9: PROFESSIONAL FOOTER & CONTACT                   */}
      {/* ================================================================ */}
      <footer id="contact" className="bg-[#050810] text-slate-400 border-t border-slate-800/80 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Column 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  શ
                </div>
                <div>
                  <span className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                    ShikshaSetu AI
                    <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.2 rounded-full">3D</span>
                  </span>
                  <span className="block text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                    Smart Tracking & Remedial Action
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Empowering primary school teachers to identify conceptual learning gaps, deploy 5-step concrete remedial plans, and empirically measure student growth.
              </p>

              <div className="text-xs text-slate-500 pt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Gandhinagar, Gujarat, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>support@shikshasetu.edu.in</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#hero" onClick={(e) => handleSmoothScroll(e, "#hero")} className="hover:text-cyan-400 transition-colors">
                    Home (3D Hero)
                  </a>
                </li>
                <li>
                  <a href="#challenge" onClick={(e) => handleSmoothScroll(e, "#challenge")} className="hover:text-cyan-400 transition-colors">
                    The Challenge
                  </a>
                </li>
                <li>
                  <a href="#solution" onClick={(e) => handleSmoothScroll(e, "#solution")} className="hover:text-cyan-400 transition-colors">
                    Our Solution
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={(e) => handleSmoothScroll(e, "#features")} className="hover:text-cyan-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "#how-it-works")} className="hover:text-cyan-400 transition-colors">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Live Application Routes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">App Portal</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                    Teacher Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/students" className="hover:text-cyan-400 transition-colors">
                    Student Directory
                  </Link>
                </li>
                <li>
                  <Link href="/learning-gaps" className="hover:text-cyan-400 transition-colors">
                    Learning Gaps Engine
                  </Link>
                </li>
                <li>
                  <Link href="/remedial-plans" className="hover:text-cyan-400 transition-colors">
                    Remedial Plans
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="hover:text-cyan-400 transition-colors">
                    Printable Reports
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-cyan-400 transition-colors">
                    Sign In (Demo Access)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Feedback / Inquiry */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hackathon Contact</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Send feedback or request a live demonstration for your school.
              </p>
              <form onSubmit={handleFeedbackSubmit} className="space-y-2">
                <input
                  type="email"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  placeholder="teacher@school.edu.in"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-3 text-xs font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
                {feedbackSent && (
                  <p className="text-[11px] text-cyan-400 font-medium">Thank you! Inquiry received.</p>
                )}
              </form>
            </div>
          </div>

          {/* Bottom Copyright & Hackathon Info */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} ShikshaSetu AI • Developed for SFIC Gujarat Hackathon 2026 (Problem Statement PS-60).
            </div>
            <div className="flex items-center gap-4">
              <span>Bilingual: English &amp; ગુજરાતી</span>
              <span>•</span>
              <span className="text-cyan-400 font-semibold">Interactive 3D WebGL Edition</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
