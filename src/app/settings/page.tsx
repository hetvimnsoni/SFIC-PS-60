"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";
import {
  Settings,
  ShieldCheck,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();

  const [masteryThreshold, setMasteryThreshold] = useState<number>(80);
  const [developingThreshold, setDevelopingThreshold] = useState<number>(60);
  const [preferredLang, setPreferredLang] = useState<"en" | "gu">("en");
  const [enableAiAssist, setEnableAiAssist] = useState<boolean>(true);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reset modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setMasteryThreshold(data.settings.masteryThreshold);
          setDevelopingThreshold(data.settings.developingThreshold);
          setPreferredLang(data.settings.preferredLanguage);
          setEnableAiAssist(data.settings.enableAiAssist);
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (developingThreshold >= masteryThreshold) {
      setError("Developing threshold must be less than Mastery threshold.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          masteryThreshold: Number(masteryThreshold),
          developingThreshold: Number(developingThreshold),
          preferredLanguage: preferredLang,
          enableAiAssist,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setLanguage(preferredLang);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(data.error || "Failed to update settings");
      }
    } catch {
      setError("Network error updating settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/reset-demo", { method: "POST" });
      if (res.ok) {
        setShowResetConfirm(false);
        window.location.reload();
      }
    } catch (e) {
      console.error("Reset failed", e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Institutional Settings & Engine Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure operational gap thresholds, bilingual defaults, and child privacy protections.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Card 1: Thresholds Configuration */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Learning Gap Detection Thresholds</span>
                </CardTitle>
                <CardDescription>
                  Configure operational cutoffs for flagging student concepts into Mastery, Developing, or Needs Support categories.
                </CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                ℹ️ <strong>Note:</strong> These thresholds are configurable operational metrics for classroom prioritization, not immutable universal standards. Changing them dynamically recalculates all stored learning gaps.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mastery Cutoff (% Score)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    required
                    value={masteryThreshold}
                    onChange={(e) => setMasteryThreshold(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2 text-sm font-bold text-emerald-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Scores &ge; {masteryThreshold}% marked as &quot;Mastered&quot;
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Developing Cutoff (% Score)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="90"
                    required
                    value={developingThreshold}
                    onChange={(e) => setDevelopingThreshold(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2 text-sm font-bold text-amber-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Scores below {developingThreshold}% marked as &quot;Needs Support&quot;
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2: Language & AI Assist Preferences */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Language & System Preferences</CardTitle>
                <CardDescription>Default language and offline assistance engine</CardDescription>
              </div>
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Platform Language
                </label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as "en" | "gu")}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 outline-hidden"
                >
                  <option value="en">English (default)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recommendation Engine Mode
                </label>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-indigo-900 block">Deterministic Pedagogical Engine (Offline)</span>
                  <span className="text-[11px] text-slate-500">
                    Works 100% offline with zero paid API keys required.
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 3: Privacy & Security Statement */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <CardTitle>Child Privacy & Ethical AI Standards</CardTitle>
                  <CardDescription>Privacy-by-design policy for primary education</CardDescription>
                </div>
              </div>
            </CardHeader>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                • <strong>No Unnecessary Sensitive Data:</strong> We do not collect home addresses, phone numbers, family financial status, biometric data, or facial images.
              </p>
              <p>
                • <strong>Supportive Language:</strong> Students are never labeled with negative terms. The platform uses positive pedagogical phrasing such as &quot;Needs Support,&quot; &quot;Developing,&quot; and &quot;Ready for Next Step.&quot;
              </p>
              <p>
                • <strong>No Public Rankings:</strong> Individual student scores are confidential to the teacher and parent. Stigmatizing class rank ladders are strictly prohibited.
              </p>
              <p>
                • <strong>Offline Telemetry:</strong> All learning gaps and remedial plans run locally on the school server or device without transmitting children&apos;s records to third parties.
              </p>
            </div>
          </Card>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Settings saved! Learning gap statuses recalculated across all students.</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Database</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Reset Demo Data?</h3>
            <p className="text-xs text-slate-600 mt-2">
              This will restore the 15 demonstration students, initial assessment scores, learning gaps, and remedial plans to their original state.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={handleResetDemo}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isResetting ? "Resetting..." : "Confirm Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
