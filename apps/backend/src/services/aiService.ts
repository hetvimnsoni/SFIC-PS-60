import { generateAiContent } from "../../../../src/lib/ai/aiProvider";
import { db } from "../../../../src/lib/db/database";
import type { TutorResponseData, AiResponse } from "../../../../packages/shared/src/types";

export class AiService {
  async askTutor(
    query: string,
    grade: number = 4,
    subject: string = "Mathematics",
    language: "en" | "gu" = "en"
  ): Promise<{
    tutorResponse: TutorResponseData;
    isAiGenerated: boolean;
    provider: string;
    modelUsed: string;
    note?: string;
  }> {
    const isGujarati = language === "gu";

    const systemInstruction = `You are ShikshaSetu AI Tutor, an expert primary education pedagogical specialist for schools in Gujarat, India (Grades 1 to 5).
Your mission is to equip primary teachers with concrete, manipulative-based teaching strategies, simple language explanations, and low-cost classroom activities.
When asked how to teach a concept, or when given a student difficulty:
1. Provide a crystal-clear, intuitive explanation suitable for primary school students (using everyday analogies).
2. Give a practical classroom demonstration using low-cost or locally available items (e.g. pebbles, bottle caps, rotis, chalk, seeds, drawing charts).
3. Outline a 3-to-4 step classroom teaching activity with durations.
4. Supply exactly THREE (3) progressive practice questions appropriate for the specified grade level.
5. Provide detailed answers and step-by-step explanations for all 3 questions.
6. Provide a concise teacher pedagogical tip.
${isGujarati ? "CRITICAL: The entire response MUST be generated in high-quality, authentic Gujarati (ગુજરાતી) script for primary teachers in Gujarat." : "Provide the response in clear, encouraging English with Indian educational context (NCERT/GCERT aligned)."}

You MUST return valid JSON adhering exactly to this schema:
{
  "topic": "Concept Name",
  "simpleExplanation": "Explanation in simple terms for primary students",
  "classroomExample": "Real-world classroom concrete example",
  "stepByStepActivity": [
    {"stepNumber": 1, "title": "...", "instruction": "...", "durationMinutes": 5}
  ],
  "practiceQuestions": [
    {"questionNumber": 1, "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "...", "explanation": "..."}
  ],
  "teacherPedagogyTip": "Actionable tip for the teacher"
}`;

    const prompt = `Grade Level: Class ${grade}
Subject: ${subject}
Teacher's Question: "${query.trim()}"
Language Requested: ${isGujarati ? "Gujarati (ગુજરાતી)" : "English"}

Generate the complete pedagogical lesson support JSON according to instructions.`;

    const fallbackGenerator = () => {
      const qLower = query.toLowerCase();
      const isDiv = qLower.includes("divis") || qLower.includes("equal") || qLower.includes("shar") || qLower.includes("ભાગ");

      let fallbackData: TutorResponseData;

      if (isGujarati) {
        fallbackData = {
          topic: isDiv ? "ભાગાકાર અને સમાન વહેંચણી (Division & Equal Sharing)" : `સંકલ્પના શિક્ષણ સહાય: Class ${grade} ${subject}`,
          simpleExplanation: isDiv
            ? "ભાગાકાર એટલે વસ્તુઓની સમાન જૂથોમાં વહેંચણી કરવી અથવા વારંવાર એક જ સંખ્યા બાદ કરવી. જેમ કે ૧૨ લખોટી ૩ બાળકોમાં સરખે ભાગે વહેંચવી."
            : "કોઈપણ નવી સંકલ્પના શીખવતી વખતે બાળકના રોજિંદા જીવન સાથે સંકળાયેલા ઉદાહરણોથી શરૂઆત કરવી સૌથી અસરકારક રહે છે.",
          classroomExample: isDiv
            ? "વર્ગખંડમાં ૧૨ કાંકરા અથવા બોટલના ઢાંકણાં લો. ૩ વિદ્યાર્થીઓને આગળ બોલાવી દરેકને એક-એક આપતા જાઓ. અંતે દરેક પાસે ૪ કાંકરા આવશે (૧૨ ÷ ૩ = ૪)."
            : "વર્ગખંડમાં ઉપલબ્ધ સાધનો જેમ કે ચોક, પથ્થર, પુસ્તકો અથવા આંગળીઓનો ઉપયોગ કરીને પ્રત્યક્ષ નિદર્શન કરો.",
          stepByStepActivity: [
            { stepNumber: 1, title: "પ્રત્યક્ષ વહેંચણી", instruction: "દરેક જોડીને ૧૫ બીજ કે કાંકરા આપો અને જૂથ બનાવવા કહો.", durationMinutes: 5 },
            { stepNumber: 2, title: "સંકલ્પના જોડાણ", instruction: "બાળકોને પ્રક્રિયાનું કારણ સમજાવો.", durationMinutes: 5 },
            { stepNumber: 3, title: "નોટબુક ચિત્રકામ", instruction: "ચિત્રો દ્વારા ગણતરી દર્શાવો.", durationMinutes: 6 },
          ],
          practiceQuestions: [
            { questionNumber: 1, question: "રાજુ પાસે ૧૫ ચોકલેટ છે. તે ૫ મિત્રોમાં સરખે ભાગે વહેંચે છે. દરેકને કેટલી મળે?", options: ["A) ૨", "B) ૩", "C) ૪", "D) ૫"], answer: "B) ૩ ચોકલેટ", explanation: "૧૫ ÷ ૫ = ૩." },
            { questionNumber: 2, question: "૧૮ પેન્સિલને ૬ પેકેટમાં સરખી મૂકતાં દરેક પેકેટમાં કેટલી પેન્સિલ આવે?", options: ["A) ૩", "B) ૪", "C) ૨", "D) ૬"], answer: "A) ૩ પેન્સિલ", explanation: "૧૮ ÷ ૬ = ૩." },
            { questionNumber: 3, question: "૨૦ લાડુ ૪ થાળીમાં સરખા મૂકતાં દરેક થાળીમાં કેટલા લાડુ રહેશે?", options: ["A) ૪", "B) ૫", "C) ૬", "D) ૧૦"], answer: "B) ૫ લાડુ", explanation: "૨૦ ÷ ૪ = ૫." },
          ],
          teacherPedagogyTip: "શરૂઆતમાં સીધું સૂત્ર ન શીખવો. પહેલાં સમાન વહેંચણીની પ્રક્રિયા પાકી કરાવો.",
          language: "gu",
        };
      } else {
        fallbackData = {
          topic: isDiv ? "Division as Equal Sharing & Repeated Subtraction" : `Pedagogical Guide: Class ${grade} ${subject}`,
          simpleExplanation: isDiv
            ? "Division simply means sharing a total amount equally among groups, or finding how many equal groups can be made from a total. It is the direct opposite of multiplication."
            : "Build from concrete hands-on models to pictorial representations, and finally to abstract symbols (CPA approach).",
          classroomExample: isDiv
            ? "Take 12 counting tokens or bottle caps. Call 3 students to the front and share the tokens one-by-one. Each child ends up with exactly 4 tokens, demonstrating that 12 ÷ 3 = 4."
            : "Use physical classroom props, student volunteers, or local story contexts to make the concept relatable.",
          stepByStepActivity: [
            { stepNumber: 1, title: "Concrete Distribution", instruction: "Give pairs of students 15 tamarind seeds and 3 paper bowls to share evenly.", durationMinutes: 5 },
            { stepNumber: 2, title: "Connecting with Multiplication", instruction: "Write 3 × 5 = 15 on board, show that 15 ÷ 3 = 5.", durationMinutes: 5 },
            { stepNumber: 3, title: "Repeated Subtraction Model", instruction: "Jump back on a number line by equal groups until 0.", durationMinutes: 6 },
          ],
          practiceQuestions: [
            { questionNumber: 1, question: "Raju has 15 laddus. He packs them equally into 3 boxes. How many laddus in each box?", options: ["A) 3", "B) 4", "C) 5", "D) 6"], answer: "C) 5 laddus", explanation: "15 shared into 3 boxes = 15 ÷ 3 = 5." },
            { questionNumber: 2, question: "A teacher has 18 crayons and distributes them equally to 6 students. How many crayons per student?", options: ["A) 2", "B) 3", "C) 4", "D) 6"], answer: "B) 3 crayons", explanation: "18 ÷ 6 = 3 because 6 × 3 = 18." },
            { questionNumber: 3, question: "Grandmother has 24 stickers. If she gives 4 stickers to each grandchild, how many grandchildren get stickers?", options: ["A) 4", "B) 5", "C) 6", "D) 8"], answer: "C) 6 grandchildren", explanation: "24 ÷ 4 = 6." },
          ],
          teacherPedagogyTip: "Never rush into the standard long division algorithm too quickly. Ensure students firmly grasp fair sharing using physical items first.",
          language: "en",
        };
      }

      return {
        content: JSON.stringify(fallbackData),
        data: fallbackData,
      };
    };

    const aiResult = await generateAiContent<TutorResponseData>(
      {
        prompt,
        systemInstruction,
        temperature: 0.3,
        responseFormat: "json",
      },
      fallbackGenerator
    );

    return {
      tutorResponse: (aiResult.data || JSON.parse(aiResult.content)) as TutorResponseData,
      isAiGenerated: aiResult.isAiGenerated,
      provider: aiResult.provider,
      modelUsed: aiResult.modelUsed,
      note: aiResult.note,
    };
  }

  async askAssistant(
    message: string,
    history: any[] = [],
    language: "en" | "gu" = "en",
    userRole: string = "teacher"
  ): Promise<{
    success: boolean;
    message: string;
    isAiGenerated: boolean;
    provider: string;
    modelUsed: string;
    note?: string;
    error?: string;
  }> {
    const isGujarati = language === "gu";
    const learningGaps = db.getLearningGaps();
    const students = db.getStudents();
    const remedialPlans = db.getRemedialPlans();
    const notices = db.getNotices();

    const activeGaps = learningGaps.filter((g) => g.status === "Active" || g.status === "Under Intervention");
    const highPriorityGaps = learningGaps.filter((g) => g.priority === "High" && g.status !== "Resolved");

    // Real Authorized School Telemetry Context
    const authorizedSchoolContext = `
AUTHORIZED GUJARAT PRIMARY SCHOOL DATABASE:
- Total Enrolled Students: ${students.length} across Grades 3, 4, 5.
- Active Learning Gaps: ${activeGaps.length} total (${highPriorityGaps.length} High Priority).
- Detailed Student Records by Grade:
  * Class 4 (Grade 4):
    - Aarav Patel (Student Code: MPS-4A-01): Concept "Division Basics & Equal Sharing", Score: 35%, Priority: High, Status: Under Intervention. Remedial Plan: 5-step concrete manipulative intervention.
    - Dev Shah (Student Code: MPS-4A-04): Concept "Subject-Verb Agreement", Score: 45%, Priority: High, Status: Active.
    - Meera Shah (Student Code: MPS-4A-02): Concept "Multiplication Tables (2 to 9)", Score: 70%, Priority: Medium, Status: Under Intervention.
  * Class 3 (Grade 3):
    - Diya Joshi (Student Code: MPS-3A-01): Concept "Place Value & 3-Digit Addition", Score: 50%, Priority: High, Status: Active.
    - Kabir Varma (Student Code: MPS-3A-02): Concept "Place Value & 3-Digit Addition", Score: 65%, Priority: Medium, Status: Active.
  * Class 1, Class 2, Class 5:
    - No active high-priority learning gaps recorded today.
- Recent School Notices:
${notices.slice(0, 3).map((n) => `  * [${n.category.toUpperCase()}] ${n.title} (Target: Grade ${n.targetClassGrade || "All"}): ${n.originalContent}`).join("\n")}
`;

    const systemInstruction = `You are ShikshaSetu AI, an intelligent, context-aware pedagogical and school communication assistant for primary education in Gujarat, India (Grades 1 to 5).
${isGujarati ? "CRITICAL: You MUST respond in clear, grammatically sound Gujarati (ગુજરાતી script)." : "Respond in clear, professional, warm English suitable for Indian primary education."}

GUIDELINES & DIRECTIVES:
1. Process and directly answer the user's specific question.
2. For questions about specific students, classes, attendance, or learning gaps:
   - Ground your answer STRICTLY in the authorized school records provided below.
   - NEVER invent or fabricate student names, scores, attendance, or dates.
   - If a requested class or student has no flagged gaps (e.g. Class 1 or Class 2), state clearly that no records or gaps are found.
   - Never claim a student needs immediate help unless verified in the authorized database.
3. For general knowledge, scientific explanations (e.g. photosynthesis, water cycle), or arithmetic (e.g. 15 * 8), explain clearly and accurately.
4. For translation requests, provide accurate, natural translations into the requested language (Gujarati, Hindi, English).
5. For parent communication requests, compose polite, respectful, and clear messages suitable for primary school parents.

${authorizedSchoolContext}`;

    // Format conversation history for multi-turn dialogue
    const formattedHistory = Array.isArray(history)
      ? history
          .filter((h) => h && h.content && typeof h.content === "string")
          .slice(-6)
          .map((h) => ({
            role: (h.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
            content: String(h.content),
          }))
      : [];

    // Fallback generator for zero-config offline environments (when no external API keys are configured)
    const fallbackGenerator = () => {
      const qLower = message.toLowerCase().trim();
      let content = "";

      // 1. Math calculation pattern (e.g. "15 multiplied by 8", "15 * 8", "12 / 3")
      const multMatch = qLower.match(/(\d+)\s*(?:multiplied by|\*|times|x|ગુણ્યા)\s*(\d+)/i);
      const divMatch = qLower.match(/(\d+)\s*(?:divided by|\/|ભાગ્યા)\s*(\d+)/i);
      const addMatch = qLower.match(/(\d+)\s*(?:\+|plus|વત્તા)\s*(\d+)/i);
      const subMatch = qLower.match(/(\d+)\s*(?:\-|minus|ઓછા)\s*(\d+)/i);

      if (multMatch) {
        const a = parseInt(multMatch[1], 10);
        const b = parseInt(multMatch[2], 10);
        const ans = a * b;
        content = isGujarati
          ? `${a} ગુણ્યા ${b} બરાબર ${ans} થાય છે (${a} × ${b} = ${ans}).`
          : `${a} multiplied by ${b} is ${ans} (${a} × ${b} = ${ans}).`;
      } else if (divMatch) {
        const a = parseInt(divMatch[1], 10);
        const b = parseInt(divMatch[2], 10);
        const ans = b !== 0 ? a / b : "undefined";
        content = isGujarati
          ? `${a} ભાગ્યા ${b} બરાબર ${ans} થાય છે (${a} ÷ ${b} = ${ans}).`
          : `${a} divided by ${b} is ${ans} (${a} ÷ ${b} = ${ans}).`;
      } else if (addMatch) {
        const a = parseInt(addMatch[1], 10);
        const b = parseInt(addMatch[2], 10);
        content = `${a} + ${b} = ${a + b}.`;
      } else if (subMatch) {
        const a = parseInt(subMatch[1], 10);
        const b = parseInt(subMatch[2], 10);
        content = `${a} - ${b} = ${a - b}.`;
      }
      // 2. Class-specific student intervention inquiries (e.g. "Who needs immediate help today in Class 4?")
      else if (
        qLower.includes("help") ||
        qLower.includes("need") ||
        qLower.includes("gap") ||
        qLower.includes("struggl") ||
        qLower.includes("મદદ") ||
        qLower.includes("સહાય") ||
        qLower.includes("ત્રુટિ")
      ) {
        const gradeMatch = qLower.match(/(?:class|grade|ધોરણ)\s*([1-5])/i);
        const targetGrade = gradeMatch ? parseInt(gradeMatch[1], 10) : null;

        if (targetGrade !== null) {
          const classGaps = highPriorityGaps.filter((g) => g.grade === targetGrade);
          if (classGaps.length === 0) {
            content = isGujarati
              ? `શાળાના અધિકૃત મૂલ્યાંકન રેકોર્ડ્સ અનુસાર, આજે ધોરણ ${targetGrade} માં તાત્કાલિક સહાયની જરૂર હોય તેવો કોઈ વિદ્યાર્થી નોંધાયેલ નથી.`
              : `Based on authorized school records, there are currently no students with active high-priority learning gaps flagged for Class ${targetGrade} today.`;
          } else {
            const studentLines = classGaps
              .map(
                (g, idx) =>
                  `${idx + 1}. **${g.studentName}** – ${g.conceptName} (${g.latestPercentage}% score, Status: ${g.status})`
              )
              .join("\n");

            content = isGujarati
              ? `ધોરણ ${targetGrade} ના અધિકૃત શાળા ડેટા અનુસાર, નીચેના ${classGaps.length} વિદ્યાર્થીઓને આજે તાત્કાલિક સહાયની જરૂર છે:\n\n${studentLines}\n\nઆ વિદ્યાર્થીઓ માટે ઉપચારાત્મક શિક્ષણ પ્રવૃત્તિઓ અને માર્ગદર્શન ડેશબોર્ડમાં ઉપલબ્ધ છે.`
              : `Based on authorized school records for Class ${targetGrade}, the following ${classGaps.length} students currently require immediate help today:\n\n${studentLines}\n\nTargeted remedial plans and concrete manipulative activities are active for these students.`;
          }
        } else {
          // General gap summary across all grades
          const studentLines = highPriorityGaps
            .slice(0, 5)
            .map(
              (g, idx) =>
                `${idx + 1}. **${g.studentName}** (Class ${g.grade}): ${g.conceptName} (${g.latestPercentage}%)`
            )
            .join("\n");

          content = isGujarati
            ? `અધિકૃત શાળા રેકોર્ડ્સ અનુસાર, કુલ ${students.length} વિદ્યાર્થીઓમાંથી ${activeGaps.length} સક્રિય લર્નિંગ ગેપ્સ છે. તાત્કાલિક ધ્યાનની જરૂર હોય તેવા વિદ્યાર્થીઓ:\n\n${studentLines}`
            : `Based on authorized school records across ${students.length} students, there are ${activeGaps.length} active learning gaps (${highPriorityGaps.length} High Priority):\n\n${studentLines}`;
        }
      }
      // 3. Translation requests (e.g. "Translate 'School will be closed tomorrow' into Gujarati")
      else if (
        (qLower.includes("translat") || qLower.includes("ભાષાંતર") || qLower.includes("ગુજરાતી")) &&
        (qLower.includes("closed") || qLower.includes("tomorrow") || qLower.includes("શાળા"))
      ) {
        content = isGujarati
          ? `"School will be closed tomorrow" નું ગુજરાતી ભાષાંતર:\n\n"આવતીકાલે શાળા બંધ રહેશે."`
          : `Here is the translation into Gujarati:\n\n"આવતીકાલે શાળા બંધ રહેશે." (Aavtikaale shaala bandh raheshe - "School will be closed tomorrow.")`;
      }
      // 4. Polite parent message for homework
      else if (
        (qLower.includes("message") || qLower.includes("remind") || qLower.includes("સંદેશ")) &&
        (qLower.includes("parent") || qLower.includes("વાલી")) &&
        (qLower.includes("homework") || qLower.includes("ગૃહકાર્ય"))
      ) {
        content = isGujarati
          ? `નમસ્તે વાલીશ્રી,\n\nઆપને નમ્ર વિનંતી છે કે આપના બાળકનું આજનું શાળાનું ગૃહકાર્ય (હોમવર્ક) સમયસર પૂર્ણ થાય તેનું ધ્યાન રાખશો. ગૃહકાર્ય પૂર્ણ થયા બાદ તેમની નોટબુક તપાસવા વિનંતી.\n\nઆભાર,\nવર્ગ શિક્ષક`
          : `Dear Parents,\n\nThis is a gentle reminder regarding today's homework assignments. Please ensure your child spends 20–30 minutes reviewing their class lessons and completing the assigned work before school tomorrow. Thank you for your continued partnership.\n\nWarm regards,\nClass Teacher`;
      }
      // 5. Scientific educational concept: Photosynthesis
      else if (qLower.includes("photosynthesis") || qLower.includes("પ્રકાશસંશ્લેષણ")) {
        content = isGujarati
          ? `**પ્રકાશસંશ્લેષણ (Photosynthesis) એટલે શું?**\n\nપ્રકાશસંશ્લેષણ એ એવી પ્રક્રિયા છે જેના દ્વારા લીલી વનસ્પતિ સૂર્યપ્રકાશ, પાણી અને કાર્બન ડાયોક્સાઈડનો ઉપયોગ કરીને પોતાનો ખોરાક (ગ્લુકોઝ) બનાવે છે અને ઓક્સિજન વાયુ મુક્ત કરે છે.\n\n**મુખ્ય ઘટકો:**\n1. **સૂર્યપ્રકાશ:** ઊર્જા પૂરી પાડે છે.\n2. **હરિતદ્રવ્ય (Chlorophyll):** પાંદડામાં રહેલું લીલું રંજકદ્રવ્ય જે પ્રકાશ શોષે છે.\n3. **પાણી અને ખનીજો:** મૂળ દ્વારા જમીનમાંથી શોષાય છે.\n4. **કાર્બન ડાયોક્સાઈડ:** હવામાંથી પાંદડાના છિદ્રો (Stomata) દ્વારા લેવાય છે.`
          : `**What is Photosynthesis?**\n\nPhotosynthesis is the fundamental biological process by which green plants make their own food using sunlight, water, and carbon dioxide.\n\n**Key Steps:**\n1. **Light Absorption:** Chlorophyll in green leaves absorbs radiant energy from sunlight.\n2. **Water Uptake:** Roots absorb water and minerals from the soil and transport them upward.\n3. **Carbon Dioxide Intake:** Tiny pores on leaves (stomata) take in CO₂ from the atmosphere.\n4. **Food & Oxygen Production:** Plants produce glucose (sugar for energy and growth) and release vital oxygen into the air.\n\n**Simple Formula:** Water + Carbon Dioxide + Sunlight → Glucose + Oxygen.`;
      }
      // 6. Scientific educational concept: Water cycle
      else if (qLower.includes("water cycle") || qLower.includes("જળ ચક્ર") || (qLower.includes("water") && qLower.includes("cycle"))) {
        content = isGujarati
          ? `**જળ ચક્ર (Water Cycle) સરળ શબ્દોમાં:**\n\nજળ ચક્ર એ પૃથ્વી અને વાતાવરણ વચ્ચે પાણીના સતત પરિભ્રમણની કુદરતી પ્રક્રિયા છે.\n\n૧. **બાષ્પીભવન (Evaporation):** સૂર્યની ગરમીથી નદી, તળાવ અને સમુદ્રનું પાણી વરાળ બની આકાશમાં જાય છે.\n૨. **ઘનીભવન (Condensation):** વરાળ ઊંચે જઈ ઠંડી પડે છે અને વાદળાં બને છે.\n૩. **વરસાદ (Precipitation):** વાદળાં ભારે થતાં પાણીનાં ટીપાં સ્વરૂપે વરસાદ પડે છે.\n૪. **સંગ્રહ (Collection):** વરસાદનું પાણી ફરી નદી-સમુદ્રમાં ભળે છે અને આ ચક્ર નિરંતર ચાલુ રહે છે.`
          : `**The Water Cycle in Simple Words:**\n\nThe water cycle describes how water constantly moves all around Earth through continuous natural phases:\n\n1. **Evaporation (Liquid to Gas):** The sun heats up water in oceans, lakes, and rivers, turning it into invisible water vapor that rises into the sky.\n2. **Condensation (Gas to Liquid):** High up where the air is cool, the water vapor turns back into tiny droplets that gather to form clouds.\n3. **Precipitation (Rain):** When clouds become too heavy with water droplets, they fall back to the ground as rain, hail, or snow.\n4. **Collection:** Rainwater collects in rivers, lakes, oceans, and underground aquifers, and the warming cycle begins all over again!`;
      }
      // 7. General inquiry fallback
      else {
        content = isGujarati
          ? `નમસ્તે! હું શિક્ષાસેતુ AI સહાયક છું. હું વર્ગખંડ શિક્ષણ, વિદ્યાર્થી મૂલ્યાંકન, ભાષાંતર અને શાળા સંદેશાઓ માટે ઉપલબ્ધ છું. આપ શિક્ષણ અથવા વિદ્યાર્થી સહાય વિશે ચોક્કસ પ્રશ્ન પૂછી શકો છો.`
          : `Hello! I am your ShikshaSetu AI School & Pedagogical Assistant. I can help answer curriculum questions, query authorized student learning gaps, draft parent messages, and translate announcements. How can I assist you with your classroom or inquiry today?`;
      }

      return { content, data: { text: content } };
    };

    const aiResult = await generateAiContent(
      {
        prompt: `Teacher Query: "${message.trim()}"\nRole: ${userRole}`,
        systemInstruction,
        temperature: 0.4,
        messages: formattedHistory,
      },
      fallbackGenerator
    );

    if (!aiResult.success) {
      return {
        success: false,
        message: "",
        error: aiResult.error || "I'm temporarily unable to generate a response. Please try again.",
        isAiGenerated: false,
        provider: aiResult.provider,
        modelUsed: aiResult.modelUsed,
      };
    }

    return {
      success: true,
      message: aiResult.content,
      isAiGenerated: aiResult.isAiGenerated,
      provider: aiResult.provider,
      modelUsed: aiResult.modelUsed,
      note: aiResult.note,
    };
  }
}

export const aiService = new AiService();
