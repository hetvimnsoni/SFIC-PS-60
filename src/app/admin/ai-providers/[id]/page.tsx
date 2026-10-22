"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Sparkles,
  Server,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Cpu,
  Layers,
  Languages,
  Key,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Settings,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import type { AiProviderName } from "@/lib/types";

interface ProviderDetailProps {
  params: Promise<{ id: string }>;
}

const PROVIDER_METAS: Record<string, { name: string; color: string; badgeBg: string; border: string; icon: any; docUrl: string; envVar: string }> = {
  openai: {
    name: "OpenAI",
    color: "text-emerald-700 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200",
    border: "border-emerald-200/80",
    icon: Sparkles,
    docUrl: "https://platform.openai.com/docs",
    envVar: "OPENAI_API_KEY",
  },
  gemini: {
    name: "Google Gemini",
    color: "text-indigo-700 dark:text-indigo-400",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200",
    border: "border-indigo-200/80",
    icon: Cpu,
    docUrl: "https://ai.google.dev/docs",
    envVar: "GEMINI_API_KEY",
  },
  anthropic: {
    name: "Anthropic Claude",
    color: "text-amber-700 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200",
    border: "border-amber-200/80",
    icon: Layers,
    docUrl: "https://docs.anthropic.com/",
    envVar: "ANTHROPIC_API_KEY",
  },
  "google-translate": {
    name: "Google Cloud Translation API",
    color: "text-blue-700 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200",
    border: "border-blue-200/80",
    icon: Languages,
    docUrl: "https://cloud.google.com/translate/docs",
    envVar: "GOOGLE_TRANSLATE_API_KEY",
  },
  google_translate: {
    name: "Google Cloud Translation API",
    color: "text-blue-700 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200",
    border: "border-blue-200/80",
    icon: Languages,
    docUrl: "https://cloud.google.com/translate/docs",
    envVar: "GOOGLE_TRANSLATE_API_KEY",
  },
  bhashini: {
    name: "Bhashini ULCA (Govt of India)",
    color: "text-orange-700 dark:text-orange-400",
    badgeBg: "bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border-orange-200",
    border: "border-orange-200/80",
    icon: Server,
    docUrl: "https://bhashini.gov.in/",
    envVar: "BHASHINI_API_KEY",
  },
};

function ProviderDetailContent({ params }: ProviderDetailProps) {
  // Unwrapping Next.js 16 async params with React.use
  const resolvedParams = React.use(params);
  const rawId = resolvedParams.id;
  const normalizedId = rawId === "google-translate" ? "google_translate" : rawId;

  const meta = PROVIDER_METAS[rawId] || PROVIDER_METAS[normalizedId];
  if (!meta) {
    notFound();
  }

  const IconComponent = meta.icon;
  const [providerData, setProviderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [copiedVar, setCopiedVar] = useState(false);

  const fetchProvider = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/ai-providers");
      const data = await res.json();
      if (res.ok && data.success) {
        const found = data.data.providerStatus.find(
          (p: any) => p.provider === normalizedId || p.provider === rawId
        );
        setProviderData(found);
      }
    } catch (e) {
      console.error("Failed to load provider details:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProvider();
  }, [rawId]);

  const handleTestPing = async () => {
    setIsTesting(true);
    try {
      const res = await fetch("/api/admin/ai-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_ping", provider: normalizedId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult(data.data);
      } else {
        setTestResult({
          pingSuccess: false,
          status: "Error",
          latencyMs: 0,
          message: data.error || "Connection test failed.",
        });
      }
    } catch (e: any) {
      setTestResult({
        pingSuccess: false,
        status: "Error",
        latencyMs: 0,
        message: e.message || "Network test failed.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const copySnippet = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedVar(true);
      setTimeout(() => setCopiedVar(false), 2000);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7A6B63] dark:text-[#A89F91]">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/admin/ai-providers" className="hover:underline">AI Providers</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#2E7D5E] font-bold">{meta.name}</span>
          </div>

          <Link
            href="/admin/ai-providers"
            className="text-xs font-bold text-[#7A6B63] hover:text-[#49352F] dark:hover:text-white flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to All Providers
          </Link>
        </div>

        {/* Hero Header Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#251D19] border border-[#D5CEBF] dark:border-[#4A3E38] shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${meta.badgeBg}`}>
                <IconComponent className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#49352F] dark:text-[#EAE5D9]">
                    {meta.name}
                  </h1>
                  {providerData?.configured ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      Not Configured
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7A6B63] dark:text-[#A89F91]">
                  System Provider ID: <code className="font-mono font-bold text-[#49352F] dark:text-[#EAE5D9]">{normalizedId}</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestPing}
                disabled={isTesting}
                className="px-4 py-2.5 rounded-xl bg-[#2E7D5E] text-white font-bold text-xs hover:bg-[#25684E] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testing API Connection...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4" />
                    Test Connection
                  </>
                )}
              </button>

              <a
                href={meta.docUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#2C2420] border border-[#D5CEBF] dark:border-[#4A3E38] text-xs font-bold text-[#49352F] dark:text-[#EAE5D9] hover:bg-[#F4F1E1] transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Docs
              </a>
            </div>
          </div>

          {/* Test Feedback banner */}
          {testResult && (
            <div
              className={`mt-5 p-4 rounded-2xl border text-xs ${
                testResult.pingSuccess
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              <div className="font-bold flex items-center gap-2 mb-1">
                {testResult.pingSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
                Connection Status: {testResult.status} ({testResult.latencyMs}ms)
              </div>
              <p className="text-xs leading-relaxed">{testResult.message}</p>
            </div>
          )}
        </div>

        {/* Configuration & Security Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Credential Security & Masking */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#251D19] border border-[#D5CEBF] dark:border-[#4A3E38] shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#49352F] dark:text-[#EAE5D9] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2E7D5E]" />
              Credential Management & Masking
            </h3>
            <p className="text-xs text-[#7A6B63] dark:text-[#A89F91] leading-relaxed">
              API credentials are never sent to ordinary users or client bundles. Secrets are read strictly on the server and masked before presentation.
            </p>

            <div className="p-4 rounded-2xl bg-[#F4F1E1]/70 dark:bg-[#2C2420]/70 border border-[#D5CEBF]/60 dark:border-[#4A3E38] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#7A6B63]">Masked Secret:</span>
                <span className="font-mono font-extrabold text-sm text-[#49352F] dark:text-[#EAE5D9]">
                  {providerData?.keyPreview || "•••••••••••• (Unconfigured)"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#7A6B63]">Environment Variable:</span>
                <code className="font-mono text-xs text-[#2E7D5E] font-bold">{meta.envVar}</code>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#7A6B63]">API Base Endpoint:</span>
                <span className="font-mono text-[11px] text-[#7A6B63] truncate max-w-[200px]">
                  {providerData?.baseUrl || "Official Default"}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#7A6B63] dark:text-[#A89F91] bg-amber-500/10 p-3 rounded-xl border border-amber-300/60 text-amber-900 dark:text-amber-200">
              💡 <strong>Security Notice:</strong> To rotate keys safely without touching application source code, update <code className="font-mono bg-white/60 dark:bg-black/30 px-1 py-0.5 rounded">{meta.envVar}</code> in your server environment or <code className="font-mono bg-white/60 dark:bg-black/30 px-1 py-0.5 rounded">.env.local</code>.
            </div>
          </div>

          {/* Card 2: Model & Capability Catalog */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#251D19] border border-[#D5CEBF] dark:border-[#4A3E38] shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#49352F] dark:text-[#EAE5D9] flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              Supported Models & Capabilities
            </h3>
            <p className="text-xs text-[#7A6B63] dark:text-[#A89F91] leading-relaxed">
              Capabilities verified and supported by this provider adapter.
            </p>

            <div>
              <div className="text-xs font-bold text-[#7A6B63] mb-2 uppercase tracking-wider">
                Supported Tasks
              </div>
              <div className="flex flex-wrap gap-2">
                {providerData?.supportedTasks?.map((t: string) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2E7D5E]/10 text-[#2E7D5E] border border-[#2E7D5E]/20"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-[#7A6B63] mb-2 uppercase tracking-wider">
                Available Models
              </div>
              <div className="flex flex-wrap gap-2">
                {providerData?.supportedModels?.map((m: string) => (
                  <span
                    key={m}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold ${
                      m === providerData?.defaultModel
                        ? "bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {m} {m === providerData?.defaultModel && "★ Default"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deployment Platform Secrets Configuration Guide */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#251D19] border border-[#D5CEBF] dark:border-[#4A3E38] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#49352F] dark:text-[#EAE5D9] flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#2E7D5E]" />
              Deployment Platform Environment Settings
            </h3>
            <button
              onClick={() => copySnippet(`${meta.envVar}=your_api_key_here`)}
              className="text-xs font-bold text-[#2E7D5E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedVar ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedVar ? "Copied!" : "Copy Var Name"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F4F1E1]/50 dark:bg-[#2C2420]/50 border border-[#D5CEBF]/60 dark:border-[#4A3E38]">
              <div className="font-bold text-[#49352F] dark:text-[#EAE5D9] mb-1">▲ Vercel</div>
              <p className="text-[#7A6B63] dark:text-[#A89F91] leading-relaxed">
                Project Settings &gt; Environment Variables &gt; Add <code className="font-mono text-[11px] text-[#2E7D5E] font-bold">{meta.envVar}</code> for Production &amp; Preview.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F1E1]/50 dark:bg-[#2C2420]/50 border border-[#D5CEBF]/60 dark:border-[#4A3E38]">
              <div className="font-bold text-[#49352F] dark:text-[#EAE5D9] mb-1">🚂 Render / Railway</div>
              <p className="text-[#7A6B63] dark:text-[#A89F91] leading-relaxed">
                Dashboard &gt; Environment &gt; Add Secret Key <code className="font-mono text-[11px] text-[#2E7D5E] font-bold">{meta.envVar}</code> and trigger a zero-downtime redeploy.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F1E1]/50 dark:bg-[#2C2420]/50 border border-[#D5CEBF]/60 dark:border-[#4A3E38]">
              <div className="font-bold text-[#49352F] dark:text-[#EAE5D9] mb-1">🐳 Docker &amp; Local</div>
              <p className="text-[#7A6B63] dark:text-[#A89F91] leading-relaxed">
                Add <code className="font-mono text-[11px] text-[#2E7D5E] font-bold">{meta.envVar}</code> into your <code className="font-mono text-[11px]">.env.local</code>. Never commit this file to git.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function ProviderDetailPage({ params }: ProviderDetailProps) {
  return (
    <React.Suspense
      fallback={
        <AppLayout>
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#2E7D5E] mx-auto mb-3" />
            <p className="text-sm font-bold text-[#49352F] dark:text-[#EAE5D9]">
              Loading Provider Details...
            </p>
          </div>
        </AppLayout>
      }
    >
      <ProviderDetailContent params={params} />
    </React.Suspense>
  );
}
