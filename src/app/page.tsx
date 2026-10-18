"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { CinematicStudioCanvas } from "@/components/3d/CinematicStudioCanvas";
import { useLanguage } from "@/context/LanguageContext";
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
  BookOpen,
  ShieldCheck,
  BrainCircuit,
  Lightbulb,
  Heart,
  Send,
  Mail,
  MapPin,
  ExternalLink,
  Cpu,
  Activity,
  LogIn,
  ChevronDown,
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      // 6 scenes (0 to 5)
      const p = Math.max(0, Math.min(5, scrollY / Math.max(1, vh)));
      setScrollProgress(p);
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
    <div className="relative min-h-screen bg-[#05070e] text-slate-100 selection:bg-cyan-500 selection:text-black overflow-x-hidden font-sans">
      {/* 1. Persistent WebGL 3D Cinematic Studio Canvas in Background */}
      <CinematicStudioCanvas progress={scrollProgress} />

      {/* 2. Top Slim Transparent-to-Glass Navbar */}
      <LandingNavbar />

      {/* ================================================================ */}
      {/* SCENE 1: CINEMATIC HERO (Matching Target Image 2 Exactly)       */}
      {/* ================================================================ */}
      <section
        id="hero"
        className="relative min-h-[100svh] w-full flex flex-col justify-between pt-28 pb-10 sm:pt-36 sm:pb-14 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto z-10"
      >
        {/* Left-Aligned Typography Directly Matching Reference Image 2 */}
        <div className="my-auto max-w-2xl text-left space-y-4 sm:space-y-6 pt-8 sm:pt-12">
          {/* Subtle Studio Eyebrow Text */}
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.35em] text-cyan-400/90 font-mono">
            {language === "gu" ? "શિક્ષાસેતુ AI પ્રસ્તુત કરે છે" : "SHIKSHASETU AI PRESENTS"}
          </p>

          {/* Minimal Clean Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
            {language === "gu" ? "શિક્ષાબોટને મળો" : "Meet ShikshaBot"}
          </h1>

          {/* Subtitles: Minimal & Elegant */}
          <div className="space-y-2 pt-1 sm:pt-2">
            <p className="text-base sm:text-xl lg:text-2xl font-light text-slate-200 tracking-wide leading-relaxed">
              {language === "gu"
                ? "ઉજ્જવળ શિક્ષણ ભવિષ્ય માટેનો બુદ્ધિશાળી સાથી."
                : "An intelligent companion for a brighter learning future."}
            </p>
            <p className="text-sm sm:text-base font-normal text-slate-400 tracking-normal leading-relaxed">
              {language === "gu"
                ? "દરેક બાળકને આત્મવિશ્વાસ સાથે શીખવવામાં મદદ કરે છે."
                : "Helping every child learn with confidence."}
            </p>
          </div>

          {/* Discreet Identity Badge */}
          <div className="pt-4 flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
            <span>SFIC Gujarat Hackathon 2026 • Problem Statement PS-60</span>
          </div>
        </div>

        {/* Minimal "↓ SCROLL TO EXPLORE" indicator as seen in Image 2 */}
        <div className="pt-8">
          <a
            href="#challenge"
            onClick={(e) => handleSmoothScroll(e, "#challenge")}
            aria-label="Scroll down to explore sections"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors animate-bounce cursor-pointer group"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 group-hover:text-cyan-300">
              ↓ SCROLL TO EXPLORE
            </span>
          </a>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SCENE 2: THE CHALLENGE ("Every Child Learns Differently.")      */}
      {/* ================================================================ */}
      <section
        id="challenge"
        className="relative min-h-[100svh] w-full flex items-center py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto z-10"
      >
        <div className="max-w-xl text-left space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-950/40 px-3.5 py-1 text-xs font-semibold text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)] backdrop-blur-md">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>The Primary Classroom Reality</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {language === "gu" ? "દરેક બાળકની શીખવાની ગતિ અલગ હોય છે." : "Every Child Learns Differently."}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {language === "gu"
              ? "૩૦થી વધુ વિદ્યાર્થીઓ ધરાવતા વર્ગખંડમાં, ગણિત કે ભાષાના પાયાના ખ્યાલોમાં રહેલી ત્રુટિઓ સામાન્ય ગુણ પાછળ છુપાઈ જાય છે."
              : "In crowded classrooms of 30+ students, subtle conceptual hurdles in foundational division, place value, or language comprehension often get lost behind aggregate test marks."}
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl hover:border-rose-500/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Hidden Learning Gaps</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Aggregate pass marks mask specific misunderstandings until end-of-year exams.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl hover:border-amber-500/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Rote Repetition Fails</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    One child needs tactile counting beads, while another needs visual number lines.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Unmeasured Progress</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Without empirical percentage-point tracking, teachers cannot verify true recovery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SCENE 3: DIAGNOSTICS ("Understand. Don't Just Measure.")         */}
      {/* ================================================================ */}
      <section
        id="diagnostics"
        className="relative min-h-[100svh] w-full flex items-center py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto z-10"
      >
        <div className="max-w-xl text-left space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)] backdrop-blur-md">
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Smart Gap Detection Engine</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {language === "gu" ? "સમજો. ફક્ત માપશો નહીં." : "Understand. Don't Just Measure."}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {language === "gu"
              ? "શિક્ષાસેતુ AI સાદા ગુણાંકથી આગળ વધીને બાળકની શીખવાની અડચણનું ચોક્કસ કારણ સ્પષ્ટ કરે છે."
              : "ShikshaSetu AI goes beyond raw test marks. Our explainable rule engine analyzes assessment patterns to diagnose the precise cognitive obstacle holding each student back."}
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-mono mb-1">
                <span>DEMO CASE: AARAV PATEL (CLASS 4)</span>
                <span className="text-rose-400 font-bold">GAP IDENTIFIED</span>
              </div>
              <p className="text-sm font-bold text-white">Math: Division Basics — 35% Score</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Algorithmic Diagnosis: <span className="text-slate-200">Fails equal sharing with remainders without visual aid.</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 block">Mastery Threshold</span>
                <span className="font-extrabold text-cyan-300 text-sm">60% Benchmark</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400 block">Calculation Method</span>
                <span className="font-extrabold text-cyan-300 text-sm">Deterministic AI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SCENE 4: REMEDIATION ("Every Gap Has a Path Forward.")           */}
      {/* ================================================================ */}
      <section
        id="how-it-works"
        className="relative min-h-[100svh] w-full flex items-center py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto z-10"
      >
        <div className="max-w-xl text-left space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/40 px-3.5 py-1 text-xs font-semibold text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.2)] backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Structured 5-Step Curriculum</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {language === "gu" ? "દરેક ત્રુટિનો એક સ્પષ્ટ માર્ગ છે." : "Every Gap Has a Path Forward."}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {language === "gu"
              ? "ત્રુટિ ઓળખાયા બાદ, શિક્ષકને એક ક્લિકમાં ૫-પગલાંની પ્રવૃત્તિ આધારિત ઉપચારાત્મક યોજના મળે છે."
              : "Once a learning gap is flagged, teachers receive an actionable, concrete 5-step remedial plan utilizing accessible classroom materials like beads, counters, and number lines."}
          </p>

          {/* 5-Step Progress Pathway List */}
          <div className="space-y-2 pt-2">
            {[
              { step: "01", title: "Diagnostic Assessment", desc: "Granular competency baseline recording." },
              { step: "02", title: "Concrete Manipulatives", desc: "Equal sharing with physical beads & counters." },
              { step: "03", title: "Visual Number Lines", desc: "Transition from physical objects to pictorial models." },
              { step: "04", title: "Interactive Quizzes", desc: "Digital practice with instant feedback & paper sheets." },
              { step: "05", title: "Formative Reassessment", desc: "Empirical delta measurement to verify full mastery." },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md"
              >
                <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded-md">
                  {item.step}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SCENE 5: IMPACT ("Make Every Improvement Visible.")             */}
      {/* ================================================================ */}
      <section
        id="impact"
        className="relative min-h-[100svh] w-full flex items-center py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto z-10"
      >
        <div className="max-w-xl text-left space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verifiable Pedagogical Growth</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {language === "gu" ? "દરેક પ્રગતિને દૃશ્યમાન બનાવો." : "Make Every Improvement Visible."}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {language === "gu"
              ? "અમારા સંશોધન દર્શાવે છે કે ઉપચારાત્મક પગલાંથી વિદ્યાર્થીના ગુણમાં સરેરાશ +૫૦ પોઈન્ટનો સુધારો થાય છે."
              : "Empirical proof from our demonstration cohort. We track real percentage-point recovery before and after remedial intervention to celebrate genuine student breakthroughs."}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-xl">
              <span className="text-3xl sm:text-4xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                +50 pp
              </span>
              <p className="text-xs font-bold text-white mt-1">Demonstrated Recovery</p>
              <p className="text-[11px] text-slate-400 mt-1">Aarav Patel: 35% &rarr; 85% in Division Basics</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl">
              <span className="text-3xl sm:text-4xl font-black text-sky-400">100%</span>
              <p className="text-xs font-bold text-white mt-1">Offline-First Engine</p>
              <p className="text-[11px] text-slate-400 mt-1">Zero paid external APIs, runs smoothly in rural schools</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl">
              <span className="text-3xl sm:text-4xl font-black text-amber-400">2 Modes</span>
              <p className="text-xs font-bold text-white mt-1">Digital &amp; Paper</p>
              <p className="text-[11px] text-slate-400 mt-1">Interactive student quizzes and printable worksheets</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl">
              <span className="text-3xl sm:text-4xl font-black text-indigo-400">Bilingual</span>
              <p className="text-xs font-bold text-white mt-1">English &amp; ગુજરાતી</p>
              <p className="text-[11px] text-slate-400 mt-1">Full state curriculum support for primary schools</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SCENE 6: FINAL CALL TO ACTION & DIRECT PORTAL ACCESS            */}
      {/* ================================================================ */}
      <section
        id="cta"
        className="relative min-h-[90vh] w-full flex items-center justify-center py-24 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto text-center z-10"
      >
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/50 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.25)] backdrop-blur-md">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Dedicated to Gujarat Primary Education</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {language === "gu"
              ? "દરેક બાળકને ચમકવાની તક મળવી જોઈએ."
              : "Every Child Deserves the Chance to Shine."}
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {language === "gu"
              ? "આજથી જ શિક્ષણ ત્રુટિઓ ઓળખો, વ્યક્તિગત ઉપચારાત્મક યોજનાઓ અમલમાં મૂકો અને વાસ્તવિક પરિણામો મેળવો."
              : "Empower primary school teachers with instant gap detection, actionable 5-step remedial curricula, and verifiable student progress today."}
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-cyan-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-sm font-black shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{language === "gu" ? "પ્લેટફોર્મ જુઓ" : "Explore the Platform"}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white text-sm font-bold shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>{t.nav?.login || "Sign In (Demo Access)"}</span>
            </Link>
          </div>

          {/* Quick-Jump Portal Links */}
          <div className="pt-8 border-t border-slate-800/80 max-w-2xl mx-auto">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
              Explore Live System Modules
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <Link
                href="/students"
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-colors"
              >
                Student Directory &rarr;
              </Link>
              <Link
                href="/learning-gaps"
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-colors"
              >
                Learning Gaps &rarr;
              </Link>
              <Link
                href="/remedial-plans"
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-colors"
              >
                Remedial Plans &rarr;
              </Link>
              <Link
                href="/activities"
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-colors"
              >
                Quizzes &amp; Worksheets &rarr;
              </Link>
              <Link
                href="/reports"
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-colors"
              >
                Printable Reports &rarr;
              </Link>
              <Link
                href="/assessments"
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-colors"
              >
                Scoring Grid &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FOOTER & CONTACT SECTION                                         */}
      {/* ================================================================ */}
      <footer id="contact" className="relative bg-[#03050a] text-slate-400 border-t border-slate-800/80 pt-16 pb-12 z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Column 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  શ
                </div>
                <div>
                  <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                    ShikshaSetu AI
                    <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.2 rounded-full">3D</span>
                  </span>
                  <span className="block text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                    Smart Tracking &amp; Remedial Action
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
                    Meet ShikshaBot
                  </a>
                </li>
                <li>
                  <a href="#challenge" onClick={(e) => handleSmoothScroll(e, "#challenge")} className="hover:text-cyan-400 transition-colors">
                    The Challenge
                  </a>
                </li>
                <li>
                  <a href="#diagnostics" onClick={(e) => handleSmoothScroll(e, "#diagnostics")} className="hover:text-cyan-400 transition-colors">
                    Diagnostics
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "#how-it-works")} className="hover:text-cyan-400 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#impact" onClick={(e) => handleSmoothScroll(e, "#impact")} className="hover:text-cyan-400 transition-colors">
                    Our Impact
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
              &copy; {new Date().getFullYear()} ShikshaSetu AI • SFIC Gujarat Hackathon 2026 (Problem Statement PS-60).
            </div>
            <div className="flex items-center gap-4">
              <span>Bilingual: English &amp; ગુજરાતી</span>
              <span>•</span>
              <span className="text-cyan-400 font-semibold">Cinematic 3D Studio Edition</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
