"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { ShikshaBot } from "@/components/landing/ShikshaBot";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
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
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState("");

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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col justify-between scroll-smooth">
      {/* 1. Sticky Transparent-to-Glass Navbar */}
      <LandingNavbar />

      {/* 2. Hero Section */}
      <section
        id="hero"
        className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-slate-50"
      >
        {/* Subtle Background Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-sky-200/30 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline, Subtitle, CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Hackathon Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-indigo-900 shadow-2xs backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>SFIC Gujarat Hackathon 2026 • Problem Statement PS-60</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                {language === "gu" ? (
                  <>
                    દરેક શિક્ષણ ત્રુટિ{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">
                      એક નવી તક છે.
                    </span>
                  </>
                ) : (
                  <>
                    Every Learning Gap Is an{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">
                      Opportunity.
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {language === "gu"
                  ? "શિક્ષકોને શિક્ષણ ત્રુટિઓ શોધવામાં, વ્યક્તિગત સહાય આપવામાં અને દરેક બાળકને આત્મવિશ્વાસ સાથે શીખવવામાં મદદ કરે છે."
                  : "Helping teachers discover learning gaps, deliver personalized support, and empower every child to learn with confidence."}
              </p>

              {/* Two Working Call to Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>{language === "gu" ? "શિક્ષાસેતુ AI જુઓ" : "Explore ShikshaSetu AI"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold shadow-2xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-indigo-600" />
                  <span>{language === "gu" ? "આ કેવી રીતે કાર્ય કરે છે?" : "Discover How It Works"}</span>
                </a>
              </div>

              {/* Live Status Subtext */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-slate-700">100% Offline-First AI</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Zero Paid External APIs Required</span>
                </div>
              </div>
            </div>

            {/* Right Column: Animated Mascot ShikshaBot */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <ShikshaBot speechText={language === "gu" ? "નમસ્તે! હું શિક્ષાબોટ છું. ચાલો સાથે મળીને શિક્ષણને વધુ બહેતર બનાવીએ!" : "Hi! I'm ShikshaBot. Let's make learning better for everyone!"} />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 sm:mt-16 text-center">
          <a
            href="#challenge"
            onClick={(e) => handleSmoothScroll(e, "#challenge")}
            aria-label="Scroll down to challenges section"
            className="inline-flex flex-col items-center text-slate-400 hover:text-indigo-600 transition-colors animate-bounce cursor-pointer"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider mb-1">
              Scroll to Explore
            </span>
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 3. Section 2: The Challenge */}
      <section id="challenge" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>The Primary Education Reality</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {language === "gu" ? "દરેક બાળકની શીખવાની ગતિ અલગ હોય છે." : "Every Child Learns Differently."}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Students struggle with different concepts, and teachers need clear insights to provide targeted support in crowded classrooms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Challenge Card 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5 font-black text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Learning Gaps Go Unnoticed
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                In a classroom of 30+ students, subtle conceptual hurdles in foundational division, place value, or language comprehension often get lost behind aggregate test marks.
              </p>
            </div>

            {/* Challenge Card 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 font-black text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Every Student Needs Different Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                One-size-fits-all rote repetition fails. One child needs physical counting beads, while another needs visual number lines and scaffolded peer support.
              </p>
            </div>

            {/* Challenge Card 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5 font-black text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Progress Should Be Measurable
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Without empirical percentage-point tracking before and after an intervention, teachers and parents cannot verify whether a gap has genuinely closed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 3: Our Solution */}
      <section id="solution" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-indigo-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80 uppercase tracking-wider">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Pedagogical Innovation</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {language === "gu" ? "તમારો સ્માર્ટ શિક્ષણ સાથી." : "Meet Your Smarter Learning Companion."}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              ShikshaSetu AI helps teachers identify student learning difficulties and organize structured remedial curricula in minutes.
            </p>
          </div>

          {/* Solution Pipeline Visual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold uppercase text-indigo-600 tracking-wider mb-1">Phase 1</div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Concept Assessment</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Record periodic classroom marks tied directly to granular competency benchmarks.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Single-click scoring grid</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold uppercase text-amber-600 tracking-wider mb-1">Phase 2</div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Gap Detection</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rule-based engine flags students needing support with transparent human explanations.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Explainable logic</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold uppercase text-sky-600 tracking-wider mb-1">Phase 3</div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Personalized Remediation</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates concrete 5-step lesson plans using low-cost materials like beads and number lines.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Digital & printed formats</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-xs relative flex flex-col justify-between bg-emerald-50/20">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold uppercase text-emerald-600 tracking-wider mb-1">Phase 4</div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Empirical Reassessment</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Measures true percentage-point delta to verify that the student has achieved mastery.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified +50 pp recovery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 4: Platform Features */}
      <section id="features" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core System Modules</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {language === "gu" ? "શિક્ષકો માટે જરૂરી તમામ સાધનો." : "Everything Teachers Need to Support Every Learner."}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Four integrated pedagogical pillars designed for primary school classrooms, available in English and Gujarati.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group p-6 rounded-3xl bg-slate-50/70 border border-slate-200/90 hover:border-indigo-400 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                1. Smart Gap Detection
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Rule-based algorithmic identification flags conceptual roadblocks with transparent, pedagogical reasons.
              </p>
              <div className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Gap Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-3xl bg-slate-50/70 border border-slate-200/90 hover:border-indigo-400 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                2. Personalized Remedial Plans
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Actionable 5-step curriculum using physical classroom manipulatives like beads, number lines, and flashcards.
              </p>
              <div className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Explore Plans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-3xl bg-slate-50/70 border border-slate-200/90 hover:border-indigo-400 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                3. Interactive Activities & Quizzes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Interactive digital quizzes with real-time feedback, plus printable offline paper worksheets for rural classrooms.
              </p>
              <div className="text-xs font-bold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Launch Quiz Bank</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 rounded-3xl bg-slate-50/70 border border-slate-200/90 hover:border-indigo-400 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                4. Student Progress Analytics
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Empirical before/after percentage-point tracking, classroom mastery trends, and print-ready report cards.
              </p>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>See Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 5: Interactive Dashboard Preview */}
      <section id="preview" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-indigo-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Live Demonstration Console</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {language === "gu" ? "વર્ગખંડનું સ્માર્ટ પૂર્વાવલોકન" : "Interactive Dashboard Preview"}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Explore the actual intelligence interface teachers use every day to identify learning gaps and trigger personalized remediation.
            </p>
          </div>

          {/* Interactive Dashboard Component */}
          <div className="max-w-5xl mx-auto">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* 7. Section 6: How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>4-Step Classroom Flow</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {language === "gu" ? "આ કેવી રીતે કાર્ય કરે છે?" : "How ShikshaSetu AI Works in Practice"}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              A continuous improvement cycle designed to fit naturally into everyday primary teaching schedules.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row items-start gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Assess Student Understanding
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Teachers enter marks on short, concept-focused diagnostic assessments (e.g. 5 questions on 2-digit division). The system safely calculates percentages without manual spreadsheets.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col sm:flex-row items-start gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Identify Specific Learning Gaps
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The rule engine flags students scoring under the 60% mastery threshold. It provides an explicit, pedagogical reason &mdash; e.g. &ldquo;Fails equal sharing with remainders without visual aid.&rdquo;
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col sm:flex-row items-start gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black text-lg shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Deliver Personalized Remedial Activities
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  With one click, an actionable 5-step remedial plan is generated with specific hands-on manipulatives (beads, counters, flashcards) and interactive quizzes.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col sm:flex-row items-start gap-5 p-6 rounded-3xl bg-emerald-50/40 border border-emerald-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                4
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Measure Improvement Through Reassessment
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Following the intervention, the teacher enters the re-test score. The system automatically computes the positive percentage-point delta and upgrades the student to &ldquo;Mastered.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section 7: Student Learning Impact */}
      <section id="impact" className="py-16 sm:py-24 bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 bg-white/10 px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider backdrop-blur-xs">
              <Award className="w-3.5 h-3.5" />
              <span>Verifiable Pedagogical Results</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {language === "gu" ? "નાના પગલાં. મજબૂત પાયો." : "Small Steps. Stronger Foundations."}
            </h2>
            <p className="text-sm sm:text-base text-indigo-200/80">
              Empirical evidence from our demonstration cohort showing how targeted remediation closes learning gaps.
            </p>
          </div>

          {/* 4 Impact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mb-12">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center backdrop-blur-xs">
              <div className="text-3xl sm:text-5xl font-black text-emerald-400 mb-1">+50 pp</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Demonstrated Growth</div>
              <p className="text-[11px] text-slate-400 mt-2">Aarav Patel (Class 4): 35% &rarr; 85% in Division Basics</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center backdrop-blur-xs">
              <div className="text-3xl sm:text-5xl font-black text-sky-400 mb-1">100%</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Offline Resilience</div>
              <p className="text-[11px] text-slate-400 mt-2">Runs locally in rural schools without paid API dependencies</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center backdrop-blur-xs">
              <div className="text-3xl sm:text-5xl font-black text-amber-400 mb-1">5-Step</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Concrete Curricula</div>
              <p className="text-[11px] text-slate-400 mt-2">Physical manipulatives, grouping, and guided drills</p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center backdrop-blur-xs">
              <div className="text-3xl sm:text-5xl font-black text-indigo-400 mb-1">2 Modes</div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Digital & Paper</div>
              <p className="text-[11px] text-slate-400 mt-2">Interactive student quizzes plus print-ready paper sheets</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Section 8: Final Call to Action */}
      <section className="py-16 sm:py-24 bg-indigo-600 text-white relative overflow-hidden">
        {/* Decorative background glow circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold backdrop-blur-xs">
            <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
            <span>Dedicated to Gujarat Primary Education</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {language === "gu" ? "ચાલો દરેક બાળકને આગળ વધારીએ." : "Let's Help Every Child Move Forward."}
          </h2>

          <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            {language === "gu"
              ? "આજથી જ શિક્ષણ ત્રુટિઓ ઓળખો અને વર્ગખંડના શિક્ષણને સાર્થક બનાવો."
              : "Start identifying learning gaps and turn classroom insights into meaningful action for every student."}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-indigo-900 text-sm font-extrabold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{language === "gu" ? "ડેશબોર્ડ ખોલો" : "Get Started Now"}</span>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </Link>

            <a
              href="#features"
              onClick={(e) => handleSmoothScroll(e, "#features")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-white/30 hover:bg-white/10 text-white text-sm font-bold transition-all cursor-pointer"
            >
              <span>{language === "gu" ? "વિશેષતાઓ જુઓ" : "Explore Features"}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 10. Section 9: Professional Footer & Contact */}
      <footer id="contact" className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Column 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-md">
                  શ
                </div>
                <div>
                  <span className="text-lg font-black text-white tracking-tight">ShikshaSetu AI</span>
                  <span className="block text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">
                    Smart Tracking & Remedial Action
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Empowering primary school teachers to identify conceptual learning gaps, deploy 5-step concrete remedial plans, and empirically measure student growth.
              </p>

              <div className="text-xs text-slate-500 pt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Gandhinagar, Gujarat, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>support@shikshasetu.edu.in</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#hero" onClick={(e) => handleSmoothScroll(e, "#hero")} className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#challenge" onClick={(e) => handleSmoothScroll(e, "#challenge")} className="hover:text-white transition-colors">
                    The Challenge
                  </a>
                </li>
                <li>
                  <a href="#solution" onClick={(e) => handleSmoothScroll(e, "#solution")} className="hover:text-white transition-colors">
                    Our Solution
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={(e) => handleSmoothScroll(e, "#features")} className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "#how-it-works")} className="hover:text-white transition-colors">
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
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Teacher Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/students" className="hover:text-white transition-colors">
                    Student Directory
                  </Link>
                </li>
                <li>
                  <Link href="/learning-gaps" className="hover:text-white transition-colors">
                    Learning Gaps Engine
                  </Link>
                </li>
                <li>
                  <Link href="/remedial-plans" className="hover:text-white transition-colors">
                    Remedial Plans
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="hover:text-white transition-colors">
                    Printable Reports
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Sign In (Demo Access)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Feedback / Newsletter */}
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
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-3 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
                {feedbackSent && (
                  <p className="text-[11px] text-emerald-400 font-medium">Thank you! Inquiry received.</p>
                )}
              </form>
            </div>
          </div>

          {/* Bottom Copyright & Hackathon Info */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} ShikshaSetu AI • Developed for SFIC Gujarat Hackathon 2026 (Problem Statement PS-60).
            </div>
            <div className="flex items-center gap-4">
              <span>Bilingual: English &amp; ગુજરાતી</span>
              <span>•</span>
              <span className="text-slate-400">Open-Source Educational MVP</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
