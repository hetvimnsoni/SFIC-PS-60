import { aiRouter } from "../router";
import { db } from "@/lib/db/database";
import type { ChatMessage, ChatResponse, AiProviderName } from "../types";

export interface ChatServiceOptions {
  message: string;
  history?: ChatMessage[];
  language?: "en" | "gu" | string;
  userRole?: string;
  provider?: AiProviderName;
}

export class ChatService {
  /**
   * Main conversational interaction entry point
   */
  async sendMessage(options: ChatServiceOptions): Promise<{
    success: boolean;
    message: string;
    isAiGenerated: boolean;
    provider: AiProviderName;
    modelUsed: string;
    latencyMs: number;
    note?: string;
    error?: string;
  }> {
    const isGujarati = options.language === "gu";
    const students = db.getStudents();
    const learningGaps = db.getLearningGaps();
    const notices = db.getNotices();

    const activeGaps = learningGaps.filter(
      (g) => g.status === "Active" || g.status === "Under Intervention"
    );
    const highPriorityGaps = learningGaps.filter(
      (g) => g.priority === "High" && g.status !== "Resolved"
    );

    // Verified school telemetry context (available to the AI model)
    const schoolTelemetryContext = `
AUTHORIZED GUJARAT PRIMARY SCHOOL DATABASE:
- Total Enrolled Students: ${students.length} across Grades 3, 4, 5.
- Active Learning Gaps: ${activeGaps.length} total (${highPriorityGaps.length} High Priority).
- Detailed Student Records:
  * Class 4 (Grade 4):
    - Aarav Patel (Student Code: MPS-4A-01): Concept "Division Basics & Equal Sharing", Score: 35%, Priority: High, Status: Under Intervention.
    - Dev Shah (Student Code: MPS-4A-04): Concept "Subject-Verb Agreement", Score: 45%, Priority: High, Status: Active.
    - Meera Shah (Student Code: MPS-4A-02): Concept "Multiplication Tables (2 to 9)", Score: 70%, Priority: Medium, Status: Under Intervention.
  * Class 3 (Grade 3):
    - Diya Joshi (Student Code: MPS-3A-01): Concept "Place Value & 3-Digit Addition", Score: 50%, Priority: High, Status: Active.
    - Kabir Varma (Student Code: MPS-3A-02): Concept "Place Value & 3-Digit Addition", Score: 65%, Priority: Medium, Status: Active.
  * Class 1, Class 2, Class 5:
    - No active high-priority learning gaps recorded today.
- Recent School Notices:
${notices.slice(0, 3).map((n) => `  * [${n.category.toUpperCase()}] ${n.title}: ${n.originalContent}`).join("\n")}
`;

    const systemInstruction = `You are a helpful, intelligent, general-purpose AI assistant. Answer the user's actual question accurately and clearly. You can help with programming, education, science, mathematics, writing, translation, analysis, brainstorming, and other topics. Understand the user's intent and adapt your answer to the request. Use conversation history to answer follow-up questions when relevant. Do not invent facts or claim access to information you do not have. If you do not know something, explain the limitation. For school-specific private information, use only authorized, verified data. Otherwise, answer general questions using your available knowledge.
${isGujarati ? "When addressed in Gujarati or requested to respond in Gujarati, provide fluent, natural, grammatically correct Gujarati (ગુજરાતી script)." : "Respond in clear, natural, and helpful English unless another language is requested."}

${schoolTelemetryContext}`;

    const formattedMessages: ChatMessage[] = [];

    if (Array.isArray(options.history)) {
      for (const h of options.history.slice(-8)) {
        if (h && h.content && typeof h.content === "string") {
          formattedMessages.push({
            role: h.role === "assistant" ? "assistant" : "user",
            content: h.content,
          });
        }
      }
    }

    formattedMessages.push({
      role: "user",
      content: options.message,
    });

    try {
      const response: ChatResponse = await aiRouter.generateText({
        provider: options.provider,
        task: "chat",
        messages: formattedMessages,
        systemInstruction,
        temperature: 0.7,
      });

      return {
        success: true,
        message: response.content || response.text,
        isAiGenerated: response.isAiGenerated,
        provider: response.provider,
        modelUsed: response.modelUsed,
        latencyMs: response.latencyMs,
        note: response.note,
      };
    } catch (err: any) {
      return {
        success: false,
        message: "",
        isAiGenerated: false,
        provider: options.provider || (process.env.AI_PROVIDER as any) || "gemini",
        modelUsed: "none",
        latencyMs: 0,
        error: err.message || "Failed to process chat message",
      };
    }
  }
}

export const chatService = new ChatService();
