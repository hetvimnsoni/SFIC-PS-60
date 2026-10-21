"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";
import { triggerPageTour } from "@/components/tutorial/SpotlightTour";
import { TUTORIAL_FAQS } from "@/config/tutorialData";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  ChevronDown,
  Minimize2,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

export function GlobalShikshaBot() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getPageTourKey = (path: string): string => {
    if (path === "/dashboard" || path === "/") return "dashboard";
    if (path.startsWith("/students/") && path !== "/students") return "studentDetail";
    if (path.startsWith("/students")) return "students";
    if (path.startsWith("/learning-gaps")) return "learningGaps";
    if (path.startsWith("/remedial-plans")) return "remedialPlans";
    if (path.startsWith("/reports")) return "reports";
    return "dashboard";
  };

  const handleStartPageTour = () => {
    setIsOpen(false);
    const tourKey = getPageTourKey(pathname);
    triggerPageTour(tourKey);
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text:
        language === "gu"
          ? "નમસ્તે! હું શિક્ષાબોટ છું. હું તમને વિદ્યાર્થીઓના લર્નિંગ ગેપ્સ ઓળખવામાં અને ૫-પગલાંની ઉપચારાત્મક યોજનાઓ તૈયાર કરવામાં મદદ કરી શકું છું. તમે શું જાણવા માંગો છો?"
          : "Hello! I'm ShikshaBot, your offline pedagogical assistant. I can help analyze learning gaps, generate 5-step remedial plans for Aarav, or explain benchmark thresholds. How can I assist you today?",
      time: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    {
      label: language === "gu" ? "આજે કોને મદદની જરૂર છે?" : "Who needs help today?",
      query: "Who needs immediate help today in Class 4?",
    },
    {
      label: language === "gu" ? "આરવ માટે ઉપચારાત્મક યોજના બનાવો" : "Make a plan for Aarav",
      query: "Generate a 5-step remedial plan for Aarav Patel in Division Basics.",
    },
    {
      label: language === "gu" ? "૬૦% બેન્ચમાર્ક નિયમ સમજાવો" : "Explain 60% threshold",
      query: "Explain the 60% mastery threshold rule used in ShikshaSetu AI.",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    // 1. Instant offline keyword match against TUTORIAL_FAQS
    const lower = text.toLowerCase();
    const matchedFaq = TUTORIAL_FAQS.find((faq) =>
      faq.keywords.some((kw) => lower.includes(kw.toLowerCase()))
    );

    if (matchedFaq) {
      const answer = language === "gu" ? matchedFaq.answerGu : matchedFaq.answerEn;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            sender: "bot",
            text: `[${language === "gu" ? "ઑફલાઇન સહાયક" : "Offline Knowledge"}]: ${answer}`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setIsLoading(false);
      }, 250);
      return;
    }

    try {
      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          language: language === "gu" ? "gu" : "en",
          userRole: "teacher",
        }),
      });

      const data = await res.json();
      const botResponseText =
        data.reply ||
        data.text ||
        (language === "gu"
          ? "આરવ પટેલ (ધોરણ ૪) ને ભાગાકારના ખ્યાલમાં ૫-પગલાંની મણકા અને નંબર-લાઇન પ્રવૃત્તિથી +૫૦ પોઈન્ટનો સુધારો થયો છે."
          : "Based on our offline pedagogical engine, Aarav Patel was identified with a 35% baseline in Division Basics. A 5-step manipulative plan with counters led to an 85% mastery score (+50 pp gain).");

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: "bot",
          text: botResponseText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: "bot",
          text:
            language === "gu"
              ? "ઑફલાઇન સહાયક: વર્ગખંડમાં ૪ વિદ્યાર્થીઓને ૬૦% કરતાં ઓછા ગુણ સાથે વિશેષ ધ્યાનની જરૂર છે."
              : "Offline rule-engine response: 4 students currently fall below the 60% benchmark threshold (Aarav, Pooja, Karan, Diya). Check /remedial-plans for action items.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden select-none">
      {/* Floating Warm Assistant Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          data-tour="shikshabot-trigger"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#FAF6E9] via-[#F2DCB5] to-[#F2CAB3] p-0.5 shadow-[0_4px_20px_rgba(73,53,47,0.15)] hover:shadow-[0_6px_28px_rgba(73,53,47,0.22)] border border-[#49352F]/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          aria-label="Open ShikshaBot AI Assistant"
        >
          {/* Inner orb reflection */}
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden border border-[#49352F]/10">
            <Bot className="w-6 h-6 text-[#49352F] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
            {/* Pulsing sage dot */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#2E7D5E] shadow-[0_0_8px_#2E7D5E]" />
          </div>

          {/* Persistent speech callout badge for new teachers */}
          <div className="absolute right-full mr-3 top-2 px-3 py-1.5 rounded-2xl bg-white border border-[#49352F]/15 text-[11px] font-bold text-[#49352F] shadow-[0_4px_16px_rgba(73,53,47,0.1)] whitespace-nowrap pointer-events-none hidden sm:flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-[#8D4E10] shrink-0" aria-hidden="true" />
            <span>{language === "gu" ? "વેબસાઇટ ટૂર માટે અહીં ક્લિક કરો" : "New here? Click for website tour"}</span>
          </div>

          {/* Hover tooltip label */}
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#49352F] text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            {language === "gu" ? "શિક્ષાબોટ સહાયક (ટૂર અને મદદ)" : "ShikshaBot AI (Tour & Help)"}
          </span>
        </button>
      )}

      {/* Expanded Glassmorphic Chat Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-3xl bg-white/95 border border-[#49352F]/15 shadow-[0_20px_60px_-15px_rgba(73,53,47,0.18)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-[#49352F]">
          {/* Top Panel Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#49352F]/10 bg-[#FAF6E9]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F2CAB3] border border-[#49352F]/15 flex items-center justify-center text-sm shadow-xs">
                <Bot className="w-4 h-4 text-[#49352F]" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#49352F]">ShikshaBot AI</h4>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#2E7D5E]/15 text-[#2E7D5E] border border-[#2E7D5E]/20 text-[9px] font-extrabold uppercase">
                    Offline
                  </span>
                </div>
                <p className="text-[10px] text-[#7A6862]">Pedagogical Rule Assistant</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-[#7A6862] hover:text-[#49352F] hover:bg-white transition-colors cursor-pointer"
              aria-label="Close assistant"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-[#F4F1E1]/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-[#FAF6E9] border border-[#49352F]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-[#49352F]" aria-hidden="true" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3 leading-relaxed shadow-xs ${
                    msg.sender === "user"
                      ? "bg-[#F2CAB3] text-[#49352F] font-medium border border-[#49352F]/12 rounded-tr-xs"
                      : "bg-white text-[#49352F] border border-[#49352F]/12 rounded-tl-xs shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 ${
                      msg.sender === "user" ? "text-[#49352F]/70 text-right" : "text-[#7A6862]"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-[#7A6862] text-xs italic">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#B26A1B]" />
                <span>Consulting pedagogical rule engine...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Pills */}
          <div className="px-3 py-2 border-t border-[#49352F]/10 bg-[#FAF6E9] flex items-center gap-1.5 overflow-x-auto">
            {/* Quick-chip: Show me how to use this page */}
            <button
              type="button"
              onClick={handleStartPageTour}
              className="shrink-0 text-[11px] font-bold text-white bg-[#49352F] hover:bg-[#2C1F1B] px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-[#F2CAB3]" />
              <span>{language === "gu" ? "આ પેજ કેવી રીતે વાપરવું? (ટૂર)" : "Show me how to use this page"}</span>
            </button>
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p.query)}
                className="shrink-0 text-[11px] font-semibold text-[#49352F] hover:bg-[#F2DCB5]/50 bg-white border border-[#49352F]/12 px-2.5 py-1 rounded-full transition-colors cursor-pointer shadow-xs"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#49352F]/10 bg-[#FAF6E9] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                language === "gu"
                  ? "વિદ્યાર્થી અથવા નિયમ વિશે પૂછો..."
                  : "Ask about a student, gap, or 5-step plan..."
              }
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#49352F]/15 text-xs text-[#49352F] placeholder-[#7A6862] focus:outline-hidden focus:border-[#F2CAB3]"
            />
            <Button
              type="submit"
              variant="saffron"
              size="sm"
              disabled={!inputValue.trim() || isLoading}
              className="rounded-xl px-3 h-8 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
