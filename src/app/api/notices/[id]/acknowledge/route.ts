import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/database";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { deliveryId, feedback } = body;

    if (!deliveryId) {
      return NextResponse.json(
        { success: false, error: "Delivery ID is required for acknowledgment." },
        { status: 400 }
      );
    }

    const updated = db.recordAcknowledgment(deliveryId, feedback);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Delivery record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Notice acknowledged successfully.",
    });
  } catch (error: any) {
    console.error("Error in POST /api/notices/[id]/acknowledge:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to acknowledge notice." },
      { status: 500 }
    );
  }
}
