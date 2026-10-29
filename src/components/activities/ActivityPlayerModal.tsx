"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { Badge } from "../ui/Badge";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Trophy,
  Lightbulb,
  BookOpen,
  Calculator,
  Leaf,
  Globe,
  ChevronDown,
  RotateCcw,
  Play,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fireCelebrationConfetti } from "@/lib/confetti";
import type { LearningActivity, ActivityQuestion } from "@/lib/types";

interface ActivityPlayerModalProps {
  activity: LearningActivity | null;
  studentId: string;
  studentName?: string;
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (attempt: any) => void;
  availableActivities?: LearningActivity[];
  startWithSubjectSelector?: boolean;
}

export function ActivityPlayerModal({
  activity,
  studentId,
  studentName,
  isOpen,
  onClose,
  onCompleted,
  availableActivities = [],
  startWithSubjectSelector = false,
}: ActivityPlayerModalProps) {
  const { language } = useLanguage();

  // Subject options
  const SUBJECTS = [
    {
      code: "MATH",
      nameEn: "Mathematics",
      nameGu: "ગણિત",
      icon: Calculator,
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-900",
      accent: "#B26A1B",
      descEn: "Division, multiplication, fractions & arithmetic reasoning",
      descGu: "ભાગાકાર, ગુણાકાર, અપૂર્ણાંક અને ગાણિતિક તર્ક",
    },
    {
      code: "GUJ",
      nameEn: "Gujarati",
      nameGu: "ગુજરાતી",
      icon: BookOpen,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-900",
      accent: "#2E7D5E",
      descEn: "Matras, reading comprehension & sentence formation",
      descGu: "માત્રાઓ, વાંચન અર્થગ્રહણ અને વાક્ય રચના",
    },
    {
      code: "EVS",
      nameEn: "Environmental Studies",
      nameGu: "પર્યાવરણ",
      icon: Leaf,
      color: "from-lime-500/20 to-green-500/10 border-lime-500/30 text-lime-900",
      accent: "#4D7C0F",
      descEn: "Water cycle, conservation, nature & local ecosystem",
      descGu: "જળચક્ર, જળસંરક્ષણ, પર્યાવરણ અને આપણી આસપાસ",
    },
    {
      code: "ENG",
      nameEn: "English",
      nameGu: "અંગ્રેજી",
      icon: Globe,
      color: "from-sky-500/20 to-indigo-500/10 border-sky-500/30 text-sky-900",
      accent: "#0284C7",
      descEn: "Subject-verb agreement, phonics & simple comprehension",
      descGu: "કર્તા-ક્રિયાપદ સુમેળ, ફોનિક્સ અને વાક્ય સમજ",
    },
  ];

  // Fallback activity for English if not in active state
  const FALLBACK_ENGLISH_ACTIVITY: LearningActivity = {
    id: "act-eng-01",
    conceptId: "c-eng-verb-01",
    conceptName: "Subject-Verb Agreement",
    subjectCode: "ENG",
    grade: 4,
    title: "English Grammar & Sentence Building",
    titleGujarati: "અંગ્રેજી વ્યાકરણ અને વાક્ય રચના",
    activityType: "mcq",
    difficulty: "Easy",
    estimatedMinutes: 8,
    questions: [
      {
        id: "q-eng-1",
        questionText: "Choose the correct sentence: The students _____ eager to learn.",
        questionTextGujarati: "સાચો વિકલ્પ પસંદ કરો: The students _____ eager to learn.",
        type: "mcq",
        options: ["is", "are", "was", "am"],
        correctAnswer: "are",
        explanation: "'Students' is plural, so we use 'are'.",
        hint: "Is 'students' singular or plural?",
      },
      {
        id: "q-eng-2",
        questionText: "Complete the sentence: Pooja _____ to school every morning.",
        questionTextGujarati: "વાક્ય પૂર્ણ કરો: Pooja _____ to school every morning.",
        type: "mcq",
        options: ["walk", "walks", "walking", "walked"],
        correctAnswer: "walks",
        explanation: "Third-person singular 'Pooja' takes the verb form ending with -s ('walks').",
        hint: "Singular subject 'Pooja' takes 'walks'.",
      },
      {
        id: "q-eng-3",
        questionText: "Which pronoun correctly replaces 'Rohan and Aarav'?",
        questionTextGujarati: "'Rohan and Aarav' ની જગ્યાએ કયું સર્વનામ વપરાય?",
        type: "mcq",
        options: ["He", "She", "They", "It"],
        correctAnswer: "They",
        explanation: "'They' refers to two or more people together.",
        hint: "More than one person is mentioned.",
      },
    ],
    createdAt: new Date().toISOString(),
  };

  const [selectedSubject, setSelectedSubject] = useState<string>(
    activity?.subjectCode || "MATH"
  );
  const [currentActivity, setCurrentActivity] = useState<LearningActivity | null>(activity);
  const [inSubjectSelectionStep, setInSubjectSelectionStep] = useState<boolean>(
    startWithSubjectSelector || false
  );
  const [isLoadingSubject, setIsLoadingSubject] = useState(false);

  // Player state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | number | boolean>>({});
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [attemptResult, setAttemptResult] = useState<any>(null);

  // Load activity for a subject
  const loadSubjectActivity = async (subjectCode: string) => {
    setIsLoadingSubject(true);
    setSelectedSubject(subjectCode);
    try {
      // 1. First check in availableActivities prop
      const matched = availableActivities.find((a) => a.subjectCode === subjectCode);
      if (matched) {
        setCurrentActivity(matched);
        setCurrentIdx(0);
        setSelectedAnswers({});
        setShowHint(false);
        setIsSubmitted(false);
        setAttemptResult(null);
        setIsLoadingSubject(false);
        return;
      }

      // 2. Fetch from API
      const res = await fetch(`/api/activities?subjectCode=${subjectCode}`);
      const data = await res.json();
      if (data.success && data.activities && data.activities.length > 0) {
        setCurrentActivity(data.activities[0]);
      } else if (subjectCode === "ENG") {
        setCurrentActivity(FALLBACK_ENGLISH_ACTIVITY);
      } else if (activity) {
        setCurrentActivity(activity);
      }
    } catch (e) {
      console.error("Failed to fetch subject activity", e);
      if (subjectCode === "ENG") {
        setCurrentActivity(FALLBACK_ENGLISH_ACTIVITY);
      } else if (activity) {
        setCurrentActivity(activity);
      }
    } finally {
      setCurrentIdx(0);
      setSelectedAnswers({});
      setShowHint(false);
      setIsSubmitted(false);
      setAttemptResult(null);
      setIsLoadingSubject(false);
    }
  };

  // Sync on modal open
  useEffect(() => {
    if (isOpen) {
      const initialSub = activity?.subjectCode || "MATH";
      setSelectedSubject(initialSub);
      setCurrentActivity(activity);
      setCurrentIdx(0);
      setSelectedAnswers({});
      setShowHint(false);
      setIsSubmitted(false);
      setAttemptResult(null);
      setInSubjectSelectionStep(startWithSubjectSelector);
    }
  }, [isOpen, activity, startWithSubjectSelector]);

  const activeAct = currentActivity || activity;
  if (!activeAct && !inSubjectSelectionStep) return null;

  const currentQ: ActivityQuestion =
    activeAct && activeAct.questions
      ? activeAct.questions[currentIdx] || activeAct.questions[0]
      : ({} as ActivityQuestion);
  const totalQuestions = activeAct?.questions?.length || 0;
  const currentAnswer = currentQ?.id ? selectedAnswers[currentQ.id] : undefined;

  const handleSelectOption = (opt: string | number | boolean) => {
    if (isSubmitted || !currentQ?.id) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleNext = () => {
    setShowHint(false);
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishActivity();
    }
  };

  const finishActivity = async () => {
    if (!activeAct) return;
    setIsSaving(true);

    // Compute detailed breakdown of all questions for instant review
    let localScore = 0;
    const incorrectIds: string[] = [];
    const questionReview = (activeAct.questions || []).map((q) => {
      const studentAns = selectedAnswers[q.id];
      const isCorrect =
        studentAns !== undefined &&
        String(studentAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
      if (isCorrect) {
        localScore += 1;
      } else {
        incorrectIds.push(q.id);
      }
      return {
        questionId: q.id,
        questionText: q.questionText,
        questionTextGujarati: q.questionTextGujarati,
        studentAnswer: studentAns,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect,
      };
    });

    const localTotal = activeAct.questions?.length || 1;
    const localPct = Math.round((localScore / localTotal) * 100);

    const fallbackResult = {
      success: true,
      percentage: localPct,
      attempt: {
        score: localScore,
        maximumScore: localTotal,
        percentage: localPct,
        studentId,
        activityId: activeAct.id,
        answers: selectedAnswers,
        incorrectQuestions: incorrectIds,
      },
      feedback:
        localPct >= 80
          ? (language === "gu" ? "અદ્ભુત કાર્ય! સંકલ્પના પર પૂર્ણ પ્રભુત્વ મેળવ્યું." : "Outstanding work! Concept mastered with high confidence.")
          : localPct >= 50
          ? (language === "gu" ? "સારો પ્રયાસ! જે પ્રશ્નોમાં ભૂલ થઈ છે તેનું પુનરાવર્તન કરો." : "Good practice! Review the questions you missed with your teacher.")
          : (language === "gu" ? "મહાવરો ચાલુ રાખો! મૂર્ત સાધનોથી શીખવાથી પાયો મજબૂત થશે." : "Keep practicing! Hands-on practice with objects will help build your foundation."),
      questionReview,
    };

    try {
      const res = await fetch("/api/activities/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: activeAct.id,
          studentId,
          answers: selectedAnswers,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAttemptResult({ ...data, questionReview });
        setIsSubmitted(true);
        if (data.percentage >= 80) {
          fireCelebrationConfetti();
        }
        if (onCompleted) onCompleted(data);
      } else {
        // Fallback to locally computed result so the quiz result is never blocked
        setAttemptResult(fallbackResult);
        setIsSubmitted(true);
        if (localPct >= 80) {
          fireCelebrationConfetti();
        }
        if (onCompleted) onCompleted(fallbackResult);
      }
    } catch (e) {
      console.warn("API attempt submission encountered error, using computed result:", e);
      setAttemptResult(fallbackResult);
      setIsSubmitted(true);
      if (localPct >= 80) {
        fireCelebrationConfetti();
      }
      if (onCompleted) onCompleted(fallbackResult);
    } finally {
      setIsSaving(false);
    }
  };

  const resetActivity = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowHint(false);
    setIsSubmitted(false);
    setAttemptResult(null);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        inSubjectSelectionStep
          ? language === "gu"
            ? "મહાવરા માટે વિષય પસંદ કરો"
            : "Choose Practice Subject"
          : `${activeAct?.title || "Practice Activity"} — ${
              studentName || (language === "gu" ? "વિદ્યાર્થી મહાવરો" : "Student Practice")
            }`
      }
      description={
        inSubjectSelectionStep
          ? language === "gu"
            ? "પ્રવૃત્તિ શરૂ કરતા પહેલાં વિષય પસંદ કરો. વિષય મુજબ પ્રશ્નો તરત જ લોડ થશે."
            : "Select a specific subject to practice before loading targeted interactive tasks."
          : language === "gu"
          ? `ઇન્ટરેક્ટિવ મહાવરો • વિષય: ${selectedSubject} • ${totalQuestions} પ્રશ્નો`
          : `Interactive Practice • Subject: ${selectedSubject} • ${totalQuestions} questions`
      }
      maxWidth="xl"
    >
      {/* 1. Subject Selection Step Screen */}
      {inSubjectSelectionStep ? (
        <div className="space-y-5 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {SUBJECTS.map((sub) => {
              const Icon = sub.icon;
              const isSelected = selectedSubject === sub.code;

              return (
                <button
                  key={sub.code}
                  type="button"
                  onClick={() => loadSubjectActivity(sub.code)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "border-[#49352F] bg-[#F2CAB3]/60 shadow-md ring-2 ring-[#B26A1B]"
                      : "border-[#49352F]/15 bg-white hover:bg-[#FAF6E9] hover:border-[#49352F]/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-[#49352F]/15 flex items-center justify-center text-[#49352F] shadow-2xs shrink-0">
                        <Icon className="w-4 h-4 text-[#B26A1B]" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#49352F]">
                          {language === "gu" ? sub.nameGu : sub.nameEn}
                        </h4>
                        <span className="font-mono text-[10px] text-[#7A6862] font-semibold uppercase">
                          {sub.code}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <Badge variant="saffron" size="sm">
                        {language === "gu" ? "પસંદ કરેલ" : "Selected"}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-[#7A6862] mt-3 line-clamp-2">
                    {language === "gu" ? sub.descGu : sub.descEn}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#49352F]/10">
            <span className="text-xs font-semibold text-[#7A6862]">
              {language === "gu"
                ? `પસંદગી: ${SUBJECTS.find((s) => s.code === selectedSubject)?.[language === "gu" ? "nameGu" : "nameEn"]}`
                : `Active: ${SUBJECTS.find((s) => s.code === selectedSubject)?.nameEn}`}
            </span>

            <button
              type="button"
              disabled={isLoadingSubject || !activeAct}
              onClick={() => setInSubjectSelectionStep(false)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold bg-[#F2CAB3] hover:bg-white text-[#49352F] border border-[#49352F]/16 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {isLoadingSubject
                  ? language === "gu" ? "લોડ થઈ રહ્યું છે..." : "Loading Tasks..."
                  : language === "gu" ? "મહાવરો શરૂ કરો" : "Launch Practice"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : !isSubmitted ? (
        /* 2. Active Practice View with Top Subject Dropdown Selector */
        <div className="space-y-6">
          {/* Top Control Bar: Subject Selector Dropdown & Question Progress */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#FAF6E9] border border-[#49352F]/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#49352F]">
                {language === "gu" ? "વિષય:" : "Subject:"}
              </span>
              {/* Dynamic Subject Selection Dropdown */}
              <select
                value={selectedSubject}
                aria-label="Select Practice Subject"
                onChange={(e) => loadSubjectActivity(e.target.value)}
                className="rounded-xl border border-[#49352F]/15 bg-white px-3 py-1.5 text-xs font-bold text-[#49352F] shadow-2xs outline-hidden cursor-pointer"
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub.code} value={sub.code}>
                    {sub.code}: {language === "gu" ? sub.nameGu : sub.nameEn}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setInSubjectSelectionStep(true)}
                className="text-[11px] font-semibold text-[#B26A1B] hover:underline cursor-pointer ml-1"
              >
                {language === "gu" ? "બદલો" : "Change Step"}
              </button>
            </div>

            <Badge variant="outline" size="sm">
              {activeAct?.conceptName || selectedSubject}
            </Badge>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#7A6862]">
              <span>
                {language === "gu"
                  ? `પ્રશ્ન ${currentIdx + 1} / ${totalQuestions}`
                  : `Question ${currentIdx + 1} of ${totalQuestions}`}
              </span>
              <span>
                {language === "gu"
                  ? `${Math.round(((currentIdx + 1) / totalQuestions) * 100)}% પૂર્ણ`
                  : `${Math.round(((currentIdx + 1) / totalQuestions) * 100)}% Complete`}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#FAF6E9] border border-[#49352F]/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F2CAB3] to-[#B26A1B] transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          {isLoadingSubject ? (
            <div className="p-12 text-center rounded-2xl bg-[#FAF6E9] text-xs font-semibold text-[#7A6862] animate-pulse">
              {language === "gu"
                ? `${selectedSubject} માટે પ્રશ્નો લોડ થઈ રહ્યા છે...`
                : `Loading questions for ${selectedSubject}...`}
            </div>
          ) : currentQ?.questionText ? (
            <div className="rounded-2xl border border-[#49352F]/12 bg-[#FAF6E9] p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="outline" size="sm">
                  {(currentQ.type || "MCQ").toUpperCase().replace("_", " ")}
                </Badge>
                {currentQ.hint && (
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#B26A1B] hover:text-[#49352F] cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>
                      {language === "gu"
                        ? showHint
                          ? "સંકેત છુપાવો"
                          : "સંકેત જોઈએ છે?"
                        : showHint
                        ? "Hide Hint"
                        : "Need a Hint?"}
                    </span>
                  </button>
                )}
              </div>

              <p className="text-base sm:text-lg font-bold text-[#49352F] mt-2">
                {currentQ.questionText}
              </p>

              {currentQ.questionTextGujarati && (
                <p className="text-sm font-medium text-[#7A6862] mt-1 font-serif">
                  {currentQ.questionTextGujarati}
                </p>
              )}

              {showHint && currentQ.hint && (
                <div className="mt-3 p-3 rounded-xl bg-[#F2DCB5]/40 border border-[#49352F]/12 text-xs text-[#49352F] font-medium flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-[#8D4E10] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong>{language === "gu" ? "સંકેત:" : "Hint:"}</strong> {currentQ.hint}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Answer Options */}
          {!isLoadingSubject && currentQ?.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, i) => {
                const isSelected = String(currentAnswer) === String(opt);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left font-medium text-sm transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#49352F] bg-[#F2CAB3] text-[#49352F] font-bold shadow-md scale-101"
                        : "border-[#49352F]/12 bg-white text-[#49352F] hover:bg-[#FAF6E9] hover:border-[#49352F]/20"
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-[#49352F] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#49352F]/10">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(currentIdx - 1)}
              className="px-4 py-2 text-xs font-semibold text-[#7A6862] hover:bg-[#FAF6E9] hover:text-[#49352F] rounded-xl disabled:opacity-40 cursor-pointer transition-colors"
            >
              {language === "gu" ? "પાછળ" : "Previous"}
            </button>
            <button
              type="button"
              disabled={currentAnswer === undefined || isSaving}
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold bg-[#F2CAB3] hover:bg-white text-[#49352F] border border-[#49352F]/16 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>
                {currentIdx === totalQuestions - 1
                  ? isSaving
                    ? language === "gu"
                      ? "સબમિટ થઈ રહ્યું છે..."
                      : "Submitting..."
                    : language === "gu"
                    ? "જવાબો સબમિટ કરો"
                    : "Submit Answers"
                  : language === "gu"
                  ? "આગળનો પ્રશ્ન"
                  : "Next Question"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* 3. Comprehensive Completion & Quiz Result Screen */
        <div className="text-center py-5 space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#2E7D5E]/15 text-[#2E7D5E] flex items-center justify-center shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-[#49352F]">
              {language === "gu" ? "પ્રવૃત્તિ પૂર્ણ થઈ!" : "Activity Completed!"}
            </h4>
            <p className="text-xs text-[#7A6862] mt-1">
              {language === "gu"
                ? `${studentName || "વિદ્યાર્થી"} માટે ${selectedSubject} નો સ્કોર અને પરિણામ નોંધાયા`
                : `Quiz result officially recorded in ${selectedSubject} for ${studentName || "Student"}`}
            </p>
          </div>

          {/* Primary Score & Feedback Card */}
          <div className="p-5 max-w-sm mx-auto rounded-3xl bg-[#FAF6E9] border border-[#49352F]/15 shadow-xs space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className={`text-4xl font-extrabold ${
                (attemptResult?.percentage || 0) >= 80
                  ? "text-[#2E7D5E]"
                  : (attemptResult?.percentage || 0) >= 60
                  ? "text-[#B26A1B]"
                  : "text-[#C54738]"
              }`}>
                {attemptResult?.percentage}%
              </span>
              <Badge
                variant={
                  (attemptResult?.percentage || 0) >= 80
                    ? "completed"
                    : (attemptResult?.percentage || 0) >= 60
                    ? "inProgress"
                    : "needsSupport"
                }
                size="sm"
              >
                {(attemptResult?.percentage || 0) >= 80
                  ? language === "gu" ? "નિપુણ" : "Mastered"
                  : (attemptResult?.percentage || 0) >= 60
                  ? language === "gu" ? "પ્રગતિ હેઠળ" : "Developing"
                  : language === "gu" ? "સહાય જરૂરી" : "Needs Support"}
              </Badge>
            </div>

            <div className="text-xs font-semibold text-[#7A6862]">
              {language === "gu"
                ? `${totalQuestions} માંથી ${attemptResult?.attempt?.score ?? 0} પ્રશ્નો સાચા`
                : `${attemptResult?.attempt?.score ?? 0} out of ${totalQuestions} questions correct`}
            </div>

            <p className="text-xs text-[#49352F] pt-2 border-t border-[#49352F]/10 font-medium">
              {attemptResult?.feedback}
            </p>
          </div>

          {/* Detailed Question-by-Question Review */}
          {attemptResult?.questionReview && attemptResult.questionReview.length > 0 && (
            <div className="text-left space-y-2.5 pt-2">
              <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-[#7A6862] flex items-center gap-1.5 px-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D5E]" />
                <span>
                  {language === "gu"
                    ? "પ્રશ્નવાર વિશ્લેષણ અને સાચા જવાબો"
                    : "Question-by-Question Breakdown & Explanations"}
                </span>
              </h5>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {attemptResult.questionReview.map((rev: any, qIdx: number) => (
                  <div
                    key={qIdx}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                      rev.isCorrect
                        ? "bg-[#EAF4EE] border-[#2E7D5E]/20 text-[#1B4D39]"
                        : "bg-[#FBECE9] border-[#C54738]/20 text-[#5C1E16]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {rev.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-[#2E7D5E] shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#C54738] shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold">{rev.questionText}</p>
                          {rev.questionTextGujarati && (
                            <p className="text-[11px] font-normal opacity-85 mt-0.5">
                              {rev.questionTextGujarati}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant={rev.isCorrect ? "completed" : "needsSupport"} size="sm">
                        {rev.isCorrect
                          ? language === "gu" ? "સાચો" : "Correct"
                          : language === "gu" ? "ખોટો" : "Incorrect"}
                      </Badge>
                    </div>

                    <div className="pl-6 space-y-1 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{language === "gu" ? "તમારો જવાબ:" : "Your Answer:"}</span>
                        <span className={rev.isCorrect ? "font-bold text-[#2E7D5E]" : "font-bold text-[#C54738] line-through"}>
                          {String(rev.studentAnswer ?? (language === "gu" ? "જવાબ નથી આપ્યો" : "Not answered"))}
                        </span>
                      </div>
                      {!rev.isCorrect && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{language === "gu" ? "સાચો જવાબ:" : "Correct Answer:"}</span>
                          <span className="font-bold text-[#2E7D5E]">{String(rev.correctAnswer)}</span>
                        </div>
                      )}
                      {rev.explanation && (
                        <p className="text-[10px] text-[#49352F] opacity-90 mt-1 italic">
                          💡 {rev.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
            <button
              type="button"
              onClick={resetActivity}
              className="px-4 py-2 text-xs font-semibold text-[#7A6862] hover:bg-[#FAF6E9] hover:text-[#49352F] rounded-xl cursor-pointer transition-colors"
            >
              {language === "gu" ? "ફરીથી મહાવરો કરો" : "Practice Again"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetActivity();
                setInSubjectSelectionStep(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-[#B26A1B] hover:bg-[#F2CAB3]/30 rounded-xl cursor-pointer transition-colors"
            >
              {language === "gu" ? "અન્ય વિષય પસંદ કરો" : "Choose Other Subject"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-xs font-bold bg-[#F2CAB3] hover:bg-white text-[#49352F] border border-[#49352F]/16 rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              {language === "gu" ? "પૂર્ણ અને પ્રગતિ જુઓ" : "Done & View Progress"}
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
