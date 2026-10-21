import { NextRequest, NextResponse } from "next/server";
import { centralAi } from "@/lib/ai/centralAiService";
import { db } from "@/lib/db/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, noticeId, studentId, parentId, userRole = "parent" } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { success: false, error: "Question query is required." },
        { status: 400 }
      );
    }

    // 1. Data Isolation & Authorization
    let accessibleNotices = db.getNotices();
    let studentGrade: number | undefined = undefined;
    let studentSection: string | undefined = undefined;

    // If parent is authenticated / requested
    if (parentId) {
      const parent = db.getParentById(parentId);
      if (parent && parent.studentIds.length > 0) {
        // Parent only sees notices applicable to their students' grades or all-school
        const students = parent.studentIds
          .map((sid) => db.getStudentById(sid))
          .filter(Boolean);

        const parentGrades = students.map((s) => s!.grade);
        if (students.length > 0) {
          studentGrade = students[0]!.grade;
          studentSection = students[0]!.section;
        }

        accessibleNotices = accessibleNotices.filter(
          (n) => n.targetAudience === "all" || (n.targetClassGrade && parentGrades.includes(n.targetClassGrade))
        );
      }
    } else if (studentId) {
      const student = db.getStudentById(studentId);
      if (student) {
        studentGrade = student.grade;
        studentSection = student.section;
        accessibleNotices = accessibleNotices.filter(
          (n) => n.targetAudience === "all" || n.targetClassGrade === student.grade
        );
      }
    }

    // If a specific notice was queried, prioritize it in context
    if (noticeId) {
      const specificNotice = db.getNoticeById(noticeId);
      if (specificNotice) {
        // Place it at the very top of context
        accessibleNotices = [
          specificNotice,
          ...accessibleNotices.filter((n) => n.id !== noticeId),
        ];
      }
    }

    const result = await centralAi.askNoticeAssistant(query.trim(), {
      notices: accessibleNotices,
      userRole,
      studentGrade,
      studentSection,
    });

    // Attach cited notice titles for enriched UI cards
    const citedNotices = (result.citedNoticeIds || [])
      .map((id) => db.getNoticeById(id))
      .filter(Boolean)
      .map((n) => ({
        id: n!.id,
        title: n!.title,
        category: n!.category,
        date: n!.publishedAt || n!.createdAt,
      }));

    return NextResponse.json({
      success: true,
      ...result,
      citedNotices,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/notice-assistant:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process school notice inquiry.",
      },
      { status: 500 }
    );
  }
}
