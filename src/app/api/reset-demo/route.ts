import { NextResponse } from "next/server";
import { db } from "@/lib/db/database";

export async function POST() {
  try {
    db.resetToDemoData();
    return NextResponse.json({
      success: true,
      message: "Demonstration database successfully restored to pristine state.",
    });
  } catch (error) {
    console.error("API POST /api/reset-demo error:", error);
    return NextResponse.json({ success: false, error: "Failed to reset demo data" }, { status: 500 });
  }
}
