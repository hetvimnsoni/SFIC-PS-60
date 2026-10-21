"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { NoticeComposer } from "@/components/notices/NoticeComposer";
import { NoticeTranslationPanel } from "@/components/notices/NoticeTranslationPanel";
import { NoticeDeliveryTracker } from "@/components/notices/NoticeDeliveryTracker";
import { NoticeAssistantChat } from "@/components/notices/NoticeAssistantChat";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { useAuth } from "@/context/AuthContext";
import {
  MessageSquare,
  Sparkles,
  Languages,
  Send,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Volume2,
  Search,
  Filter,
  ArrowRight,
  Eye,
  Sliders,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  X,
  Share2,
} from "lucide-react";
import type { SchoolNotice, NoticeTranslation, NoticeDelivery, SupportedLanguage } from "@/lib/types";

export default function NoticesPage() {
  const { user, role, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<"feed" | "compose" | "assistant" | "parent_view">("feed");
  const [notices, setNotices] = useState<SchoolNotice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<SchoolNotice | null>(null);
  const [noticeTranslations, setNoticeTranslations] = useState<NoticeTranslation[]>([]);
  const [noticeDeliveries, setNoticeDeliveries] = useState<NoticeDelivery[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

  // Load notices from server API
  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedGrade !== "all") params.append("grade", selectedGrade);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/notices?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setNotices(data.data);
        if (!selectedNotice && data.data.length > 0) {
          loadNoticeDetails(data.data[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load notices:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNoticeDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/notices/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedNotice(data.data);
        setNoticeTranslations(data.data.translations || []);
        setNoticeDeliveries(data.data.deliveries || []);
      }
    } catch (e) {
      console.error("Failed to load notice details:", e);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [selectedCategory, selectedGrade]);

  const handleNoticeCreated = (newNotice: SchoolNotice) => {
    setNotices((prev) => [newNotice, ...prev]);
    setSelectedNotice(newNotice);
    loadNoticeDetails(newNotice.id);
    setActiveTab("feed");
  };

  const handleNoticeSelect = (id: string) => {
    loadNoticeDetails(id);
    setActiveTab("feed");
  };

  // Aggregated Stats
  const totalNotices = notices.length;
  const totalSentDeliveries = notices.reduce((acc, n: any) => acc + (n.deliveryStats?.totalSent || 0), 0);
  const totalAcknowledged = notices.reduce((acc, n: any) => acc + (n.deliveryStats?.acknowledgedCount || 0), 0);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Top Header Banner */}
        <div className="bg-[#FAF6E9] border border-[#49352F]/15 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#49352F]/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2CAB3]/60 border border-[#49352F]/15 text-xs font-bold text-[#49352F] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#2E7D5E]" />
                AI Parent-School Language Bridge
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#49352F] tracking-tight font-heading">
                Simplified, Multilingual &amp; Voice-Enabled School Communication
              </h1>
              <p className="text-xs sm:text-sm text-[#49352F]/70 mt-1 max-w-2xl leading-relaxed">
                Empowering teachers to simplify complex school policies into crystal-clear parent notices, instantly translate into Gujarati &amp; Hindi with native speech, and track parent delivery and acknowledgments.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("compose")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#49352F] hover:bg-[#49352F]/90 text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Compose New Notice</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("assistant")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF6E9] text-[#49352F] border border-[#49352F]/20 text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#2E7D5E]" />
                <span>Notice Assistant</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-3.5 bg-white rounded-2xl border border-[#49352F]/10">
              <div className="text-xs font-semibold text-[#49352F]/70">Published Notices</div>
              <div className="mt-1 text-2xl font-black text-[#49352F]">{totalNotices}</div>
              <div className="text-[11px] text-[#2E7D5E] font-medium mt-0.5">All school circulars</div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#49352F]/10">
              <div className="text-xs font-semibold text-[#49352F]/70">Indian Languages</div>
              <div className="mt-1 text-2xl font-black text-[#49352F]">3 Active</div>
              <div className="text-[11px] text-[#49352F]/60 mt-0.5">English, ગુજરાતી, हिंदी</div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#49352F]/10">
              <div className="text-xs font-semibold text-[#49352F]/70">Messages Dispatched</div>
              <div className="mt-1 text-2xl font-black text-blue-900">{totalSentDeliveries}</div>
              <div className="text-[11px] text-blue-700 font-medium mt-0.5">WhatsApp &amp; SMS delivery</div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#49352F]/10">
              <div className="text-xs font-semibold text-[#49352F]/70">Parent Acknowledgments</div>
              <div className="mt-1 text-2xl font-black text-emerald-900">{totalAcknowledged}</div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Verified parent sign-offs</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#49352F]/15 pb-2">
          <div className="inline-flex rounded-2xl border border-[#49352F]/15 p-1 bg-[#FAF6E9]">
            <button
              type="button"
              onClick={() => setActiveTab("feed")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "feed"
                  ? "bg-[#49352F] text-white shadow-xs"
                  : "text-[#49352F]/70 hover:text-[#49352F]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notice Hub &amp; Translation Hub</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("compose")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "compose"
                  ? "bg-[#49352F] text-white shadow-xs"
                  : "text-[#49352F]/70 hover:text-[#49352F]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D5E]" />
              <span>Compose &amp; AI Simplify</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("assistant")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "assistant"
                  ? "bg-[#49352F] text-white shadow-xs"
                  : "text-[#49352F]/70 hover:text-[#49352F]"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#B26A1B]" />
              <span>AI Notice Assistant (Q&amp;A)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("parent_view")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "parent_view"
                  ? "bg-[#49352F] text-white shadow-xs"
                  : "text-[#49352F]/70 hover:text-[#49352F]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Parent Experience Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#49352F]/70 font-semibold">Current Role:</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F2CAB3]/40 text-[#49352F] border border-[#49352F]/15 uppercase">
              {role}
            </span>
          </div>
        </div>

        {/* TAB 1: Notice Feed & Distribution Hub */}
        {activeTab === "feed" && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white border border-[#49352F]/15 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[#49352F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchNotices()}
                  placeholder="Search notices by keyword, date, or topic..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-[#FAF6E9]/50 border border-[#49352F]/15 text-[#49352F] focus:outline-none focus:ring-2 focus:ring-[#F2CAB3]"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-[#FAF6E9] border border-[#49352F]/15 text-[#49352F] font-semibold"
                >
                  <option value="all">All Categories</option>
                  <option value="announcement">Announcements</option>
                  <option value="event">School Events</option>
                  <option value="homework">Homework / Project</option>
                  <option value="exam">Examinations</option>
                  <option value="fee">Fees / Admin</option>
                  <option value="urgent_alert">Urgent Alerts</option>
                </select>

                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-[#FAF6E9] border border-[#49352F]/15 text-[#49352F] font-semibold"
                >
                  <option value="all">All Grades</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                </select>
              </div>
            </div>

            {/* Split Screen: Notice Cards List + Selected Notice Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Notice Feed Cards (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#49352F] uppercase tracking-wider px-1">
                  <span>School Circulars ({notices.length})</span>
                  <span>Select to Inspect</span>
                </div>

                {isLoading ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-[#49352F]/15">
                    <p className="text-xs text-[#49352F]/60">Loading school notices...</p>
                  </div>
                ) : notices.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#49352F]/20">
                    <FileText className="w-8 h-8 text-[#49352F]/30 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#49352F]">No school notices match your filter.</p>
                  </div>
                ) : (
                  notices.map((notice) => {
                    const isSelected = selectedNotice?.id === notice.id;
                    return (
                      <div
                        key={notice.id}
                        onClick={() => loadNoticeDetails(notice.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-left shadow-xs ${
                          isSelected
                            ? "bg-[#FAF6E9] border-[#49352F] ring-2 ring-[#F2CAB3]"
                            : "bg-white border-[#49352F]/15 hover:border-[#49352F]/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F2CAB3]/40 text-[#49352F] border border-[#49352F]/10">
                            {notice.category}
                          </span>

                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                            notice.urgency === "urgent"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : notice.urgency === "important"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}>
                            {notice.urgency}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-[#49352F] line-clamp-1 mb-1">
                          {notice.title}
                        </h3>

                        <p className="text-xs text-[#49352F]/70 line-clamp-2 leading-relaxed mb-3">
                          {notice.simplifiedContent || notice.originalContent}
                        </p>

                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#49352F]/10 text-[#49352F]/60">
                          <span>Target: {notice.targetClassGrade ? `Grade ${notice.targetClassGrade}` : "All School"}</span>
                          <span className="flex items-center gap-1 font-semibold text-[#2E7D5E]">
                            <Languages className="w-3 h-3" />
                            <span>{(notice as any).translationsCount || 2} Languages</span>
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Active Notice Inspector (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {selectedNotice ? (
                  <>
                    {/* Notice Metadata Header Card */}
                    <div className="bg-white border border-[#49352F]/15 rounded-2xl p-6 shadow-sm">
                      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#49352F]/10">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-[#2E7D5E] bg-[#2E7D5E]/10 px-2 py-0.5 rounded border border-[#2E7D5E]/20 capitalize">
                              {selectedNotice.status}
                            </span>
                            <span className="text-xs text-[#49352F]/60">
                              Issued by {selectedNotice.senderTeacherName}
                            </span>
                          </div>
                          <h2 className="text-lg font-bold text-[#49352F]">
                            {selectedNotice.title}
                          </h2>
                        </div>

                        <AudioPlayer
                          text={selectedNotice.simplifiedContent || selectedNotice.originalContent}
                          language={selectedNotice.originalLanguage}
                          buttonLabel="Listen Notice"
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#49352F]">
                        <div className="p-2.5 bg-[#FAF6E9] rounded-xl border border-[#49352F]/10">
                          <span className="text-[10px] text-[#49352F]/60 font-semibold block uppercase">Target Class</span>
                          <span className="font-bold">{selectedNotice.targetClassGrade ? `Grade ${selectedNotice.targetClassGrade}` : "All Classes"}</span>
                        </div>
                        <div className="p-2.5 bg-[#FAF6E9] rounded-xl border border-[#49352F]/10">
                          <span className="text-[10px] text-[#49352F]/60 font-semibold block uppercase">Reading Level</span>
                          <span className="font-bold capitalize">{(selectedNotice.readingLevel || "simple").replace("_", " ")}</span>
                        </div>
                        <div className="p-2.5 bg-[#FAF6E9] rounded-xl border border-[#49352F]/10">
                          <span className="text-[10px] text-[#49352F]/60 font-semibold block uppercase">Sign-Off Required</span>
                          <span className="font-bold">{selectedNotice.requiresAcknowledgment ? "Yes (Mandatory)" : "Optional"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Multilingual Translation Panel with AudioPlayer */}
                    <NoticeTranslationPanel
                      notice={selectedNotice}
                      translations={noticeTranslations}
                      onTranslationUpdated={(updated) => {
                        setNoticeTranslations((prev) => {
                          const idx = prev.findIndex((t) => t.id === updated.id);
                          if (idx !== -1) {
                            const copy = [...prev];
                            copy[idx] = updated;
                            return copy;
                          }
                          return [...prev, updated];
                        });
                      }}
                    />

                    {/* Delivery Tracker */}
                    <NoticeDeliveryTracker
                      notice={selectedNotice}
                      deliveries={noticeDeliveries}
                      onDeliveriesUpdated={(newDels) => setNoticeDeliveries(newDels)}
                    />
                  </>
                ) : (
                  <div className="p-12 text-center bg-white rounded-2xl border border-[#49352F]/15">
                    <p className="text-sm font-semibold text-[#49352F]">Select a notice on the left to inspect its translations and distribution.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Compose & Simplify */}
        {activeTab === "compose" && (
          <NoticeComposer onNoticeCreated={handleNoticeCreated} />
        )}

        {/* TAB 3: Notice Assistant Chat */}
        {activeTab === "assistant" && (
          <div className="max-w-4xl mx-auto">
            <NoticeAssistantChat onNoticeSelect={handleNoticeSelect} />
          </div>
        )}

        {/* TAB 4: Parent Experience Preview */}
        {activeTab === "parent_view" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#FAF6E9] border border-[#49352F]/15 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#49352F] block">Parent View Simulator</span>
                <span className="text-xs text-[#49352F]/70">
                  Simulating view for Dineshbhai Patel (Parent of Aarav Patel, Grade 5-A). Preferred Language: Gujarati (ગુજરાતી).
                </span>
              </div>

              <button
                type="button"
                onClick={() => switchRole("parent")}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#49352F] text-white hover:bg-[#49352F]/90 cursor-pointer"
              >
                Switch to Parent Role
              </button>
            </div>

            {selectedNotice ? (
              <div className="bg-white border border-[#49352F]/20 rounded-3xl p-6 md:p-8 shadow-md">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#49352F]/10">
                  <div>
                    <span className="text-xs font-bold text-[#2E7D5E] bg-[#2E7D5E]/10 px-2 py-0.5 rounded">
                      Official Notice &bull; {selectedNotice.category.toUpperCase()}
                    </span>
                    <h2 className="text-xl font-bold text-[#49352F] mt-1">
                      {selectedNotice.title}
                    </h2>
                    <span className="text-xs text-[#49352F]/60">
                      Published for Grade {selectedNotice.targetClassGrade || "All"} &bull; Gujarat Adarsh Vidyalaya
                    </span>
                  </div>

                  <AudioPlayer
                    text={
                      noticeTranslations.find((t) => t.language === "gu")?.translatedContent ||
                      selectedNotice.simplifiedContent ||
                      selectedNotice.originalContent
                    }
                    language="gu"
                    buttonLabel="Listen (ગુજરાતી)"
                  />
                </div>

                <div className="mt-6 p-4 bg-[#FAF6E9] rounded-2xl border border-[#49352F]/10">
                  <span className="text-[11px] font-bold text-[#49352F]/60 uppercase tracking-wider block mb-1">
                    ગુજરાતી ભાષામાં સૂચના (Simplified Gujarati Notice):
                  </span>
                  <p className="text-sm font-sans text-[#49352F] leading-relaxed whitespace-pre-wrap">
                    {noticeTranslations.find((t) => t.language === "gu")?.translatedContent ||
                      "આ સૂચના આપના બાળકના વર્ગ માટે જારી કરવામાં આવી છે. કૃપા કરીને નિયત સમયમર્યાદા ધ્યાનમાં લો."}
                  </p>
                </div>

                <div className="mt-4 p-4 bg-white rounded-2xl border border-[#49352F]/10">
                  <span className="text-[11px] font-bold text-[#49352F]/60 uppercase tracking-wider block mb-1">
                    English Simplified Notice:
                  </span>
                  <p className="text-xs font-sans text-[#49352F]/80 leading-relaxed whitespace-pre-wrap">
                    {selectedNotice.simplifiedContent || selectedNotice.originalContent}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#49352F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-[#49352F]/70 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Digital parent sign-off confirms receipt with the school administration.</span>
                  </span>

                  <button
                    type="button"
                    onClick={async () => {
                      if (selectedNotice && noticeDeliveries.length > 0) {
                        const targetDelivery = noticeDeliveries[0];
                        await fetch(`/api/notices/${selectedNotice.id}/acknowledge`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            deliveryId: targetDelivery.id,
                            feedback: "Acknowledged by Dineshbhai Patel.",
                          }),
                        });
                        alert("Thank you! Notice acknowledged successfully.");
                        loadNoticeDetails(selectedNotice.id);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Acknowledge &amp; Confirm Notice</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
