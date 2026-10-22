"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  Server,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  DollarSign,
  Clock,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Layers,
  Languages,
  Mic,
  Volume2,
  MessageSquare,
  ExternalLink,
  Settings,
  Key,
  ChevronRight,
  Eye,
  Sliders,
  Check,
  Info,
  Copy,
} from "lucide-react";
import type { AiProviderName, AiTaskType, AiProviderConfig, AiUsageMetric } from "@/lib/types";

interface ProviderStatus {
  provider: AiProviderName;
  name: string;
  description: string;
  configured: boolean;
  status: "Connected" | "Not Configured" | "Invalid Credentials" | "Rate Limited" | "Provider Unavailable" | "Configuration Error" | "Unknown";
  supportedTasks: string[];
  supportedLanguages: string[];
  supportedModels: string[];
  defaultModel: string;
  baseUrl?: string;
  keyPreview: string | null;
  lastTestedAt?: string;
  lastTestMessage?: string;
  docUrl: string;
}

const PROVIDER_METAS: Record<string, { color: string; badgeBg: string; border: string; icon: any }> = {
  openai: {
    color: "text-emerald-700 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200",
    border: "border-emerald-200/80 hover:border-emerald-400",
    icon: Sparkles,
  },
  gemini: {
    color: "text-indigo-700 dark:text-indigo-400",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200",
    border: "border-indigo-200/80 hover:border-indigo-400",
    icon: Cpu,
  },
  anthropic: {
    color: "text-amber-700 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200",
    border: "border-amber-200/80 hover:border-amber-400",
    icon: Layers,
  },
  google_translate: {
    color: "text-blue-700 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200",
    border: "border-blue-200/80 hover:border-blue-400",
    icon: Languages,
  },
  "google-translate": {
    color: "text-blue-700 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200",
    border: "border-blue-200/80 hover:border-blue-400",
    icon: Languages,
  },
  bhashini: {
    color: "text-orange-700 dark:text-orange-400",
    badgeBg: "bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border-orange-200",
    border: "border-orange-200/80 hover:border-orange-400",
    icon: Server,
  },
  offline_fallback: {
    color: "text-teal-700 dark:text-teal-400",
    badgeBg: "bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200",
    border: "border-teal-200/80 hover:border-teal-400",
    icon: ShieldCheck,
  },
};

const TASK_DEFINITIONS: Record<AiTaskType, { title: string; desc: string; icon: any }> = {
  chat: {
    title: "General AI Chatbot",
    desc: "Interactive question-answering, pedagogy advice, and bilingual curriculum guidance.",
    icon: MessageSquare,
  },
  simplification: {
    title: "School Notice Simplification",
    desc: "Transforms complex notices into simple sentences while preserving dates and rules.",
    icon: Sparkles,
  },
  translation: {
    title: "Multilingual Language Translation",
    desc: "Translates between English, Gujarati, and Hindi with named entity preservation.",
    icon: Languages,
  },
  speech_to_text: {
    title: "Voice-to-Text Dictation (ASR)",
    desc: "Transcribes teacher voice notices into text for Gujarati, Hindi, and English.",
    icon: Mic,
  },
  text_to_speech: {
    title: "Text-to-Speech Audio (TTS)",
    desc: "Synthesizes native speech playback for translated school announcements.",
    icon: Volume2,
  },
  assistant: {
    title: "School Notice Q&A Assistant",
    desc: "Retrieval-augmented factual answering grounded strictly in school notices.",
    icon: HelpCircleIcon,
  },
};

function HelpCircleIcon(props: any) {
  return <MessageSquare {...props} />;
}

function AiProvidersManagementContent() {
  const { user, role, switchRole } = useAuth();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter") || "all";
  const tabParam = searchParams.get("tab") || "providers";

  const [activeTab, setActiveTab] = useState<"providers" | "capabilities" | "usage" | "logs">(
    tabParam === "usage" ? "usage" : tabParam === "logs" ? "logs" : tabParam === "settings" ? "capabilities" : "providers"
  );
  const [capabilityFilter, setCapabilityFilter] = useState<string>(filterParam);

  const [configs, setConfigs] = useState<AiProviderConfig[]>([]);
  const [providerStatuses, setProviderStatuses] = useState<ProviderStatus[]>([]);
  const [metricsSummary, setMetricsSummary] = useState<{
    totalRequests: number;
    errorCount: number;
    averageLatencyMs: number;
    totalCostUsd: number;
    recentMetrics: AiUsageMetric[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [pingingProvider, setPingingProvider] = useState<string | null>(null);
  const [pingResults, setPingResults] = useState<
    Record<string, { success: boolean; status: string; latencyMs: number; message: string }>
  >({});
  const [savingTask, setSavingTask] = useState<string | null>(null);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Key update modal state
  const [keyModalProvider, setKeyModalProvider] = useState<ProviderStatus | null>(null);
  const [newApiKey, setNewApiKey] = useState("");
  const [keyUpdateSuccess, setKeyUpdateSuccess] = useState(false);
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/ai-providers");
      const data = await res.json();
      if (res.ok && data.success) {
        setConfigs(data.data.configs);
        setProviderStatuses(data.data.providerStatus);
        setMetricsSummary(data.data.metricsSummary);
      }
    } catch (e) {
      console.error("Failed to load AI provider settings:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTestPing = async (provider: AiProviderName) => {
    setPingingProvider(provider);
    try {
      const res = await fetch("/api/admin/ai-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_ping", provider }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPingResults((prev) => ({
          ...prev,
          [provider]: {
            success: data.data.pingSuccess,
            status: data.data.status,
            latencyMs: data.data.latencyMs,
            message: data.data.message,
          },
        }));
      } else {
        setPingResults((prev) => ({
          ...prev,
          [provider]: {
            success: false,
            status: "Error",
            latencyMs: 0,
            message: data.error || "Connection test failed.",
          },
        }));
      }
    } catch (e: any) {
      setPingResults((prev) => ({
        ...prev,
        [provider]: {
          success: false,
          status: "Error",
          latencyMs: 0,
          message: e.message || "Network error during ping test.",
        },
      }));
    } finally {
      setPingingProvider(null);
    }
  };

  const handleConfigChange = async (
    task: AiTaskType,
    field: "primaryProvider" | "fallbackProvider",
    val: AiProviderName
  ) => {
    const existing = configs.find((c) => c.task === task) || {
      task,
      primaryProvider: "offline_fallback" as AiProviderName,
      fallbackProvider: "offline_fallback" as AiProviderName,
      enabled: true,
    };

    const updated = {
      ...existing,
      [field]: val,
    };

    setSavingTask(task);
    try {
      const res = await fetch("/api/admin/ai-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_config",
          task,
          primaryProvider: updated.primaryProvider,
          fallbackProvider: updated.fallbackProvider,
          enabled: updated.enabled,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConfigs((prev) => {
          const idx = prev.findIndex((c) => c.task === task);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = updated;
            return next;
          }
          return [...prev, updated];
        });
        setSaveNotification(`Routing for ${task} updated.`);
        setTimeout(() => setSaveNotification(null), 3000);
      }
    } catch (e) {
      console.error("Failed to update config:", e);
    } finally {
      setSavingTask(null);
    }
  };

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyModalProvider) return;

    setIsUpdatingKey(true);
    try {
      const res = await fetch("/api/admin/ai-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_key",
          provider: keyModalProvider.provider,
          apiKey: newApiKey,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setKeyUpdateSuccess(true);
        setTimeout(() => {
          setKeyUpdateSuccess(false);
          setKeyModalProvider(null);
          setNewApiKey("");
          fetchData();
        }, 1500);
      }
    } catch (e) {
      console.error("Failed to update key:", e);
    } finally {
      setIsUpdatingKey(false);
    }
  };

  // Filter providers according to active capability filter
  const filteredProviders = useMemo(() => {
    if (capabilityFilter === "all" || !capabilityFilter) {
      return providerStatuses;
    }
    const capMap: Record<string, string> = {
      chat: "chat",
      translation: "translation",
      "speech-to-text": "speech_to_text",
      "text-to-speech": "text_to_speech",
      simplification: "simplification",
    };
    const targetCap = capMap[capabilityFilter] || capabilityFilter;
    return providerStatuses.filter((p) => p.supportedTasks.includes(targetCap));
  }, [providerStatuses, capabilityFilter]);

  const isAdmin = role === "admin";

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7A6B63] dark:text-[#A89F91] mb-1">
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Admin Management</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#2E7D5E] font-bold">AI Providers</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#49352F] dark:text-[#EAE5D9] flex items-center gap-3">
              <span className="p-2 bg-[#2E7D5E]/10 dark:bg-[#2E7D5E]/20 text-[#2E7D5E] rounded-xl">
                <Cpu className="w-7 h-7" />
              </span>
              AI API Provider Management
            </h1>
            <p className="text-sm text-[#7A6B63] dark:text-[#A89F91] mt-1">
              Centralized orchestration, credential security, connection validation, and failover routing.
            </p>
          </div>

          {/* Quick Refresh & Role Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            {!isAdmin && (
              <button
                onClick={() => switchRole("admin")}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-700 border border-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
                title="Switch role to Administrator for full control"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Switch to Admin Mode
              </button>
            )}
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-[#2C2420] border border-[#D5CEBF] dark:border-[#4A3E38] text-[#49352F] dark:text-[#EAE5D9] hover:bg-[#F4F1E1] shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#2E7D5E]" : ""}`} />
              Refresh Telemetry
            </button>
          </div>
        </div>

        {/* Global Metric Telemetry Strip */}
        {metricsSummary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#251D19]/80 border border-[#D5CEBF]/60 dark:border-[#4A3E38] shadow-xs backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-bold text-[#7A6B63]">
                <span>Total AI Requests</span>
                <Activity className="w-4 h-4 text-[#2E7D5E]" />
              </div>
              <div className="text-2xl font-black text-[#49352F] dark:text-[#EAE5D9] mt-1">
                {metricsSummary.totalRequests}
              </div>
              <div className="text-[11px] text-[#7A6B63] mt-0.5">Recorded live in telemetry store</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#251D19]/80 border border-[#D5CEBF]/60 dark:border-[#4A3E38] shadow-xs backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-bold text-[#7A6B63]">
                <span>Average Latency</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-[#49352F] dark:text-[#EAE5D9] mt-1">
                {metricsSummary.averageLatencyMs} <span className="text-xs font-semibold text-[#7A6B63]">ms</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Within SLA &lt; 2500ms</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#251D19]/80 border border-[#D5CEBF]/60 dark:border-[#4A3E38] shadow-xs backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-bold text-[#7A6B63]">
                <span>Estimated Cost</span>
                <DollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-[#49352F] dark:text-[#EAE5D9] mt-1">
                ${metricsSummary.totalCostUsd.toFixed(4)}
              </div>
              <div className="text-[11px] text-[#7A6B63] mt-0.5">Calculated by token usage</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#251D19]/80 border border-[#D5CEBF]/60 dark:border-[#4A3E38] shadow-xs backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-bold text-[#7A6B63]">
                <span>Configured Providers</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-[#49352F] dark:text-[#EAE5D9] mt-1">
                {providerStatuses.filter((p) => p.configured).length} / {providerStatuses.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Zero credentials leaked</div>
            </div>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="border-b border-[#D5CEBF] dark:border-[#4A3E38] flex flex-wrap items-center justify-between gap-3">
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab("providers")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "providers"
                  ? "border-[#2E7D5E] text-[#2E7D5E]"
                  : "border-transparent text-[#7A6B63] dark:text-[#A89F91] hover:text-[#49352F]"
              }`}
            >
              <Cpu className="w-4 h-4" />
              All Providers ({providerStatuses.length})
            </button>

            <button
              onClick={() => setActiveTab("capabilities")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "capabilities"
                  ? "border-[#2E7D5E] text-[#2E7D5E]"
                  : "border-transparent text-[#7A6B63] dark:text-[#A89F91] hover:text-[#49352F]"
              }`}
            >
              <Sliders className="w-4 h-4" />
              Capability Routing & Failover
            </button>

            <button
              onClick={() => setActiveTab("usage")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "usage"
                  ? "border-[#2E7D5E] text-[#2E7D5E]"
                  : "border-transparent text-[#7A6B63] dark:text-[#A89F91] hover:text-[#49352F]"
              }`}
            >
              <Activity className="w-4 h-4" />
              API Usage Telemetry
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "logs"
                  ? "border-[#2E7D5E] text-[#2E7D5E]"
                  : "border-transparent text-[#7A6B63] dark:text-[#A89F91] hover:text-[#49352F]"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Error Logs
            </button>
          </div>

          <Link
            href="/docs/AI_API_SETUP.md"
            target="_blank"
            className="text-xs font-bold text-[#2E7D5E] hover:underline flex items-center gap-1.5 mb-2 sm:mb-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Setup Docs
          </Link>
        </div>

        {/* TAB 1: ALL PROVIDERS */}
        {activeTab === "providers" && (
          <div className="space-y-4">
            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs font-bold text-[#7A6B63] mr-1">Filter by Capability:</span>
              {[
                { id: "all", label: "All APIs" },
                { id: "chat", label: "Chat Models" },
                { id: "translation", label: "Translation APIs" },
                { id: "speech-to-text", label: "Speech-to-Text" },
                { id: "text-to-speech", label: "Text-to-Speech" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setCapabilityFilter(pill.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    capabilityFilter === pill.id
                      ? "bg-[#2E7D5E] text-white shadow-xs"
                      : "bg-white/80 dark:bg-[#2C2420] text-[#7A6B63] border border-[#D5CEBF] dark:border-[#4A3E38] hover:bg-[#F4F1E1]"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Provider Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProviders.map((p) => {
                const meta = PROVIDER_METAS[p.provider] || PROVIDER_METAS.openai;
                const IconComponent = meta.icon;
                const isPinging = pingingProvider === p.provider;
                const testResult = pingResults[p.provider];

                return (
                  <div
                    key={p.provider}
                    className={`rounded-2xl bg-white dark:bg-[#251D19] border ${meta.border} p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden`}
                  >
                    {/* Top Stripe with Status Badge */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${meta.badgeBg}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-base text-[#49352F] dark:text-[#EAE5D9] leading-snug">
                              {p.name}
                            </h3>
                            <span className="text-[11px] font-mono text-[#7A6B63]">
                              ID: {p.provider}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {p.configured ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Not Configured
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-[#7A6B63] dark:text-[#A89F91] leading-relaxed mb-4">
                        {p.description}
                      </p>

                      {/* Credentials Masked Value */}
                      <div className="p-3 rounded-xl bg-[#F4F1E1]/70 dark:bg-[#2C2420]/70 border border-[#D5CEBF]/60 dark:border-[#4A3E38] space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#7A6B63] flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-amber-600" />
                            API Key:
                          </span>
                          <span className="font-mono font-bold text-xs text-[#49352F] dark:text-[#EAE5D9]">
                            {p.keyPreview || "Unconfigured"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-[#7A6B63]">
                          <span>Default Model:</span>
                          <span className="font-mono font-semibold text-[#2E7D5E]">{p.defaultModel}</span>
                        </div>
                      </div>

                      {/* Supported Capabilities Badges */}
                      <div className="mb-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6B63] mb-1.5">
                          Supported Capabilities
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.supportedTasks.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#49352F]/5 dark:bg-white/5 text-[#49352F] dark:text-[#EAE5D9] border border-[#49352F]/10"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Connection Test Result Feedback */}
                      {testResult && (
                        <div
                          className={`p-3 rounded-xl text-xs mb-4 border ${
                            testResult.success
                              ? "bg-emerald-50/90 text-emerald-800 border-emerald-200"
                              : "bg-rose-50/90 text-rose-800 border-rose-200"
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5 mb-0.5">
                            {testResult.success ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            )}
                            Status: {testResult.status} ({testResult.latencyMs}ms)
                          </div>
                          <div className="text-[11px] leading-tight">{testResult.message}</div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-3 border-t border-[#D5CEBF]/60 dark:border-[#4A3E38]">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleTestPing(p.provider)}
                          disabled={isPinging}
                          className="px-3 py-2 text-xs font-bold rounded-xl bg-[#2E7D5E] text-white hover:bg-[#25684E] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          {isPinging ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <Activity className="w-3.5 h-3.5" />
                              Test Ping
                            </>
                          )}
                        </button>

                        <Link
                          href={`/admin/ai-providers/${p.provider.replace("_", "-")}`}
                          className="px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-[#2C2420] border border-[#D5CEBF] dark:border-[#4A3E38] text-[#49352F] dark:text-[#EAE5D9] hover:bg-[#F4F1E1] transition-all flex items-center justify-center gap-1.5 text-center"
                        >
                          <Settings className="w-3.5 h-3.5 text-[#2E7D5E]" />
                          Configure
                        </Link>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 px-1">
                        <button
                          onClick={() => {
                            setKeyModalProvider(p);
                            setNewApiKey("");
                          }}
                          className="text-[#2E7D5E] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Key className="w-3 h-3" />
                          Update Key
                        </button>

                        <a
                          href={p.docUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#7A6B63] hover:underline flex items-center gap-1"
                        >
                          Docs
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CAPABILITY ROUTING & FAILOVER */}
        {activeTab === "capabilities" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#251D19] rounded-2xl p-6 border border-[#D5CEBF] dark:border-[#4A3E38] shadow-xs">
              <h2 className="text-lg font-bold text-[#49352F] dark:text-[#EAE5D9] mb-1 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#2E7D5E]" />
                Task Capability Assignment & Automated Fallback
              </h2>
              <p className="text-xs text-[#7A6B63] dark:text-[#A89F91] mb-6">
                Assign primary and failover AI engines for each educational workflow. Dropdowns filter only adapters that genuinely support that task.
              </p>

              {saveNotification && (
                <div className="p-3 mb-5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {saveNotification}
                </div>
              )}

              <div className="space-y-5">
                {(Object.keys(TASK_DEFINITIONS) as AiTaskType[]).map((task) => {
                  const def = TASK_DEFINITIONS[task];
                  const Icon = def.icon;
                  const config = configs.find((c) => c.task === task) || {
                    task,
                    primaryProvider: "offline_fallback" as AiProviderName,
                    fallbackProvider: "offline_fallback" as AiProviderName,
                    enabled: true,
                  };
                  const isSavingThis = savingTask === task;

                  // Eligible providers for this specific capability
                  const eligibleProviders = providerStatuses.filter((p) =>
                    p.supportedTasks.includes(task)
                  );

                  return (
                    <div
                      key={task}
                      className="p-4 rounded-xl border border-[#D5CEBF]/70 dark:border-[#4A3E38] bg-[#F4F1E1]/40 dark:bg-[#2C2420]/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 max-w-md">
                        <div className="w-9 h-9 rounded-lg bg-[#2E7D5E]/10 text-[#2E7D5E] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#49352F] dark:text-[#EAE5D9]">
                            {def.title}
                          </h4>
                          <p className="text-xs text-[#7A6B63] dark:text-[#A89F91]">
                            {def.desc}
                          </p>
                        </div>
                      </div>

                      {/* Dropdown Selectors */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6B63] mb-1">
                            Primary Engine
                          </label>
                          <select
                            value={config.primaryProvider}
                            onChange={(e) =>
                              handleConfigChange(task, "primaryProvider", e.target.value as AiProviderName)
                            }
                            disabled={isSavingThis}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-[#251D19] border border-[#D5CEBF] dark:border-[#4A3E38] text-[#49352F] dark:text-[#EAE5D9] focus:outline-none focus:ring-1 focus:ring-[#2E7D5E]"
                          >
                            {eligibleProviders.map((p) => (
                              <option key={p.provider} value={p.provider}>
                                {p.name} {p.configured ? "✓" : "(Missing Key)"}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6B63] mb-1">
                            Failover Engine
                          </label>
                          <select
                            value={config.fallbackProvider || "offline_fallback"}
                            onChange={(e) =>
                              handleConfigChange(task, "fallbackProvider", e.target.value as AiProviderName)
                            }
                            disabled={isSavingThis}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-[#251D19] border border-[#D5CEBF] dark:border-[#4A3E38] text-[#49352F] dark:text-[#EAE5D9] focus:outline-none focus:ring-1 focus:ring-[#2E7D5E]"
                          >
                            {eligibleProviders.map((p) => (
                              <option key={p.provider} value={p.provider}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {isSavingThis && (
                          <div className="flex items-center text-xs font-semibold text-[#2E7D5E] gap-1 self-end mb-1">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Saving...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: API USAGE TELEMETRY */}
        {activeTab === "usage" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#251D19] rounded-2xl p-6 border border-[#D5CEBF] dark:border-[#4A3E38] shadow-xs">
              <h2 className="text-lg font-bold text-[#49352F] dark:text-[#EAE5D9] mb-1 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#2E7D5E]" />
                Recent API Request Log
              </h2>
              <p className="text-xs text-[#7A6B63] dark:text-[#A89F91] mb-6">
                Latency, token usage, and cost estimates logged from verified server requests.
              </p>

              {metricsSummary?.recentMetrics && metricsSummary.recentMetrics.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#D5CEBF] dark:border-[#4A3E38] text-[#7A6B63] font-bold">
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Task</th>
                        <th className="py-2.5 px-3">Provider</th>
                        <th className="py-2.5 px-3">Model</th>
                        <th className="py-2.5 px-3">Latency</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Est. Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D5CEBF]/40 dark:divide-[#4A3E38]/40">
                      {metricsSummary.recentMetrics.map((m) => (
                        <tr key={m.id} className="hover:bg-[#F4F1E1]/50 dark:hover:bg-[#2C2420]/50 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-[#7A6B63]">
                            {new Date(m.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#49352F] dark:text-[#EAE5D9]">
                            {m.task}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-xs">{m.provider}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-[#7A6B63]">{m.model}</td>
                          <td className="py-2.5 px-3 font-semibold">{m.latencyMs}ms</td>
                          <td className="py-2.5 px-3">
                            {m.success ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Success
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                Failed
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono">${(m.estimatedCostUsd || 0).toFixed(5)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-sm text-[#7A6B63]">
                  No AI request telemetry logged yet. Run a chat question or test ping to record live activity.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ERROR LOGS */}
        {activeTab === "logs" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#251D19] rounded-2xl p-6 border border-[#D5CEBF] dark:border-[#4A3E38] shadow-xs">
              <h2 className="text-lg font-bold text-[#49352F] dark:text-[#EAE5D9] mb-1 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Sanitized Error Log & Fault Isolation
              </h2>
              <p className="text-xs text-[#7A6B63] dark:text-[#A89F91] mb-6">
                All error messages are automatically scrubbed to guarantee that no private API keys, emails, or phone numbers are exposed.
              </p>

              {metricsSummary?.recentMetrics.filter((m) => !m.success || m.error).length ? (
                <div className="space-y-3">
                  {metricsSummary.recentMetrics
                    .filter((m) => !m.success || m.error)
                    .map((err) => (
                      <div
                        key={err.id}
                        className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs"
                      >
                        <div className="flex items-center justify-between text-[#7A6B63] font-mono text-[11px] mb-1">
                          <span>{err.timestamp}</span>
                          <span className="font-bold text-rose-700 uppercase">{err.provider}</span>
                        </div>
                        <div className="font-semibold text-rose-900 dark:text-rose-300">
                          {err.error || "Execution failed"}
                        </div>
                        <div className="text-[11px] text-[#7A6B63] mt-1">
                          Task: {err.task} | Model: {err.model} | Latency: {err.latencyMs}ms
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-sm text-emerald-700 font-semibold flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <span>No recent API error faults detected! System is running cleanly.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Update API Key */}
        {keyModalProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#251D19] rounded-2xl max-w-lg w-full p-6 border border-[#D5CEBF] dark:border-[#4A3E38] shadow-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#2E7D5E]" />
                  <h3 className="font-bold text-base text-[#49352F] dark:text-[#EAE5D9]">
                    Configure Key for {keyModalProvider.name}
                  </h3>
                </div>
                <button
                  onClick={() => setKeyModalProvider(null)}
                  className="text-[#7A6B63] hover:text-[#49352F] text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-[#7A6B63] dark:text-[#A89F91] leading-relaxed mb-4">
                To rotate or add credentials permanently, update your <code className="bg-slate-100 dark:bg-[#2C2420] px-1.5 py-0.5 rounded font-mono">.env.local</code> file on the server. You can also apply an in-memory key override for immediate testing below:
              </p>

              <form onSubmit={handleSaveKey} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#49352F] dark:text-[#EAE5D9] mb-1">
                    New Secret API Key:
                  </label>
                  <input
                    type="password"
                    placeholder="Enter official API key (e.g. sk-... / AIzaSy...)"
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    required
                    className="w-full text-xs font-mono p-3 rounded-xl border border-[#D5CEBF] dark:border-[#4A3E38] bg-white dark:bg-[#1C1613] text-[#49352F] dark:text-[#EAE5D9] focus:outline-none focus:ring-2 focus:ring-[#2E7D5E]"
                  />
                  <span className="text-[11px] text-[#7A6B63] block mt-1">
                    Current preview: {keyModalProvider.keyPreview || "Unconfigured"}
                  </span>
                </div>

                {keyUpdateSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Key updated successfully! Validating connection...
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setKeyModalProvider(null)}
                    className="px-4 py-2 text-xs font-bold rounded-xl text-[#7A6B63] hover:bg-[#F4F1E1] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingKey || !newApiKey.trim()}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-[#2E7D5E] text-white hover:bg-[#25684E] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isUpdatingKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Save & Test
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function Save(props: any) {
  return <Check className={props.className} />;
}

export default function AiProvidersManagementPage() {
  return (
    <React.Suspense
      fallback={
        <AppLayout>
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#2E7D5E] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#49352F] dark:text-[#EAE5D9]">
              Loading AI Provider Management Dashboard...
            </p>
          </div>
        </AppLayout>
      }
    >
      <AiProvidersManagementContent />
    </React.Suspense>
  );
}
