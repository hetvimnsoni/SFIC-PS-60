import { NextResponse } from "next/server";
import { db } from "@/lib/db/database";

export async function GET() {
  try {
    const feedback = db.getFeedback();
    return NextResponse.json({ success: true, count: feedback.length, data: feedback });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve feedback" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, message } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const saved = db.saveFeedback(email.trim().toLowerCase(), message ? String(message).trim() : undefined);

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback! It has been recorded in the Gujarat school portal database.",
      data: saved,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
