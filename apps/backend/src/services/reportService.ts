import { db } from "../../../../src/lib/db/database";
import type { OverviewReport } from "../../../../packages/shared/src/types";

export class ReportService {
  async getOverviewReport(grade?: number): Promise<OverviewReport> {
    let students = db.getStudents();
    let gaps = db.getLearningGaps();
    let assessments = db.getAssessments();
    let plans = db.getRemedialPlans();
    const results = db.getResults();

    if (grade) {
      students = students.filter((s) => s.grade === grade);
      const studentIds = new Set(students.map((s) => s.id));
      gaps = gaps.filter((g) => studentIds.has(g.studentId));
      plans = plans.filter((p) => studentIds.has(p.studentId));
    }

    const activeGaps = gaps.filter((g) => g.status === "Active" || g.status === "Under Intervention").length;
    const resolvedGaps = gaps.filter((g) => g.status === "Resolved").length;

    const remedialUnderIntervention = plans.filter((p) => p.status === "Approved" || p.status === "In Progress").length;
    const remedialCompleted = plans.filter((p) => p.status === "Completed").length;

    const mastered = gaps.filter((g) => g.masteryStatus === "Mastered").length;
    const developing = gaps.filter((g) => g.masteryStatus === "Developing").length;
    const needsSupport = gaps.filter((g) => g.masteryStatus === "Needs Support").length;

    const high = gaps.filter((g) => g.priority === "High" && g.status !== "Resolved").length;
    const medium = gaps.filter((g) => g.priority === "Medium" && g.status !== "Resolved").length;
    const low = gaps.filter((g) => g.priority === "Low" && g.status !== "Resolved").length;

    const subjects = db.getSubjects();
    const subjectPerformance = subjects.map((sub) => {
      const concepts = db.getConcepts(sub.id);
      const cIds = new Set(concepts.map((c) => c.id));
      const subGaps = gaps.filter((g) => cIds.has(g.conceptId));
      const subResults = results.filter((r) => cIds.has(r.conceptId));
      const avg = subResults.length > 0
        ? Math.round(subResults.reduce((acc, r) => acc + r.percentage, 0) / subResults.length)
        : 72;

      return {
        subjectCode: sub.code,
        subjectName: sub.name,
        averagePercentage: avg,
        gapsCount: subGaps.length,
      };
    });

    return {
      totalStudents: students.length,
      totalAssessments: assessments.length,
      activeGaps,
      resolvedGaps,
      remedialPlansUnderIntervention: remedialUnderIntervention,
      remedialPlansCompleted: remedialCompleted,
      masteryDistribution: {
        mastered,
        developing,
        needsSupport,
      },
      priorityBreakdown: {
        high,
        medium,
        low,
      },
      subjectPerformance,
    };
  }
}

export const reportService = new ReportService();
