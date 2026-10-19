import { learningGapRepository } from "../repositories/learningGapRepository";
import { calculatePercentage } from "../../../../src/lib/engine/calculations";
import { detectLearningGap } from "../../../../src/lib/engine/gapDetection";
import { generateAiContent } from "../../../../src/lib/ai/aiProvider";
import type { LearningGap, GapAnalysisResponseData } from "../../../../packages/shared/src/types";

export interface AnalyzeGapInput {
  studentId?: string;
  studentName?: string;
  studentClass?: number;
  subject?: string;
  conceptName?: string;
  marksObtained: number;
  maximumMarks: number;
  teacherObservations?: string;
  language?: "en" | "gu";
}

export class LearningGapService {
  async getLearningGaps(studentId?: string, priority?: string, status?: string): Promise<LearningGap[]> {
    return learningGapRepository.findAll(studentId, priority, status);
  }

  async getGapsForStudent(studentId: string): Promise<LearningGap[]> {
    return learningGapRepository.findByStudentId(studentId);
  }

  async analyzeGap(input: AnalyzeGapInput): Promise<{
    analysis: GapAnalysisResponseData;
    isAiGenerated: boolean;
    provider: string;
    modelUsed: string;
    note?: string;
  }> {
    const marksObtained = Number(input.marksObtained);
    const maximumMarks = Number(input.maximumMarks);
    const calculatedPercentage = calculatePercentage(marksObtained, maximumMarks);
    const isGujarati = input.language === "gu";

    const detection = detectLearningGap(
      "temp-concept",
      input.conceptName || "Curricular Concept",
      [{ marksObtained, maximumMarks, recordedAt: new Date().toISOString() }],
      { mastery: 80, developing: 60 }
    );

    const fallbackPedagogicalData = {
      evidenceSummary: isGujarati
        ? `વિદ્યાર્થીએ ${maximumMarks} માંથી ${marksObtained} ગુણ (${calculatedPercentage}%) મેળવ્યા છે. સ્થિતિ: ${detection.masteryStatus}.`
        : `Student scored ${marksObtained} out of ${maximumMarks} (${calculatedPercentage}%). Deterministic classification: ${detection.masteryStatus}.`,
      underlyingMisconception: isGujarati
        ? "પાયાની સંકલ્પનાત્મક સમજનો અભાવ અને મૂર્ત અનુભવ વિના સીધી ગણતરી કરવાનો પ્રયાસ."
        : `Difficulty connecting conceptual understanding to formal procedures in ${input.conceptName || "this concept"}.`,
      recommendedRemedialActivities: isGujarati
        ? [
            "૧. વર્ગખંડમાં કાંકરા અથવા બીજનો ઉપયોગ કરી મૂર્ત અનુભવ આપવો.",
            "૨. ચિત્રાત્મક પદ્ધતિ દ્વારા સમાન જૂથો બનાવવાની પ્રવૃત્તિ કરાવવી.",
            "૩. સાથી વિદ્યાર્થી સાથે જોડીમાં મહાવરો કરાવવો.",
          ]
        : [
            "1. Concrete manipulation using locally available counters/tokens.",
            "2. Pictorial representation and visual number line models.",
            "3. Structured peer practice with immediate supportive feedback.",
          ],
      suggestedReassessmentMethod: isGujarati
        ? "૫ ગુણની ટૂંકી મૌખિક અને પ્રત્યક્ષ સાધનો આધારિત પુનઃમૂલ્યાંકન કસોટી."
        : "A 5-item targeted oral and manipulative-based reassessment exit ticket.",
      ethicalSafetyDisclosure: "This pedagogical diagnosis assists teachers and does not replace human professional judgement.",
    };

    const prompt = `Student Name: ${input.studentName || "Student"}
Class: ${input.studentClass || 4}
Concept: ${input.conceptName || "General Topic"}
Score: ${marksObtained}/${maximumMarks} (${calculatedPercentage}%)
Mastery Status: ${detection.masteryStatus}
Priority: ${detection.priority}
Teacher Observations: "${input.teacherObservations || "None"}"
Language: ${isGujarati ? "Gujarati" : "English"}

Provide structured evidence-based pedagogical analysis.`;

    const aiResult = await generateAiContent(
      {
        prompt,
        responseFormat: "json",
      },
      () => ({
        content: JSON.stringify(fallbackPedagogicalData),
        data: fallbackPedagogicalData,
      })
    );

    const diagnosis = aiResult.data || fallbackPedagogicalData;

    return {
      analysis: {
        studentId: input.studentId,
        studentName: input.studentName,
        conceptName: input.conceptName,
        deterministicMetrics: {
          marksObtained,
          maximumMarks,
          calculatedPercentage,
          masteryStatus: detection.masteryStatus,
          priority: detection.priority,
        },
        aiPedagogicalDiagnosis: diagnosis,
      },
      isAiGenerated: aiResult.isAiGenerated,
      provider: aiResult.provider,
      modelUsed: aiResult.modelUsed,
      note: aiResult.note,
    };
  }
}

export const learningGapService = new LearningGapService();
