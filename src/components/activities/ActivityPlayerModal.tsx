"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  RotateCcw,
  Play,
  Shuffle,
  RefreshCw,
  Layers,
  ChevronRight,
  Target,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fireCelebrationConfetti } from "@/lib/confetti";
import type { LearningActivity, ActivityQuestion } from "@/lib/types";
import {
  TOPIC_CATALOG,
  TopicCatalogItem,
  generatePracticeQuestions,
  generateLearningActivity,
  getTopicsForSubject,
} from "@/lib/engine/questionGenerator";

interface ActivityPlayerModalProps {
  activity: LearningActivity | null;
  studentId: string;
  studentName?: string;
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (attempt: any) => void;
  availableActivities?: LearningActivity[];
  startWithSubjectSelector?: boolean;
  initialTopicId?: string;
  initialDifficulty?: "Easy" | "Medium" | "Hard";
  studentGaps?: any[];
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
  initialTopicId,
  initialDifficulty,
  studentGaps = [],
}: ActivityPlayerModalProps) {
  const { language } = useLanguage();

  // Subject metadata
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
      descEn: "Matras, conjuncts, grammar & vocabulary",
      descGu: "માત્રાઓ, જોડાક્ષરો, વ્યાકરણ અને શબ્દભંડોળ",
    },
    {
      code: "ENG",
      nameEn: "English",
      nameGu: "અંગ્રેજી",
      icon: Globe,
      color: "from-sky-500/20 to-indigo-500/10 border-sky-500/30 text-sky-900",
      accent: "#0284C7",
      descEn: "Subject-verb agreement, phonics & verb tenses",
      descGu: "કર્તા-ક્રિયાપદ સુમેળ, ફોનિક્સ અને કાળ",
    },
    {
      code: "EVS",
      nameEn: "Environmental Studies",
      nameGu: "પર્યાવરણ",
      icon: Leaf,
      color: "from-lime-500/20 to-green-500/10 border-lime-500/30 text-lime-900",
      accent: "#4D7C0F",
      descEn: "Water cycle, conservation, nature & community helpers",
      descGu: "જળચક્ર, જળસંરક્ષણ, વનસ્પતિ અને આપણી આસપાસ",
    },
  ];

  // Selection states
  const [selectedSubject, setSelectedSubject] = useState<"MATH" | "GUJ" | "ENG" | "EVS">("MATH");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("math-division");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");

  // Dynamic activity & questions state
  const [currentActivity, setCurrentActivity] = useState<LearningActivity | null>(null);
  const [questions, setQuestions] = useState<ActivityQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inSetupStep, setInSetupStep] = useState(false);

  // Player progress states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | number | boolean>>({});
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [attemptResult, setAttemptResult] = useState<any>(null);

  // Available topics for currently selected subject
  const currentSubjectTopics = useMemo(() => {
    return getTopicsForSubject(selectedSubject);
  }, [selectedSubject]);

  // Find if current topic is an identified learning gap for this student
  const studentGapForTopic = useCallback((topicItem: TopicCatalogItem) => {
    if (!studentGaps || studentGaps.length === 0) return null;
    return studentGaps.find(
      (g) =>
        g.conceptId === topicItem.conceptId ||
        g.conceptId?.toLowerCase().includes(topicItem.id.replace("math-", "").replace("guj-", "").replace("eng-", "").replace("evs-", ""))
    );
  }, [studentGaps]);

  // Generate completely fresh questions for given subject, topic, and difficulty
  const generateFreshQuestions = useCallback(
    (
      subj: "MATH" | "GUJ" | "ENG" | "EVS",
      topicId: string,
      diff: "Easy" | "Medium" | "Hard",
      forceFresh = true
    ) => {
      setIsGenerating(true);

      try {
        // Procedurally generate new questions every time
        const newQuestions = generatePracticeQuestions({
          subjectCode: subj,
          topicId,
          difficulty: diff,
          count: 4,
          studentName,
        });

        const activeCatalog = TOPIC_CATALOG.find((t) => t.id === topicId) || TOPIC_CATALOG[0];
        const newAct: LearningActivity = {
          id: `act-${subj.toLowerCase()}-${topicId}-${diff.toLowerCase()}-${Date.now()}`,
          conceptId: activeCatalog.conceptId,
          conceptName: activeCatalog.nameEn,
          subjectCode: subj,
          grade: 4,
          title: `${activeCatalog.nameEn} (${diff} Level Practice)`,
          titleGujarati: `${activeCatalog.nameGu} (${diff === "Easy" ? "સરળ" : diff === "Medium" ? "મધ્યમ" : "કઠિન"} મહાવરો)`,
          activityType: "mcq",
          difficulty: diff,
          estimatedMinutes: 8,
          questions: newQuestions,
          createdAt: new Date().toISOString(),
        };

        setCurrentActivity(newAct);
        setQuestions(newQuestions);
        setCurrentIdx(0);
        setSelectedAnswers({});
        setShowHint(false);
        setIsSubmitted(false);
        setAttemptResult(null);
      } catch (err) {
        console.error("Failed to generate fresh practice questions:", err);
      } finally {
        setIsGenerating(false);
      }
    },
    [studentName]
  );

  // Initialize on modal open or prop change
  useEffect(() => {
    if (isOpen) {
      // Determine initial subject
      let initSub: "MATH" | "GUJ" | "ENG" | "EVS" = "MATH";
      if (activity?.subjectCode) {
        initSub = activity.subjectCode as any;
      } else if (studentGaps && studentGaps.length > 0 && studentGaps[0].subjectCode) {
        initSub = studentGaps[0].subjectCode as any;
      }

      // Determine initial topic
      let initTopic = "math-division";
      const subjectTopics = getTopicsForSubject(initSub);
      if (initialTopicId) {
        const found = subjectTopics.find((t) => t.id === initialTopicId || t.conceptId === initialTopicId);
        if (found) initTopic = found.id;
      } else if (activity?.conceptId) {
        const found = subjectTopics.find((t) => t.conceptId === activity.conceptId || t.id.includes(activity.conceptId));
        if (found) initTopic = found.id;
        else if (subjectTopics.length > 0) initTopic = subjectTopics[0].id;
      } else if (studentGaps && studentGaps.length > 0) {
        const firstGap = studentGaps[0];
        const found = subjectTopics.find((t) => t.conceptId === firstGap.conceptId);
        if (found) initTopic = found.id;
        else if (subjectTopics.length > 0) initTopic = subjectTopics[0].id;
      } else if (subjectTopics.length > 0) {
        initTopic = subjectTopics[0].id;
      }

      // Determine initial difficulty
      let initDiff: "Easy" | "Medium" | "Hard" = "Easy";
      if (initialDifficulty) {
        initDiff = initialDifficulty;
      } else if (activity?.difficulty) {
        initDiff = activity.difficulty;
      } else if (studentGaps && studentGaps.length > 0) {
        const firstGap = studentGaps[0];
        initDiff = (firstGap.latestPercentage || 0) < 40 ? "Easy" : (firstGap.latestPercentage || 0) < 70 ? "Medium" : "Hard";
      }

      setSelectedSubject(initSub);
      setSelectedTopicId(initTopic);
      setSelectedDifficulty(initDiff);
      setInSetupStep(startWithSubjectSelector);

      // ALWAYS generate fresh questions every time practice starts!
      generateFreshQuestions(initSub, initTopic, initDiff, true);
    }
  }, [isOpen, activity, initialTopicId, initialDifficulty, studentGaps, startWithSubjectSelector, generateFreshQuestions]);

  // Handle changing Subject
  const handleSubjectChange = (newSubject: "MATH" | "GUJ" | "ENG" | "EVS") => {
    setSelectedSubject(newSubject);
    const topics = getTopicsForSubject(newSubject);
    // If student has a gap in this subject, pick that gap topic
    const gapTopic = topics.find((t) => studentGapForTopic(t));
    const nextTopicId = gapTopic ? gapTopic.id : topics[0]?.id || "";
    setSelectedTopicId(nextTopicId);
    generateFreshQuestions(newSubject, nextTopicId, selectedDifficulty, true);
  };

  // Handle changing Topic
  const handleTopicChange = (newTopicId: string) => {
    setSelectedTopicId(newTopicId);
    generateFreshQuestions(selectedSubject, newTopicId, selectedDifficulty, true);
  };

  // Handle changing Difficulty
  const handleDifficultyChange = (newDiff: "Easy" | "Medium" | "Hard") => {
    setSelectedDifficulty(newDiff);
    generateFreshQuestions(selectedSubject, selectedTopicId, newDiff, true);
  };

  // Explicit Shuffle / Regenerate questions on demand
  const handleRegenerateQuestions = () => {
    generateFreshQuestions(selectedSubject, selectedTopicId, selectedDifficulty, true);
  };

  const totalQuestions = questions.length;
  const currentQ: ActivityQuestion | undefined = questions[currentIdx];
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
    if (!currentActivity) return;
    setIsSaving(true);

    // Compute detailed breakdown of all questions for instant review
    let localScore = 0;
    const incorrectIds: string[] = [];
    const questionReview = (questions || []).map((q) => {
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

    const localTotal = questions.length || 1;
    const localPct = Math.round((localScore / localTotal) * 100);

    const fallbackResult = {
      success: true,
      percentage: localPct,
      attempt: {
        score: localScore,
        maximumScore: localTotal,
        percentage: localPct,
        studentId,
        activityId: currentActivity.id,
        answers: selectedAnswers,
        incorrectQuestions: incorrectIds,
      },
      feedback:
        localPct >= 80
          ? language === "gu"
            ? "અદ્ભુત કાર્ય! સંકલ્પના પર પૂર્ણ પ્રભુત્વ મેળવ્યું."
            : "Outstanding work! Concept mastered with high confidence."
          : localPct >= 50
          ? language === "gu"
            ? "સારો પ્રયાસ! જે પ્રશ્નોમાં ભૂલ થઈ છે તેનું પુનરાવર્તન કરો."
            : "Good practice! Review the questions you missed with your teacher."
          : language === "gu"
          ? "મહાવરો ચાલુ રાખો! મૂર્ત સાધનોથી શીખવાથી પાયો મજબૂત થશે."
          : "Keep practicing! Hands-on practice with objects will help build your foundation.",
      questionReview,
    };

    try {
      const res = await fetch("/api/activities/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: currentActivity.id,
          studentId,
          answers: selectedAnswers,
          questions,
          activityData: currentActivity,
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

  const currentTopic = currentSubjectTopics.find((t) => t.id === selectedTopicId) || currentSubjectTopics[0];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        inSetupStep
          ? language === "gu"
            ? "મહાવરા માટે વિષય, ટોપિક અને સ્તર પસંદ કરો"
            : "Select Subject, Topic & Difficulty"
          : `${currentTopic?.nameEn || "Practice Quiz"} — ${
              studentName || (language === "gu" ? "વિદ્યાર્થી મહાવરો" : "Student Practice")
            }`
      }
      description={
        inSetupStep
          ? language === "gu"
            ? "દરેક વખતે પસંદ કરેલા વિષય, ટોપિક અને મુશ્કેલી સ્તર મુજબ તદ્દન નવા પ્રશ્નો બનશે."
            : "Every practice session generates fresh, dynamic questions tailored to your chosen subject, topic and difficulty."
          : language === "gu"
          ? `ઇન્ટરેક્ટિવ ક્વિઝ • વિષય: ${selectedSubject} • ${selectedDifficulty} સ્તર • ${totalQuestions} પ્રશ્નો`
          : `Interactive Practice Quiz • ${selectedSubject} • ${selectedDifficulty} Level • ${totalQuestions} questions`
      }
      maxWidth="xl"
    >
      {/* 1. Setup / Subject Selection Step */}
      {inSetupStep ? (
        <div className="space-y-6 py-2">
          {/* Step A: Select Subject */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#49352F] uppercase tracking-wider block">
              1. {language === "gu" ? "વિષય પસંદ કરો:" : "Select Subject:"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUBJECTS.map((sub) => {
                const Icon = sub.icon;
                const isSelected = selectedSubject === sub.code;

                return (
                  <button
                    key={sub.code}
                    type="button"
                    onClick={() => handleSubjectChange(sub.code as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? "border-[#49352F] bg-[#F2CAB3]/60 shadow-md ring-2 ring-[#B26A1B]"
                        : "border-[#49352F]/15 bg-white hover:bg-[#FAF6E9] hover:border-[#49352F]/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white border border-[#49352F]/15 flex items-center justify-center text-[#49352F] shadow-2xs shrink-0">
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

                    <p className="text-[11px] text-[#7A6862] mt-2 line-clamp-2">
                      {language === "gu" ? sub.descGu : sub.descEn}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step B: Select Topic */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#49352F] uppercase tracking-wider block">
              2. {language === "gu" ? "ટોપિક / સંકલ્પના પસંદ કરો:" : "Select Practice Topic / Concept:"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentSubjectTopics.map((top) => {
                const isSelected = selectedTopicId === top.id;
                const gap = studentGapForTopic(top);

                return (
                  <button
                    key={top.id}
                    type="button"
                    onClick={() => setSelectedTopicId(top.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-[#49352F] bg-[#F2DCB5]/80 shadow-xs ring-2 ring-[#B26A1B]"
                        : "border-[#49352F]/12 bg-white hover:bg-[#FAF6E9]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-bold text-xs text-[#49352F]">
                        {language === "gu" ? top.nameGu : top.nameEn}
                      </span>
                      {gap && (
                        <Badge variant="needsSupport" size="sm">
                          ⭐ {language === "gu" ? "સુધારણા જરૂરી" : "Target Gap"}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-[#7A6862] mt-1 line-clamp-1">
                      {language === "gu" ? top.descriptionGu : top.descriptionEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step C: Select Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#49352F] uppercase tracking-wider block">
              3. {language === "gu" ? "મુશ્કેલી સ્તર પસંદ કરો:" : "Select Difficulty Level:"}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(["Easy", "Medium", "Hard"] as const).map((diff) => {
                const isSelected = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs ${
                      isSelected
                        ? diff === "Easy"
                          ? "bg-[#2E7D5E] text-white border-[#2E7D5E] shadow-sm"
                          : diff === "Medium"
                          ? "bg-[#B26A1B] text-white border-[#B26A1B] shadow-sm"
                          : "bg-[#C54738] text-white border-[#C54738] shadow-sm"
                        : "bg-white text-[#49352F] border-[#49352F]/15 hover:bg-[#FAF6E9]"
                    }`}
                  >
                    <div>{diff === "Easy" ? "🟢 Easy" : diff === "Medium" ? "🟡 Medium" : "🔴 Hard"}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">
                      {diff === "Easy"
                        ? language === "gu" ? "સરળ સ્તર" : "Beginner"
                        : diff === "Medium"
                        ? language === "gu" ? "મધ્યમ સ્તર" : "Intermediate"
                        : language === "gu" ? "કઠિન સ્તર" : "Advanced"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button: Start Practice with Fresh Generated Questions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#49352F]/10">
            <span className="text-xs font-semibold text-[#7A6862]">
              {language === "gu"
                ? `પસંદગી: ${currentTopic?.nameGu} • ${selectedDifficulty}`
                : `Ready: ${currentTopic?.nameEn} (${selectedDifficulty})`}
            </span>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => {
                generateFreshQuestions(selectedSubject, selectedTopicId, selectedDifficulty, true);
                setInSetupStep(false);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold bg-[#F2CAB3] hover:bg-white text-[#49352F] border border-[#49352F]/16 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {isGenerating
                  ? language === "gu" ? "પ્રશ્નો તૈયાર થઈ રહ્યા છે..." : "Generating Questions..."
                  : language === "gu" ? "મહાવરો શરૂ કરો (નવા પ્રશ્નો)" : "Launch Practice (Fresh Questions)"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : !isSubmitted ? (
        /* 2. Active Interactive Practice Quiz View with Comprehensive Adaptive Controls */
        <div className="space-y-5">
          {/* Top Control Bar: Subject, Topic, Difficulty Selector, and Regenerate Questions */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6E9] border border-[#49352F]/12 shadow-2xs space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Subject Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#7A6862]">
                  {language === "gu" ? "વિષય:" : "Subject:"}
                </span>
                <select
                  value={selectedSubject}
                  aria-label="Select Practice Subject"
                  onChange={(e) => handleSubjectChange(e.target.value as any)}
                  className="rounded-xl border border-[#49352F]/15 bg-white px-2.5 py-1 text-xs font-bold text-[#49352F] shadow-2xs cursor-pointer outline-hidden"
                >
                  {SUBJECTS.map((sub) => (
                    <option key={sub.code} value={sub.code}>
                      {sub.code}: {language === "gu" ? sub.nameGu : sub.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Dropdown */}
              <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                <span className="text-[11px] font-bold text-[#7A6862]">
                  {language === "gu" ? "ટોપિક:" : "Topic:"}
                </span>
                <select
                  value={selectedTopicId}
                  aria-label="Select Practice Topic"
                  onChange={(e) => handleTopicChange(e.target.value)}
                  className="rounded-xl border border-[#49352F]/15 bg-white px-2.5 py-1 text-xs font-bold text-[#49352F] shadow-2xs cursor-pointer outline-hidden w-full max-w-[280px] truncate"
                >
                  {currentSubjectTopics.map((top) => {
                    const isGap = studentGapForTopic(top);
                    return (
                      <option key={top.id} value={top.id}>
                        {isGap ? "⭐ " : ""}{language === "gu" ? top.nameGu : top.nameEn}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Shuffle / New Questions Button */}
              <button
                type="button"
                onClick={handleRegenerateQuestions}
                title={language === "gu" ? "નવા પ્રશ્નો જનરેટ કરો" : "Generate completely fresh questions"}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#49352F]/15 hover:bg-[#F2CAB3] text-[#49352F] text-xs font-bold shadow-2xs cursor-pointer transition-colors"
              >
                <Shuffle className={`w-3.5 h-3.5 text-[#B26A1B] ${isGenerating ? "animate-spin" : ""}`} />
                <span>{language === "gu" ? "નવા પ્રશ્નો" : "New Questions"}</span>
              </button>
            </div>

            {/* Difficulty Selector Pills */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#49352F]/10">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#7A6862]">
                  {language === "gu" ? "મુશ્કેલી સ્તર:" : "Difficulty:"}
                </span>
                <div className="inline-flex rounded-xl bg-white border border-[#49352F]/15 p-0.5">
                  {(["Easy", "Medium", "Hard"] as const).map((diff) => {
                    const isSelected = selectedDifficulty === diff;
                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => handleDifficultyChange(diff)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? diff === "Easy"
                              ? "bg-[#2E7D5E] text-white shadow-2xs"
                              : diff === "Medium"
                              ? "bg-[#B26A1B] text-white shadow-2xs"
                              : "bg-[#C54738] text-white shadow-2xs"
                            : "text-[#7A6862] hover:text-[#49352F]"
                        }`}
                      >
                        {diff === "Easy"
                          ? language === "gu" ? "સરળ" : "Easy"
                          : diff === "Medium"
                          ? language === "gu" ? "મધ્યમ" : "Medium"
                          : language === "gu" ? "કઠિન" : "Hard"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInSetupStep(true)}
                className="text-[11px] font-bold text-[#B26A1B] hover:underline cursor-pointer"
              >
                {language === "gu" ? "બધા વિષયો જુઓ" : "All Topics →"}
              </button>
            </div>
          </div>

          {/* Progress Bar & Indicators */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#7A6862]">
              <span className="flex items-center gap-1.5">
                <Badge variant="outline" size="sm">
                  {selectedSubject} • {selectedDifficulty}
                </Badge>
                <span>
                  {language === "gu"
                    ? `પ્રશ્ન ${currentIdx + 1} / ${totalQuestions}`
                    : `Question ${currentIdx + 1} of ${totalQuestions}`}
                </span>
              </span>
              <span>
                {language === "gu"
                  ? `${Math.round(((currentIdx + 1) / (totalQuestions || 1)) * 100)}% પૂર્ણ`
                  : `${Math.round(((currentIdx + 1) / (totalQuestions || 1)) * 100)}% Complete`}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#FAF6E9] border border-[#49352F]/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F2CAB3] to-[#B26A1B] transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / (totalQuestions || 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Active Question Card */}
          {isGenerating ? (
            <div className="p-12 text-center rounded-2xl bg-[#FAF6E9] border border-[#49352F]/12 text-xs font-semibold text-[#7A6862] space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#B26A1B] mx-auto" />
              <p>
                {language === "gu"
                  ? `${currentTopic?.nameGu} માટે નવા પ્રશ્નો બની રહ્યા છે...`
                  : `Generating fresh practice questions for ${currentTopic?.nameEn}...`}
              </p>
            </div>
          ) : currentQ ? (
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
          {!isGenerating && currentQ?.options && (
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

          {/* Navigation Controls */}
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
        /* 3. Comprehensive Completion & Detailed Quiz Review Screen */
        <div className="text-center py-5 space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#2E7D5E]/15 text-[#2E7D5E] flex items-center justify-center shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-[#49352F]">
              {language === "gu" ? "મહાવરો પૂર્ણ થયો!" : "Practice Quiz Completed!"}
            </h4>
            <p className="text-xs text-[#7A6862] mt-1">
              {language === "gu"
                ? `${studentName || "વિદ્યાર્થી"} માટે ${currentTopic?.nameGu} (${selectedDifficulty} સ્તર) નું પરિણામ નોંધાયું`
                : `Result recorded for ${studentName || "Student"} in ${currentTopic?.nameEn} (${selectedDifficulty} level)`}
            </p>
          </div>

          {/* Primary Score & Feedback Card */}
          <div className="p-5 max-w-sm mx-auto rounded-3xl bg-[#FAF6E9] border border-[#49352F]/15 shadow-xs space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span
                className={`text-4xl font-extrabold ${
                  (attemptResult?.percentage || 0) >= 80
                    ? "text-[#2E7D5E]"
                    : (attemptResult?.percentage || 0) >= 60
                    ? "text-[#B26A1B]"
                    : "text-[#C54738]"
                }`}
              >
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

          {/* Action Buttons: Practice Again (Fresh Questions), Level Up, Change Topic, Done */}
          <div className="flex items-center justify-center gap-2.5 pt-4 flex-wrap">
            {/* Practice Again button: MUST generate BRAND NEW questions every time! */}
            <button
              type="button"
              onClick={() => generateFreshQuestions(selectedSubject, selectedTopicId, selectedDifficulty, true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#FAF6E9] hover:bg-[#F2CAB3] text-[#49352F] border border-[#49352F]/15 rounded-xl cursor-pointer transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#B26A1B]" />
              <span>
                {language === "gu" ? "ફરીથી મહાવરો કરો (નવા પ્રશ્નો)" : "Practice Again (Fresh Questions)"}
              </span>
            </button>

            {/* Level Up Button if scored >= 80% */}
            {(attemptResult?.percentage || 0) >= 80 && selectedDifficulty !== "Hard" && (
              <button
                type="button"
                onClick={() => {
                  const nextDiff = selectedDifficulty === "Easy" ? "Medium" : "Hard";
                  handleDifficultyChange(nextDiff);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#2E7D5E]/15 text-[#2E7D5E] hover:bg-[#2E7D5E] hover:text-white border border-[#2E7D5E]/30 rounded-xl cursor-pointer transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {selectedDifficulty === "Easy"
                    ? language === "gu" ? "મધ્યમ સ્તરે આગળ વધો →" : "Advance to Medium Level →"
                    : language === "gu" ? "કઠિન સ્તરે આગળ વધો →" : "Advance to Hard Level →"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setInSetupStep(true);
                setIsSubmitted(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-[#B26A1B] hover:bg-[#F2CAB3]/30 rounded-xl cursor-pointer transition-colors"
            >
              {language === "gu" ? "અન્ય ટોપિક પસંદ કરો" : "Choose Other Topic"}
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
