import { generateAiContent } from "../../../../src/lib/ai/aiProvider";
import type { WorksheetData } from "../../../../packages/shared/src/types";

export interface GenerateWorksheetInput {
  grade?: number;
  subject?: string;
  concept?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  questionCount?: number;
  language?: "en" | "gu";
  questionType?: "mcq" | "short_answer" | "word_problem" | "mixed";
  studentName?: string;
}

export class WorksheetService {
  async generateWorksheet(input: GenerateWorksheetInput): Promise<{
    worksheet: WorksheetData;
    isAiGenerated: boolean;
    provider: string;
    modelUsed: string;
    note?: string;
  }> {
    const grade = Number(input.grade) || 4;
    const subject = input.subject || "MATH";
    const concept = input.concept || "Division Basics";
    const count = Number(input.questionCount) || 5;
    const isGujarati = input.language === "gu";

    const fallbackQuestions = isGujarati
      ? [
          { questionNumber: 1, question: "૧૫ લખોટી ૩ બાળકોમાં સરખે ભાગે વહેંચતા દરેકને કેટલી લખોટી મળે?", marks: 2, answerKey: "૫ લખોટી", stepExplanation: "૧૫ ÷ ૩ = ૫." },
          { questionNumber: 2, question: "જો ૨૪ ચોકલેટ ૪ બોક્સમાં મૂકવી હોય, તો એક બોક્સમાં કેટલી ચોકલેટ આવે?", marks: 2, answerKey: "૬ ચોકલેટ", stepExplanation: "૨૪ ÷ ૪ = ૬." },
          { questionNumber: 3, question: "૨૦ કેળા ૫ વાંદરાઓને સરખા વહેંચો. દરેકને કેટલા કેળા મળશે?", marks: 2, answerKey: "૪ કેળા", stepExplanation: "૨૦ ÷ ૫ = ૪." },
          { questionNumber: 4, question: "૧૮ ÷ ૨ = કેટલા થાય?", marks: 2, answerKey: "૯", stepExplanation: "૨ × ૯ = ૧૮ માટે જવાબ ૯." },
          { questionNumber: 5, question: "એક વર્ગમાં ૧૬ બાળકો છે. ૪-૪ ની ટુકડી બનાવતા કેટલી ટુકડીઓ બને?", marks: 2, answerKey: "૪ ટુકડી", stepExplanation: "૧૬ ÷ ૪ = ૪ ટુકડીઓ." },
        ]
      : [
          { questionNumber: 1, question: "Share 15 marbles equally among 3 children. How many does each child get?", marks: 2, answerKey: "5 marbles", stepExplanation: "15 divided by 3 equals 5." },
          { questionNumber: 2, question: "If 24 chocolates are placed equally into 4 gift boxes, how many in each box?", marks: 2, answerKey: "6 chocolates", stepExplanation: "24 ÷ 4 = 6." },
          { questionNumber: 3, question: "20 bananas are shared equally among 5 monkeys. How many does each monkey receive?", marks: 2, answerKey: "4 bananas", stepExplanation: "20 ÷ 5 = 4." },
          { questionNumber: 4, question: "Calculate: 18 ÷ 2 = ?", marks: 2, answerKey: "9", stepExplanation: "2 groups of 9 make 18, so 18 ÷ 2 = 9." },
          { questionNumber: 5, question: "A teacher has 16 students and forms teams of 4. How many teams are formed?", marks: 2, answerKey: "4 teams", stepExplanation: "16 ÷ 4 = 4 teams." },
        ];

    const fallbackData: WorksheetData = {
      title: isGujarati ? `ઉપચારાત્મક કાર્યપત્રક: ${concept}` : `Remedial Worksheet: ${concept}`,
      subject,
      grade,
      concept,
      studentName: input.studentName,
      instructions: isGujarati ? "બધા પ્રશ્નો ધ્યાનપૂર્વક વાંચો અને ગણતરી દર્શાવીને જવાબ લખો." : "Read all questions carefully and show your work for full credit.",
      totalMarks: count * 2,
      questions: fallbackQuestions.slice(0, count),
      teacherGuidelines: isGujarati ? "મૂર્ત સાધનોથી ગણતરી કરવા માટે બાળકને પ્રોત્સાહિત કરો." : "Encourage students to use manipulative counters or sketches to confirm answers.",
    };

    const prompt = `Grade: Class ${grade}
Subject: ${subject}
Concept: ${concept}
Questions: ${count}
Language: ${isGujarati ? "Gujarati" : "English"}

Generate a printable primary school worksheet with answer keys and step-by-step explanations.`;

    const aiResult = await generateAiContent<WorksheetData>(
      {
        prompt,
        responseFormat: "json",
      },
      () => ({ content: JSON.stringify(fallbackData), data: fallbackData })
    );

    return {
      worksheet: aiResult.data || fallbackData,
      isAiGenerated: aiResult.isAiGenerated,
      provider: aiResult.provider,
      modelUsed: aiResult.modelUsed,
      note: aiResult.note,
    };
  }
}

export const worksheetService = new WorksheetService();
