"use client";

import React, { Suspense } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AiWorkspaceView } from "@/components/ai/AiWorkspaceView";

export default function AiWorkspacePage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading AI Workspace...</div>}>
        <AiWorkspaceView />
      </Suspense>
    </AppLayout>
  );
}
