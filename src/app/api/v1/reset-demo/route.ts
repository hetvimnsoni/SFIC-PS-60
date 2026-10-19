import { NextResponse } from "next/server";
import { settingsRepository } from "@backend/repositories/settingsRepository";

export async function POST() {
  try {
    await settingsRepository.resetDemoData();
    return NextResponse.json({ success: true, message: "Pristine demo dataset restored." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to reset demo" }, { status: 500 });
  }
}
