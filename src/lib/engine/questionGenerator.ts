import type { ActivityQuestion, LearningActivity } from "@/lib/types";

// Randomization helper utilities
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function pickDistinct<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Indian & Gujarati cultural student names and items
const NAMES = [
  { en: "Aarav", gu: "આરવ" },
  { en: "Pooja", gu: "પૂજા" },
  { en: "Diya", gu: "દિયા" },
  { en: "Karan", gu: "કરણ" },
  { en: "Meera", gu: "મીરા" },
  { en: "Rohan", gu: "રોહન" },
  { en: "Ananya", gu: "અનન્યા" },
  { en: "Dev", gu: "દેવ" },
  { en: "Sneha", gu: "સ્નેહા" },
  { en: "Tanvi", gu: "તન્વી" },
  { en: "Hitesh", gu: "હિતેશ" },
  { en: "Bhavna", gu: "ભાવના" },
];

const ITEMS = [
  { enPlural: "laddus", enSingular: "laddu", gu: "લાડુ" },
  { enPlural: "mangoes", enSingular: "mango", gu: "કેરી" },
  { enPlural: "pencils", enSingular: "pencil", gu: "પેન્સિલ" },
  { enPlural: "kites", enSingular: "kite", gu: "પતંગ" },
  { enPlural: "marbles", enSingular: "marble", gu: "લખોટીઓ" },
  { enPlural: "chocolates", enSingular: "chocolate", gu: "ચોકલેટ" },
  { enPlural: "notebooks", enSingular: "notebook", gu: "નોટબુક" },
  { enPlural: "apples", enSingular: "apple", gu: "સફરજન" },
  { enPlural: "cricket balls", enSingular: "cricket ball", gu: "દડા" },
  { enPlural: "balloons", enSingular: "balloon", gu: "ફુગ્ગા" },
];

export interface TopicCatalogItem {
  id: string;
  conceptId: string;
  nameEn: string;
  nameGu: string;
  subjectCode: "MATH" | "GUJ" | "ENG" | "EVS";
  defaultDifficulty: "Easy" | "Medium" | "Hard";
  descriptionEn: string;
  descriptionGu: string;
}

export const TOPIC_CATALOG: TopicCatalogItem[] = [
  // Mathematics
  {
    id: "math-division",
    conceptId: "c-div-01",
    nameEn: "Division Basics & Equal Sharing",
    nameGu: "ભાગાકારની મૂળભૂત સંકલ્પના અને સરખા ભાગ",
    subjectCode: "MATH",
    defaultDifficulty: "Easy",
    descriptionEn: "Equal grouping, repeated subtraction, and division facts",
    descriptionGu: "સરખા જૂથ બનાવવા, વારંવારની બાદબાકી અને ભાગાકાર તર્ક",
  },
  {
    id: "math-multiplication",
    conceptId: "c-mult-01",
    nameEn: "Multiplication Tables (2 to 12)",
    nameGu: "ગુણાકારના ઘડિયા અને ગણતરી (૨ થી ૧૨)",
    subjectCode: "MATH",
    defaultDifficulty: "Medium",
    descriptionEn: "Multiplication tables, missing factors, and word problems",
    descriptionGu: "ઘડિયા, ખૂટતી સંખ્યાઓ અને વ્યવહારુ ગુણાકાર",
  },
  {
    id: "math-place-value",
    conceptId: "c-place-01",
    nameEn: "Place Value & 3-Digit Addition",
    nameGu: "સ્થાનકિંમત અને ૩-અંકનો સરવાળો",
    subjectCode: "MATH",
    defaultDifficulty: "Easy",
    descriptionEn: "Hundreds, Tens, Units decomposition and carry-over addition",
    descriptionGu: "એકમ, દશક, સો નું વિભાજન અને વદીવાળો સરવાળો",
  },
  {
    id: "math-fractions",
    conceptId: "c-frac-01",
    nameEn: "Fractions Introduction (Half, Quarter)",
    nameGu: "અપૂર્ણાંક પરિચય (અડધો, પા, પોણો)",
    subjectCode: "MATH",
    defaultDifficulty: "Medium",
    descriptionEn: "Visual fractions, equal parts, halves, and quarters",
    descriptionGu: "આકૃતિ આધારિત અપૂર્ણાંક, સરખા ભાગ અને સરખામણી",
  },
  {
    id: "math-word-problems",
    conceptId: "c-math-word-01",
    nameEn: "Market Arithmetic & Word Problems",
    nameGu: "બજાર વ્યવહાર અને ગાણિતિક કોયડા",
    subjectCode: "MATH",
    defaultDifficulty: "Hard",
    descriptionEn: "Rupees, change calculations, multi-step everyday arithmetic",
    descriptionGu: "રૂપિયા, હિસાબ, ખરીદ-વેચાણ અને બહુપગલીય ગણતરી",
  },

  // Gujarati
  {
    id: "guj-matras",
    conceptId: "c-guj-matra-01",
    nameEn: "Gujarati Matras & Vowel Symbols",
    nameGu: "કાનો-માત્રા અને દીર્ઘ-હ્રસ્વ સ્વર ચિહ્નો",
    subjectCode: "GUJ",
    defaultDifficulty: "Easy",
    descriptionEn: "Kana (ા), Rasva I (િ), Dirgha I (ી), Matra (ે)",
    descriptionGu: "કાનો, હ્રસ્વ ઇ, દીર્ઘ ઈ અને માત્રાના સાચા ઉચ્ચારણ-લેખન",
  },
  {
    id: "guj-conjuncts",
    conceptId: "c-guj-conj-01",
    nameEn: "Gujarati Conjuncts (Jodakshar)",
    nameGu: "જોડાક્ષર શબ્દોનું વાંચન-લેખન",
    subjectCode: "GUJ",
    defaultDifficulty: "Medium",
    descriptionEn: "Double consonants, conjunct letters, and spellings",
    descriptionGu: "સત્ય, પુસ્તક, પપ્પા જેવા જોડાક્ષરોની ઓળખ અને જોડણી",
  },
  {
    id: "guj-samanarthi",
    conceptId: "c-guj-words-01",
    nameEn: "Synonyms & Antonyms (Samanarthi - Virodhi)",
    nameGu: "સમાનાર્થી અને વિરોધી શબ્દો",
    subjectCode: "GUJ",
    defaultDifficulty: "Easy",
    descriptionEn: "Opposite words and equivalent meanings in primary Gujarati",
    descriptionGu: "પ્રાથમિક કક્ષાના સમાનાર્થી અને વિરોધી શબ્દોનું જ્ઞાન",
  },
  {
    id: "guj-vyakaran",
    conceptId: "c-guj-vyak-01",
    nameEn: "Grammar: Noun, Verb & Pronoun",
    nameGu: "ગુજરાતી વ્યાકરણ: નામ, સર્વનામ અને ક્રિયાપદ",
    subjectCode: "GUJ",
    defaultDifficulty: "Medium",
    descriptionEn: "Parts of speech, singular/plural, and sentence syntax",
    descriptionGu: "નામ, સર્વનામ, ક્રિયાપદ અને વાક્ય રચનાની ઓળખ",
  },

  // English
  {
    id: "eng-verb-agreement",
    conceptId: "c-eng-verb-01",
    nameEn: "Subject-Verb Agreement",
    nameGu: "કર્તા અને ક્રિયાપદ સુસંગતતા",
    subjectCode: "ENG",
    defaultDifficulty: "Easy",
    descriptionEn: "Singular and plural subject agreement (is/are, has/have)",
    descriptionGu: "કર્તા સાથે ક્રિયાપદનું સાચું રૂપ (is/are, walks/walk)",
  },
  {
    id: "eng-phonics",
    conceptId: "c-eng-blend-01",
    nameEn: "Phonetic Blends (ch, sh, th, wh)",
    nameGu: "ફોનેટિક સંયુક્ત અવાજો (ch, sh, th, wh)",
    subjectCode: "ENG",
    defaultDifficulty: "Easy",
    descriptionEn: "Consonant digraphs and phonetic pronunciation",
    descriptionGu: "અંગ્રેજી સંયુક્ત ઉચ્ચારણો અને શબ્દ ઓળખ",
  },
  {
    id: "eng-tenses",
    conceptId: "c-eng-tense-01",
    nameEn: "Tenses: Past, Present & Continuous",
    nameGu: "કાળ: ભૂતકાળ, વર્તમાનકાળ અને ચાલુ કાળ",
    subjectCode: "ENG",
    defaultDifficulty: "Medium",
    descriptionEn: "Regular and irregular past tense verbs (walked, went, ate)",
    descriptionGu: "ક્રિયાપદના વિવિધ કાળના સાચા રૂપો",
  },
  {
    id: "eng-vocabulary",
    conceptId: "c-eng-vocab-01",
    nameEn: "Opposites & Vocabulary Building",
    nameGu: "અંગ્રેજી વિરોધી શબ્દો અને શબ્દભંડોળ",
    subjectCode: "ENG",
    defaultDifficulty: "Easy",
    descriptionEn: "Everyday antonyms, rhyming words, and vocabulary",
    descriptionGu: "રોજિંદા વિરોધી શબ્દો અને શબ્દભંડોળ",
  },

  // EVS
  {
    id: "evs-water",
    conceptId: "c-evs-water-01",
    nameEn: "Water Cycle & Conservation",
    nameGu: "જળચક્ર અને જળસંચય",
    subjectCode: "EVS",
    defaultDifficulty: "Easy",
    descriptionEn: "Evaporation, condensation, rain, and water-saving habits",
    descriptionGu: "બાષ્પીભવન, ઘનીભવન, વરસાદ અને પાણી બચાવવાની ટેવો",
  },
  {
    id: "evs-plants",
    conceptId: "c-evs-plant-01",
    nameEn: "Parts of Plants & Their Functions",
    nameGu: "વનસ્પતિના અંગો અને તેમના કાર્યો",
    subjectCode: "EVS",
    defaultDifficulty: "Medium",
    descriptionEn: "Roots, stem, leaves, flowers, and photosynthesis basics",
    descriptionGu: "મૂળ, પ્રકાંડ, પર્ણ, પુષ્પ અને પ્રકાશસંશ્લેષણ",
  },
  {
    id: "evs-helpers",
    conceptId: "c-evs-comm-01",
    nameEn: "Community Helpers & Sanitation",
    nameGu: "આપણા સેવકો અને સ્વચ્છતા",
    subjectCode: "EVS",
    defaultDifficulty: "Easy",
    descriptionEn: "Doctors, teachers, sanitation workers, and hygiene rules",
    descriptionGu: "સમાજના સેવકો, હાથ ધોવાના નિયમો અને કચરાનું વર્ગીકરણ",
  },
  {
    id: "evs-animals",
    conceptId: "c-evs-anim-01",
    nameEn: "Animals, Birds & Their Habitats",
    nameGu: "પ્રાણીઓ, પક્ષીઓ અને તેમના રહેઠાણ",
    subjectCode: "EVS",
    defaultDifficulty: "Medium",
    descriptionEn: "Herbivores, carnivores, shelters, and food habits",
    descriptionGu: "તૃણાહારી, માંસાહારી, માળા, રહેઠાણ અને ખોરાકની ટેવો",
  },
];

// -------------------------------------------------------------
// Procedural Math Question Generator
// -------------------------------------------------------------
function generateMathQuestions(topicId: string, difficulty: "Easy" | "Medium" | "Hard", count: number): ActivityQuestion[] {
  const questions: ActivityQuestion[] = [];
  const timestamp = Date.now();

  for (let i = 0; i < count; i++) {
    const qId = `q-math-${topicId}-${difficulty.toLowerCase()}-${timestamp}-${i}-${Math.random().toString(36).substring(2, 6)}`;
    const student = pickRandom(NAMES);
    const item = pickRandom(ITEMS);

    if (topicId.includes("division") || topicId === "c-div-01") {
      if (difficulty === "Easy") {
        const divisor = pickRandom([2, 3, 4, 5]);
        const quotient = randomInt(2, 6);
        const total = divisor * quotient;
        const qKind = i % 3;

        if (qKind === 0) {
          const correct = `${quotient} ${item.enPlural}`;
          const distractors = [
            `${quotient + 1} ${item.enPlural}`,
            `${Math.max(1, quotient - 1)} ${item.enPlural}`,
            `${divisor} ${item.enPlural}`,
          ];
          const options = shuffle([correct, ...distractors]);
          questions.push({
            id: qId,
            type: "mcq",
            questionText: `If ${student.en} has ${total} ${item.enPlural} and wants to share them equally among ${divisor} friends, how many ${item.enPlural} does each friend get?`,
            questionTextGujarati: `જો ${student.gu} પાસે ${total} ${item.gu} હોય અને ${divisor} મિત્રો વચ્ચે સરખા ભાગે વહેંચવા હોય, તો દરેકને કેટલા ${item.gu} મળે?`,
            options,
            correctAnswer: correct,
            explanation: `${total} divided by ${divisor} is ${quotient} (${total} ÷ ${divisor} = ${quotient}), because ${divisor} × ${quotient} = ${total}.`,
            hint: `Think: What number multiplied by ${divisor} gives ${total}?`,
          });
        } else if (qKind === 1) {
          const correct = `${divisor} × ${quotient} = ${total}`;
          const distractors = [
            `${divisor} + ${quotient} = ${divisor + quotient}`,
            `${divisor} × ${quotient + 1} = ${divisor * (quotient + 1)}`,
            `${total} - ${divisor} = ${total - divisor}`,
          ];
          const options = shuffle([correct, ...distractors]);
          questions.push({
            id: qId,
            type: "mcq",
            questionText: `Which multiplication fact helps you solve ${total} ÷ ${divisor} = ?`,
            questionTextGujarati: `${total} ÷ ${divisor} = ? ઉકેલવા માટે કયો ગુણાકાર મદદ કરે છે?`,
            options,
            correctAnswer: correct,
            explanation: `Since ${divisor} × ${quotient} = ${total}, we know that ${total} ÷ ${divisor} = ${quotient}. Multiplication is the inverse of division!`,
            hint: `Find the multiplication equation using ${divisor} and ${total}.`,
          });
        } else {
          const correct = "True";
          questions.push({
            id: qId,
            type: "true_false",
            questionText: `True or False: ${total} ÷ ${divisor} = ${quotient} means subtracting ${divisor} from ${total} exactly ${quotient} times until reaching 0.`,
            questionTextGujarati: `સાચું કે ખોટું: ${total} ÷ ${divisor} = ${quotient} નો અર્થ એ છે કે ${total} માંથી ${divisor} ને ${quotient} વખત બાદ કરવાથી ૦ મળે છે.`,
            options: ["True", "False"],
            correctAnswer: correct,
            explanation: `Yes, division is repeated subtraction of equal groups!`,
            hint: `Think of equal sharing as repeated taking away.`,
          });
        }
      } else if (difficulty === "Medium") {
        const divisor = pickRandom([6, 7, 8, 9, 12]);
        const quotient = randomInt(4, 9);
        const total = divisor * quotient;
        const qKind = i % 3;

        if (qKind === 0) {
          const boxesNeeded = quotient;
          const correct = `${boxesNeeded} boxes`;
          const distractors = [`${boxesNeeded + 2} boxes`, `${Math.max(2, boxesNeeded - 1)} boxes`, `${divisor} boxes`];
          const options = shuffle([correct, ...distractors]);
          questions.push({
            id: qId,
            type: "mcq",
            questionText: `A school teacher has ${total} ${item.enPlural}. She packs ${divisor} ${item.enPlural} into each storage box. How many boxes does she need?`,
            questionTextGujarati: `શિક્ષક પાસે ${total} ${item.gu} છે. તેઓ દરેક બોક્સમાં ${divisor} ${item.gu} મૂકે છે. તો કુલ કેટલા બોક્સ જોઈશે?`,
            options,
            correctAnswer: correct,
            explanation: `${total} items ÷ ${divisor} items per box = ${quotient} boxes.`,
            hint: `Divide total ${item.enPlural} (${total}) by items per box (${divisor}).`,
          });
        } else if (qKind === 1) {
          const correct = String(quotient);
          const distractors = [String(quotient + 2), String(Math.max(1, quotient - 2)), String(quotient + 1)];
          const options = shuffle([correct, ...distractors]);
          questions.push({
            id: qId,
            type: "mcq",
            questionText: `What is the missing number: ___ ÷ ${divisor} = ${quotient}? Then what is ${total} ÷ ${divisor}?`,
            questionTextGujarati: `ગણતરી કરો: ${total} ÷ ${divisor} = ?`,
            options,
            correctAnswer: correct,
            explanation: `${total} ÷ ${divisor} = ${quotient}, because ${quotient} × ${divisor} = ${total}.`,
            hint: `Recall your ${divisor} times table.`,
          });
        } else {
          // Remainder question
          const remainder = randomInt(1, divisor - 1);
          const totalWithRem = total + remainder;
          const correct = `${remainder}`;
          const distractors = [`0`, `${divisor}`, `${remainder + 1}`];
          const options = shuffle([correct, ...distractors]);
          questions.push({
            id: qId,
            type: "mcq",
            questionText: `If ${totalWithRem} ${item.enPlural} are divided equally among ${divisor} children, how many ${item.enPlural} are left over (remainder)?`,
            questionTextGujarati: `જો ${totalWithRem} ${item.gu} ને ${divisor} બાળકો વચ્ચે સરખા ભાગે વહેંચવામાં આવે, તો કેટલી શેષ (બાકી) વધશે?`,
            options,
            correctAnswer: correct,
            explanation: `${totalWithRem} = (${divisor} × ${quotient}) + ${remainder}. So ${quotient} items to each child, with ${remainder} left over!`,
            hint: `Find the largest multiple of ${divisor} less than ${totalWithRem}, then subtract.`,
          });
        }
      } else {
        // Hard difficulty
        const divisor = pickRandom([12, 14, 15, 16, 20]);
        const quotient = randomInt(8, 15);
        const total = divisor * quotient;
        const pricePerUnit = randomInt(5, 10);
        const qKind = i % 2;

        if (qKind === 0) {
          const boxes = quotient;
          const totalEarned = boxes * pricePerUnit;
          const correct = `₹${totalEarned}`;
          const distractors = [`₹${totalEarned + 50}`, `₹${Math.max(10, totalEarned - 40)}`, `₹${boxes * 15}`];
          const options = shuffle([correct, ...distractors]);
          questions.push({
            id: qId,
            type: "mcq",
            questionText: `A farmer packs ${total} ${item.enPlural} into boxes of ${divisor} each. He sells each box for ₹${pricePerUnit}. How much total money does he earn?`,
            questionTextGujarati: `એક ખેડૂત ${total} ${item.gu} ને દરેક બોક્સમાં ${divisor} મુજબ પેક કરે છે. તે દરેક બોક્સ ₹${pricePerUnit} માં વેચે છે. તો તેને કુલ કેટલા રૂપિયા મળશે?`,
            options,
            correctAnswer: correct,
            explanation: `Step 1: ${total} ÷ ${divisor} = ${boxes} boxes. Step 2: ${boxes} boxes × ₹${pricePerUnit} = ₹${totalEarned}.`,
            hint: `First find the number of boxes by dividing, then multiply by price per box.`,
          });
        } else {
          const a = randomInt(40, 90);
          const d1 = pickRandom([2, 5, 10]);
          const divPart = Math.floor(a / d1) * d1; // ensure divisible
          const b = randomInt(4, 9);
          const c = randomInt(3, 8);
          const result = (divPart / d1) + (b * c);
          const correct = String(result);
          const distractors = [String(result + 10), String(Math.max(5, result - 8)), String(result + 4)];
          const options = shuffle([correct, ...distractors]);
          questions.push({
            id: qId,
            type: "mcq",
            questionText: `Solve the two-step expression: (${divPart} ÷ ${d1}) + (${b} × ${c}) = ?`,
            questionTextGujarati: `દાખલો ગણો: (${divPart} ÷ ${d1}) + (${b} × ${c}) = ?`,
            options,
            correctAnswer: correct,
            explanation: `First calculate ${divPart} ÷ ${d1} = ${divPart / d1}. Then calculate ${b} × ${c} = ${b * c}. Add them: ${divPart / d1} + ${b * c} = ${result}.`,
            hint: `Use order of operations: solve inside parentheses first!`,
          });
        }
      }
    } else if (topicId.includes("multiplication") || topicId === "c-mult-01") {
      if (difficulty === "Easy") {
        const factor1 = randomInt(2, 5);
        const factor2 = randomInt(3, 9);
        const product = factor1 * factor2;
        const correct = String(product);
        const distractors = [String(product + factor1), String(Math.max(1, product - factor1)), String(product + 4)];
        const options = shuffle([correct, ...distractors]);
        questions.push({
          id: qId,
          type: "mcq",
          questionText: `What is ${factor1} × ${factor2}?`,
          questionTextGujarati: `${factor1} × ${factor2} કેટલા થાય?`,
          options,
          correctAnswer: correct,
          explanation: `${factor1} times ${factor2} is equal to ${product} (${factor1} × ${factor2} = ${product}).`,
          hint: `Think: adding ${factor2} together ${factor1} times.`,
        });
      } else if (difficulty === "Medium") {
        const factor1 = randomInt(6, 9);
        const factor2 = randomInt(6, 9);
        const product = factor1 * factor2;
        const qKind = i % 2;
        if (qKind === 0) {
          const correct = String(product);
          const distractors = [String(product + factor1), String(product - factor2), String(product + 3)];
          const options = shuffle([correct, ...distractors]);
          questions.push({
            id: qId,
            type: "mcq",
            questionText: `Calculate: ${factor1} × ${factor2} = ?`,
            questionTextGujarati: `ગુણાકાર કરો: ${factor1} × ${factor2} = ?`,
            options,
            correctAnswer: correct,
            explanation: `${factor1} × ${factor2} = ${product}.`,
            hint: `Recall the ${factor1} table: ${factor1} × ${factor2}.`,
          });
        } else {
          const correct = String(factor2);
          const distractors = [String(factor2 + 1), String(factor2 - 1), String(factor2 + 2)];
          const options = shuffle([correct, ...distractors]);
          questions.push({
            id: qId,
            type: "mcq",
            questionText: `Find the missing factor: ${factor1} × ___ = ${product}`,
            questionTextGujarati: `ખૂટતી સંખ્યા શોધો: ${factor1} × ___ = ${product}`,
            options,
            correctAnswer: correct,
            explanation: `${product} ÷ ${factor1} = ${factor2}, so ${factor1} × ${factor2} = ${product}.`,
            hint: `Divide ${product} by ${factor1}.`,
          });
        }
      } else {
        // Hard multiplication
        const factor1 = randomInt(12, 19);
        const factor2 = randomInt(6, 9);
        const product = factor1 * factor2;
        const correct = String(product);
        const distractors = [String(product + 10), String(product - 10), String(product + 4)];
        const options = shuffle([correct, ...distractors]);
        questions.push({
          id: qId,
          type: "mcq",
          questionText: `A packet contains ${factor1} ${item.enPlural}. How many total ${item.enPlural} are in ${factor2} such packets?`,
          questionTextGujarati: `એક પેકેટમાં ${factor1} ${item.gu} છે. તેવા ${factor2} પેકેટમાં કુલ કેટલા ${item.gu} હોય?`,
          options,
          correctAnswer: correct,
          explanation: `${factor1} × ${factor2} = ${product}. (Break it down: 10 × ${factor2} = ${10 * factor2}, and ${factor1 - 10} × ${factor2} = ${(factor1 - 10) * factor2}. Sum = ${product}!)`,
          hint: `Multiply ${factor1} by ${factor2}. Break into (10 + ${factor1 - 10}) × ${factor2}.`,
        });
      }
    } else if (topicId.includes("place") || topicId === "c-place-01") {
      if (difficulty === "Easy") {
        const hundreds = randomInt(2, 8);
        const tens = randomInt(1, 9);
        const ones = randomInt(1, 9);
        const num = hundreds * 100 + tens * 10 + ones;
        const correct = `${tens * 10}`;
        const distractors = [`${tens}`, `${hundreds * 100}`, `${ones}`];
        const options = shuffle([correct, ...distractors]);
        questions.push({
          id: qId,
          type: "mcq",
          questionText: `In the 3-digit number ${num}, what is the place value of the digit ${tens}?`,
          questionTextGujarati: `સંખ્યા ${num} માં અંક ${tens} ની સ્થાનકિંમત કેટલી છે?`,
          options,
          correctAnswer: correct,
          explanation: `The digit ${tens} is in the Tens place, so its place value is ${tens} × 10 = ${tens * 10}.`,
          hint: `Tens place is the middle digit in a 3-digit number.`,
        });
      } else if (difficulty === "Medium") {
        const a = randomInt(150, 480);
        const b = randomInt(120, 390);
        const sum = a + b;
        const correct = String(sum);
        const distractors = [String(sum + 10), String(sum - 10), String(sum + 100)];
        const options = shuffle([correct, ...distractors]);
        questions.push({
          id: qId,
          type: "mcq",
          questionText: `Add with regrouping: ${a} + ${b} = ?`,
          questionTextGujarati: `સરવાળો કરો: ${a} + ${b} = ?`,
          options,
          correctAnswer: correct,
          explanation: `${a} + ${b} = ${sum}. Add ones, then tens with carry, then hundreds.`,
          hint: `Add column by column starting from the units place.`,
        });
      } else {
        const a = randomInt(500, 850);
        const b = randomInt(180, 450);
        const diff = a - b;
        const correct = String(diff);
        const distractors = [String(diff + 10), String(diff - 10), String(diff + 20)];
        const options = shuffle([correct, ...distractors]);
        questions.push({
          id: qId,
          type: "mcq",
          questionText: `Subtract with borrowing: ${a} - ${b} = ?`,
          questionTextGujarati: `દસકાવાળી બાદબાકી કરો: ${a} - ${b} = ?`,
          options,
          correctAnswer: correct,
          explanation: `${a} - ${b} = ${diff}.`,
          hint: `Borrow from the tens or hundreds column when the top digit is smaller.`,
        });
      }
    } else if (topicId.includes("fraction") || topicId === "c-frac-01") {
      if (difficulty === "Easy") {
        const fractions = [
          {
            textEn: "A circular roti is cut into 2 equal parts. What fraction does 1 part represent?",
            textGu: "એક ગોળ રોટલીના ૨ સરખા ભાગ કરવામાં આવે છે. તો ૧ ભાગ કયો અપૂર્ણાંક દર્શાવે છે?",
            correct: "1/2 (Half)",
            distractors: ["1/4 (Quarter)", "2/1", "3/4"],
            exp: "1 part out of 2 equal parts is 1/2 (one half).",
            hint: "Denominator is total equal parts (2).",
          },
          {
            textEn: "A square paper is folded into 4 equal quarters. If you shade 1 part, what fraction is shaded?",
            textGu: "એક ચોરસ કાગળના ૪ સરખા ભાગ છે. તેમાંથી ૧ ભાગમાં રંગ પૂરેલો છે, તો કયો અપૂર્ણાંક બનશે?",
            correct: "1/4 (One-fourth)",
            distractors: ["1/2", "3/4", "4/1"],
            exp: "1 shaded part out of 4 total parts = 1/4.",
            hint: "1 out of 4 is one-fourth.",
          },
          {
            textEn: "Which fraction represents three parts out of four equal parts?",
            textGu: "૪ સરખા ભાગમાંથી ૩ ભાગ કયો અપૂર્ણાંક દર્શાવે છે?",
            correct: "3/4 (Three-quarters)",
            distractors: ["1/4", "1/3", "4/3"],
            exp: "3 parts out of 4 equal parts is 3/4.",
            hint: "Numerator is 3, denominator is 4.",
          },
        ];
        const selected = pickRandom(fractions);
        questions.push({
          id: qId,
          type: "mcq",
          questionText: selected.textEn,
          questionTextGujarati: selected.textGu,
          options: shuffle([selected.correct, ...selected.distractors]),
          correctAnswer: selected.correct,
          explanation: selected.exp,
          hint: selected.hint,
        });
      } else if (difficulty === "Medium") {
        const equivs = [
          {
            textEn: "Which fraction is equivalent (equal) to 1/2?",
            textGu: "૧/૨ (અડધા) ની સમાન કિંમત ધરાવતો અપૂર્ણાંક કયો છે?",
            correct: "2/4",
            distractors: ["1/4", "3/4", "2/5"],
            exp: "2/4 reduces to 1/2 when numerator and denominator are divided by 2.",
            hint: "Multiply numerator and denominator of 1/2 by 2.",
          },
          {
            textEn: "What is 1/4 + 2/4?",
            textGu: "૧/૪ + ૨/૪ નો સરવાળો કેટલો થાય?",
            correct: "3/4",
            distractors: ["3/8", "2/4", "1/2"],
            exp: "When denominators are identical, add numerators: (1 + 2) / 4 = 3/4.",
            hint: "Keep the bottom denominator 4, add the top numbers.",
          },
        ];
        const selected = pickRandom(equivs);
        questions.push({
          id: qId,
          type: "mcq",
          questionText: selected.textEn,
          questionTextGujarati: selected.textGu,
          options: shuffle([selected.correct, ...selected.distractors]),
          correctAnswer: selected.correct,
          explanation: selected.exp,
          hint: selected.hint,
        });
      } else {
        const totalItems = pickRandom([20, 24, 32, 36, 40]);
        const fractionNum = pickRandom([1, 3]);
        const fractionDenom = 4;
        const answer = (totalItems / fractionDenom) * fractionNum;
        const correct = `${answer} ${item.enPlural}`;
        const distractors = [`${answer + 4} ${item.enPlural}`, `${Math.max(2, answer - 4)} ${item.enPlural}`, `${answer * 2} ${item.enPlural}`];
        questions.push({
          id: qId,
          type: "mcq",
          questionText: `What is ${fractionNum}/${fractionDenom} of ${totalItems} ${item.enPlural}?`,
          questionTextGujarati: `${totalItems} ${item.gu} નો ${fractionNum}/${fractionDenom} ભાગ કેટલો થાય?`,
          options: shuffle([correct, ...distractors]),
          correctAnswer: correct,
          explanation: `Step 1: ${totalItems} ÷ ${fractionDenom} = ${totalItems / fractionDenom}. Step 2: multiply by ${fractionNum} = ${answer}.`,
          hint: `First find 1/4 by dividing by 4, then multiply by ${fractionNum}.`,
        });
      }
    } else {
      // Default arithmetic word problem
      const a = randomInt(15, 50);
      const b = randomInt(10, 30);
      const total = a + b;
      const correct = `${total} ${item.enPlural}`;
      const distractors = [`${total + 5} ${item.enPlural}`, `${total - 5} ${item.enPlural}`, `${a} ${item.enPlural}`];
      questions.push({
        id: qId,
        type: "mcq",
        questionText: `${student.en} has ${a} ${item.enPlural}. Her friend gives her ${b} more ${item.enPlural}. How many does she have now?`,
        questionTextGujarati: `${student.gu} પાસે ${a} ${item.gu} છે. તેણીની બહેનપણી વધુ ${b} ${item.gu} આપે છે. તો તેની પાસે કુલ કેટલા ${item.gu} થશે?`,
        options: shuffle([correct, ...distractors]),
        correctAnswer: correct,
        explanation: `${a} + ${b} = ${total}.`,
        hint: `Add both numbers together.`,
      });
    }
  }

  return questions;
}

// -------------------------------------------------------------
// Procedural Gujarati Question Generator
// -------------------------------------------------------------
function generateGujaratiQuestions(topicId: string, difficulty: "Easy" | "Medium" | "Hard", count: number): ActivityQuestion[] {
  const questions: ActivityQuestion[] = [];
  const timestamp = Date.now();

  const EASY_MATRA_ITEMS = [
    {
      qEn: "Which of the following words correctly uses the 'Kana' (ા) vowel sign?",
      qGu: "નીચેનામાંથી કયો શબ્દ 'કાનો' (ા) ની માત્રા ધરાવે છે?",
      correct: "કાતર (Scissors)",
      distractors: ["દીવડો", "દૂધ", "કેળ"],
      exp: "ક + ા = કા, તેથી 'કાતર' શબ્દમાં કાનો (ા) લાગેલો છે.",
      hint: "અક્ષર પછી ઊભી લીટી (ા) જુઓ.",
    },
    {
      qEn: "Choose the word with the correct spelling using Dirgha I (ી):",
      qGu: "દીર્ઘ ઈ (ી) ની માત્રાવાળો સાચો શબ્દ પસંદ કરો:",
      correct: "દીવડો",
      distractors: ["દિવડો", "દિવાડો", "દેવડો"],
      exp: "દીવડો શબ્દમાં 'દ' ને દીર્ઘ ઈ (ી) ની માત્રા લાગે છે.",
      hint: "દીર્ઘ ઈ નું ચિહ્ન (ી) છે.",
    },
    {
      qEn: "In the word 'સૂર્ય' (Sun), which vowel matra is attached to 'સ'?",
      qGu: "'સૂર્ય' શબ્દમાં 'સ' ને કઈ માત્રા લાગેલી છે?",
      correct: "દીર્ઘ ઊ (ૂ)",
      distractors: ["હ્રસ્વ ઉ (ુ)", "કાનો (ા)", "એક માત્ર (ે)"],
      exp: "સૂર્ય શબ્દમાં સ + ૂ = સૂ (દીર્ઘ ઊ) થાય છે.",
      hint: "અક્ષરની નીચે વાળેલું ચિહ્ન (ૂ) જુઓ.",
    },
    {
      qEn: "Which word has the 'Rasva I' (િ) vowel sign?",
      qGu: "'હ્રસ્વ ઇ' (િ) માત્રા ધરાવતો શબ્દ કયો છે?",
      correct: "કવિતા",
      distractors: ["તીર", "ગાય", "મોર"],
      exp: "'કવિતા' શબ્દમાં 'વ' ને હ્રસ્વ ઇ (િ) લાગેલી છે.",
      hint: "અક્ષરની ડાબી બાજુથી લાગતું ચિહ્ન (િ) છે.",
    },
    {
      qEn: "What vowel mark is attached to 'મ' in the word 'મોર'?",
      qGu: "'મોર' શબ્દમાં 'મ' ને કઈ માત્રા લાગેલી છે?",
      correct: "કાનો અને માત્ર (ો)",
      distractors: ["માત્ર (ે)", "કાનો (ા)", "દીર્ઘ ઈ (ી)"],
      exp: "મ + ો = મો, તેથી 'મોર' બને છે.",
      hint: "ઓ નો ઉચ્ચાર ધરાવતી માત્રા (ો) છે.",
    },
  ];

  const MEDIUM_MATRA_CONJUNCT_ITEMS = [
    {
      qEn: "Identify the conjunct (Jodakshar) word among the following:",
      qGu: "નીચેનામાંથી જોડાક્ષર શબ્દ કયો છે?",
      correct: "પુસ્તક (Book)",
      distractors: ["સરળ", "કાગળ", "રમકડું"],
      exp: "'પુસ્તક' શબ્દમાં સ્ + ત જોડાઈને 'સ્ત' બને છે, જે જોડાક્ષર છે.",
      hint: "બે અક્ષરો જોડાયેલા હોય તેવો શબ્દ શોધો.",
    },
    {
      qEn: "Which two consonants combine to form the conjunct letter 'ક્ષ'?",
      qGu: "'ક્ષ' અક્ષર કયા બે વ્યંજનોના જોડાણથી બને છે?",
      correct: "ક્ + ષ",
      distractors: ["ક્ + સ", "ખ્ + સ", "શ્ + ર"],
      exp: "ક્ + ષ = ક્ષ (જેમ કે ક્ષત્રિય, પક્ષી).",
      hint: "ક અને ષ નું મિશ્રણ યાદ કરો.",
    },
    {
      qEn: "Which two consonants combine to form 'જ્ઞ'?",
      qGu: "'જ્ઞ' અક્ષર કયા બે વ્યંજનોના જોડાણથી બને છે?",
      correct: "જ્ + ઞ",
      distractors: ["ગ્ + ઞ", "જ્ + ય", "ધ્ + ય"],
      exp: "જ્ + ઞ = જ્ઞ (જેમ કે જ્ઞાન, યજ્ઞ).",
      hint: "જ વર્ગનો નાસિક્ય અક્ષર ઞ છે.",
    },
    {
      qEn: "Find the correctly spelled conjunct word:",
      qGu: "સાચી જોડણીવાળો જોડાક્ષર શબ્દ પસંદ કરો:",
      correct: "ઉત્સવ",
      distractors: ["ઉતસવ", "ઉસતવ", "ઉત્ત્વ"],
      exp: "'ઉત્સવ' સાચી જોડણી છે (ત્ + સ = ત્સ).",
      hint: "ત અને સ ના જોડાણવાળો શબ્દ.",
    },
  ];

  const HARD_GUJ_ITEMS = [
    {
      qEn: "Choose the word where both Hrasva (short) and Dirgha (long) vowels are correctly used:",
      qGu: "હ્રસ્વ અને દીર્ઘ બંને સ્વરોનો સાચો ઉપયોગ ધરાવતો શબ્દ કયો છે?",
      correct: "નિરીક્ષણ",
      distractors: ["નીરીક્ષણ", "નિરિક્ષણ", "નીરિક્ષણ"],
      exp: "'નિરીક્ષણ' શબ્દમાં 'ન' ને હ્રસ્વ ઇ (િ) અને 'ર' ને દીર્ઘ ઈ (ી) લાગે છે.",
      hint: "પહેલો હ્રસ્વ (િ) અને બીજો દીર્ઘ (ી) હોય.",
    },
    {
      qEn: "What is the difference between 'દિન' and 'દીન' in Gujarati?",
      qGu: "ગુજરાતીમાં 'દિન' અને 'દીન' શબ્દોનો અર્થભેદ શું છે?",
      correct: "દિન = દિવસ, દીન = ગરીબ",
      distractors: ["દિન = ગરીબ, દીન = દિવસ", "બંનેનો અર્થ દિવસ થાય", "દિન = રાત, દીન = સવાર"],
      exp: "હ્રસ્વ 'દિન' એટલે દિવસ (Day), જ્યારે દીર્ઘ 'દીન' એટલે ગરીબ કે લાચાર (Poor).",
      hint: "દીર્ઘ 'દીન' દુઃખીયા માટે વપરાય છે.",
    },
    {
      qEn: "Which word represents the correct conjunct spelling of 'Blessing'?",
      qGu: "'આશીર્વાદ' શબ્દની સાચી જોડણી કઈ છે?",
      correct: "આશીર્વાદ",
      distractors: ["આશિર્વાદ", "આશિરવાદ", "આશીરવાદ"],
      exp: "આશીર્વાદ શબ્દમાં 'શ' દીર્ઘ (ી) હોય છે અને 'વ' પર રેફ (ર્) લાગે છે.",
      hint: "શ ને દીર્ઘ ઈ અને વ પર રેફ લાગે છે.",
    },
    {
      qEn: "Identify the correct feminine form of 'વિદ્વાન' (Scholar):",
      qGu: "'વિદ્વાન' શબ્દનું સ્ત્રીલિંગ રૂપ શું થાય?",
      correct: "વિદુષી",
      distractors: ["વિદ્વાની", "વિદ્વાન સ્ત્રી", "વિદ્યાવાન"],
      exp: "વિદ્વાન પુરુષ માટે વપરાય, સ્ત્રી માટે 'વિદુષી' વપરાય છે.",
      hint: "વિદ્યાવાન સ્ત્રી માટે વિદુષી શબ્દ વપરાય છે.",
    },
  ];

  const SAMANARTHI_ITEMS = [
    {
      qEn: "What is the synonym (Samanarthi) of 'સૂર્ય' (Sun)?",
      qGu: "'સૂર્ય' શબ્દનો સમાનાર્થી શબ્દ કયો છે?",
      correct: "રવિ",
      distractors: ["ચંદ્ર", "તારા", "પવન"],
      exp: "સૂર્ય, રવિ, ભાસ્કર, દિનકર બધા એક જ અર્થ દર્શાવે છે.",
      hint: "સૂરજ માટે વપરાતો અન્ય જાણીતો શબ્દ.",
    },
    {
      qEn: "What is the opposite (Virodhi) of 'સુગંધ' (Fragrance)?",
      qGu: "'સુગંધ' શબ્દનો વિરોધી શબ્દ કયો છે?",
      correct: "દુર્ગંધ",
      distractors: ["ખુશબૂ", "મીઠાસ", "પવન"],
      exp: "સુગંધ એટલે સારી ગંધ, તેનો વિરોધી દુર્ગંધ એટલે ખરાબ ગંધ થાય.",
      hint: "'દુર' ઉપસર્ગ લગાવો.",
    },
    {
      qEn: "What is the synonym of 'પાણી' (Water)?",
      qGu: "'પાણી' શબ્દનો સમાનાર્થી શબ્દ કયો છે?",
      correct: "જળ (નીર)",
      distractors: ["અગ્નિ", "વાયુ", "ધરતી"],
      exp: "પાણીને જળ, નીર, વારિ પણ કહેવાય છે.",
      hint: "પીવા માટે જે વપરાય છે તે.",
    },
    {
      qEn: "What is the opposite of 'આકાશ' (Sky)?",
      qGu: "'આકાશ' શબ્દનો વિરોધી શબ્દ કયો છે?",
      correct: "ધરતી (પાતાળ)",
      distractors: ["ગગન", "વાદળ", "સૂર્ય"],
      exp: "આકાશનો વિરોધી ધરતી થાય (ગગન તો તેનો સમાનાર્થી છે).",
      hint: "આકાશ ઉપર હોય તો નીચે શું હોય?",
    },
  ];

  let pool: any[] = [];
  if (topicId.includes("samanarthi") || topicId === "c-guj-words-01") {
    pool = SAMANARTHI_ITEMS;
  } else if (difficulty === "Easy") {
    pool = EASY_MATRA_ITEMS;
  } else if (difficulty === "Medium") {
    pool = [...MEDIUM_MATRA_CONJUNCT_ITEMS, ...EASY_MATRA_ITEMS];
  } else {
    pool = [...HARD_GUJ_ITEMS, ...MEDIUM_MATRA_CONJUNCT_ITEMS];
  }

  const selectedPool = pickDistinct(pool, count);
  selectedPool.forEach((item, idx) => {
    const qId = `q-guj-${topicId}-${difficulty.toLowerCase()}-${timestamp}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
    questions.push({
      id: qId,
      type: "mcq",
      questionText: item.qEn,
      questionTextGujarati: item.qGu,
      options: shuffle([item.correct, ...item.distractors]),
      correctAnswer: item.correct,
      explanation: item.exp,
      hint: item.hint,
    });
  });

  return questions;
}

// -------------------------------------------------------------
// Procedural English Question Generator
// -------------------------------------------------------------
function generateEnglishQuestions(topicId: string, difficulty: "Easy" | "Medium" | "Hard", count: number): ActivityQuestion[] {
  const questions: ActivityQuestion[] = [];
  const timestamp = Date.now();

  const SUBJECT_VERB_EASY = [
    {
      qEn: "Choose the correct verb: The students _____ reading stories in the library.",
      qGu: "યોગ્ય ક્રિયાપદ પસંદ કરો: The students _____ reading stories in the library.",
      correct: "are",
      distractors: ["is", "am", "was"],
      exp: "'Students' is plural, so we use 'are' for plural present tense.",
      hint: "Is 'students' one person or more than one?",
    },
    {
      qEn: "Fill in the blank: The sun _____ brightly in the morning sky.",
      qGu: "ખાલી જગ્યા પૂરો: The sun _____ brightly in the morning sky.",
      correct: "shines",
      distractors: ["shine", "shining", "shined"],
      exp: "Third-person singular 'The sun' takes the verb form ending with -s ('shines').",
      hint: "'Sun' is singular (one).",
    },
    {
      qEn: "Choose the correct sentence:",
      qGu: "સાચું વાક્ય પસંદ કરો:",
      correct: "Birds build nests in trees.",
      distractors: ["Birds builds nests in trees.", "Birds building nests in trees.", "Birds is build nests."],
      exp: "Plural subject 'Birds' takes the base verb 'build' without -s.",
      hint: "With plural subjects, do not add -s to the verb.",
    },
    {
      qEn: "Select the correct word: Pooja and Diya _____ best friends.",
      qGu: "સાચો વિકલ્પ પસંદ કરો: Pooja and Diya _____ best friends.",
      correct: "are",
      distractors: ["is", "am", "was"],
      exp: "'Pooja and Diya' are two people (plural), so we use 'are'.",
      hint: "Two people together make a plural subject.",
    },
    {
      qEn: "Which pronoun correctly replaces 'The peacock' in a sentence?",
      qGu: "'The peacock' ની જગ્યાએ કયું સર્વનામ વપરાય?",
      correct: "It",
      distractors: ["He", "They", "We"],
      exp: "'It' is used for animals, birds, and non-living things in singular.",
      hint: "For birds and animals, we use 'It'.",
    },
  ];

  const SUBJECT_VERB_MEDIUM = [
    {
      qEn: "Complete the sentence: Every morning, Rohan _____ his bicycle to school.",
      qGu: "વાક્ય પૂર્ણ કરો: Every morning, Rohan _____ his bicycle to school.",
      correct: "rides",
      distractors: ["ride", "riding", "is ride"],
      exp: "Singular third person (Rohan) takes -s: 'rides'.",
      hint: "Rohan is singular, so add -s to the verb.",
    },
    {
      qEn: "Choose the correct sentence in past tense:",
      qGu: "ભૂતકાળનું સાચું વાક્ય પસંદ કરો:",
      correct: "Yesterday, the children went to the zoo.",
      distractors: [
        "Yesterday, the children go to the zoo.",
        "Yesterday, the children goes to the zoo.",
        "Yesterday, the children was go to the zoo.",
      ],
      exp: "Past tense of 'go' is the irregular verb 'went'.",
      hint: "What is the past form of 'go'?",
    },
    {
      qEn: "Fill in the blank: Neither the teacher nor the students _____ in the hall.",
      qGu: "ખાલી જગ્યા પૂરો: Neither the teacher nor the students _____ in the hall.",
      correct: "were",
      distractors: ["was", "is", "has"],
      exp: "In 'neither... nor...', the verb agrees with the closer subject ('students' -> plural 'were').",
      hint: "Look at the subject closest to the blank ('students').",
    },
    {
      qEn: "Select the correct option: One of the books _____ missing from the shelf.",
      qGu: "સાચો વિકલ્પ પસંદ કરો: One of the books _____ missing from the shelf.",
      correct: "is",
      distractors: ["are", "were", "have"],
      exp: "The subject is 'One' (singular), not 'books'. So singular verb 'is' is correct.",
      hint: "The subject is 'One' of the books.",
    },
  ];

  const HARD_ENGLISH = [
    {
      qEn: "Identify the sentence that has NO grammatical error:",
      qGu: "વ્યાકરણની દૃષ્ટિએ સાચું વાક્ય શોધો:",
      correct: "Each of the participants has received a certificate.",
      distractors: [
        "Each of the participants have received a certificate.",
        "Each of the participant have received a certificate.",
        "Each of the participants are received a certificate.",
      ],
      exp: "'Each' is an indefinite singular pronoun that takes singular verb 'has'.",
      hint: "'Each' takes a singular verb.",
    },
    {
      qEn: "Complete the conditional sentence: If it rains tomorrow, we _____ stay indoors.",
      qGu: "વાક્ય પૂર્ણ કરો: If it rains tomorrow, we _____ stay indoors.",
      correct: "will",
      distractors: ["would", "have", "were"],
      exp: "First conditional uses Present Simple in 'if' clause ('rains') and 'will + verb' in main clause.",
      hint: "Real future possibility takes 'will'.",
    },
    {
      qEn: "Which word is an antonym (opposite) of 'GENEROUS'?",
      qGu: "'GENEROUS' (ઉદાર) શબ્દનો વિરોધી શબ્દ કયો છે?",
      correct: "Stingy",
      distractors: ["Kind", "Helpful", "Wealthy"],
      exp: "Generous means willing to give, while stingy means unwilling to spend or give.",
      hint: "A person who does not like to share.",
    },
  ];

  let pool: any[] = [];
  if (difficulty === "Easy") {
    pool = SUBJECT_VERB_EASY;
  } else if (difficulty === "Medium") {
    pool = [...SUBJECT_VERB_MEDIUM, ...SUBJECT_VERB_EASY];
  } else {
    pool = [...HARD_ENGLISH, ...SUBJECT_VERB_MEDIUM];
  }

  const selectedPool = pickDistinct(pool, count);
  selectedPool.forEach((item, idx) => {
    const qId = `q-eng-${topicId}-${difficulty.toLowerCase()}-${timestamp}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
    questions.push({
      id: qId,
      type: "mcq",
      questionText: item.qEn,
      questionTextGujarati: item.qGu,
      options: shuffle([item.correct, ...item.distractors]),
      correctAnswer: item.correct,
      explanation: item.exp,
      hint: item.hint,
    });
  });

  return questions;
}

// -------------------------------------------------------------
// Procedural EVS Question Generator
// -------------------------------------------------------------
function generateEvsQuestions(topicId: string, difficulty: "Easy" | "Medium" | "Hard", count: number): ActivityQuestion[] {
  const questions: ActivityQuestion[] = [];
  const timestamp = Date.now();

  const EVS_WATER_EASY = [
    {
      qEn: "What happens when the hot sun shines over lakes, rivers, and ponds?",
      qGu: "જ્યારે સૂર્યની ગરમી તળાવ, નદી અને જળાશયો પર પડે છે ત્યારે શું થાય છે?",
      correct: "Water evaporates into water vapor",
      distractors: ["Water freezes into ice", "Water disappears forever", "Water turns into stone"],
      exp: "Sunlight heats up liquid water, converting it into invisible vapor. This process is called Evaporation.",
      hint: "Think about steam coming from boiling water.",
    },
    {
      qEn: "Which of the following is the BEST way to save water at home?",
      qGu: "નીચેનામાંથી ઘરમાં પાણી બચાવવાની શ્રેષ્ઠ રીત કઈ છે?",
      correct: "Turning off the tap while brushing teeth",
      distractors: [
        "Leaving the tap running continuously",
        "Washing a bicycle with a hose pipe for 30 minutes",
        "Throwing clean drinking water in the drain",
      ],
      exp: "Closing the tap while brushing saves up to 5 to 10 liters of pure drinking water every day!",
      hint: "Think about avoiding running taps.",
    },
    {
      qEn: "What is the primary natural source of freshwater on Earth?",
      qGu: "પૃથ્વી પર મીઠા પાણીનો મુખ્ય કુદરતી સ્ત્રોત કયો છે?",
      correct: "Rain (Rainfall)",
      distractors: ["Sea water", "Air", "Sand"],
      exp: "Rainfall replenishes rivers, lakes, ponds, and groundwater.",
      hint: "It falls from monsoon clouds.",
    },
    {
      qEn: "Why should drinking water always be stored in clean, covered vessels?",
      qGu: "પીવાનું પાણી હંમેશા સ્વચ્છ અને ઢાંકેલા વાસણમાં કેમ રાખવું જોઈએ?",
      correct: "To protect it from dust, germs, and insects",
      distractors: ["To make it sweet", "To change its color", "To make it heavy"],
      exp: "Covering water prevents dust, flies, and bacteria from contaminating it, preventing diseases like cholera and jaundice.",
      hint: "Think about keeping insects and dirt out.",
    },
  ];

  const EVS_PLANTS_MEDIUM = [
    {
      qEn: "Which part of the plant absorbs water and minerals from the soil?",
      qGu: "વનસ્પતિનો કયો ભાગ જમીનમાંથી પાણી અને ક્ષારોનું શોષણ કરે છે?",
      correct: "Roots (મૂળ)",
      distractors: ["Leaves (પર્ણ)", "Flower (પુષ્પ)", "Stem (પ્રકાંડ)"],
      exp: "Roots anchor the plant firmly in the soil and absorb moisture and essential soil minerals.",
      hint: "The underground part of the plant.",
    },
    {
      qEn: "Why are plant leaves green in color?",
      qGu: "વનસ્પતિના પાંદડા લીલા રંગના કેમ હોય છે?",
      correct: "Due to the presence of Chlorophyll",
      distractors: ["Because of mud", "Because of water", "Due to sunlight reflection only"],
      exp: "Chlorophyll is a green pigment that traps sunlight for making plant food through photosynthesis.",
      hint: "The green pigment in leaves.",
    },
    {
      qEn: "Which gas do green plants take in from the air during photosynthesis?",
      qGu: "પ્રકાશસંશ્લેષણ દરમિયાન વનસ્પતિ કયો વાયુ ગ્રહણ કરે છે?",
      correct: "Carbon Dioxide",
      distractors: ["Oxygen", "Nitrogen", "Hydrogen"],
      exp: "Plants absorb carbon dioxide from air and release oxygen, which all animals and humans breathe!",
      hint: "The gas that humans exhale.",
    },
  ];

  const EVS_COMMUNITY_HARD = [
    {
      qEn: "What is the main advantage of Rainwater Harvesting (ટાંકી / વાવ)?",
      qGu: "વરસાદી પાણીના સંગ્રહ (રેઈનવોટર હાર્વેસ્ટિંગ) નો મુખ્ય ફાયદો શું છે?",
      correct: "Recharging underground water table and storing clean water for dry months",
      distractors: [
        "Making the soil completely dry",
        "Causing soil erosion",
        "Wasting water in the gutters",
      ],
      exp: "Harvesting rainwater directs rooftop runoff into storage tanks or aquifers, raising the groundwater level for summer.",
      hint: "Saving water for the future when rains stop.",
    },
    {
      qEn: "Which color bin is used for Wet / Biodegradable kitchen waste in Indian schools and municipalities?",
      qGu: "ઓર્ગેનિક અને ભીના કચરા માટે કયા રંગની કચરાપેટી વપરાય છે?",
      correct: "Green Bin (લીલી કચરાપેટી)",
      distractors: ["Blue Bin (વાદળી કચરાપેટી)", "Red Bin (લાલ કચરાપેટી)", "Yellow Bin (પીળી કચરાપેટી)"],
      exp: "Green bins are for biodegradable wet waste (vegetable peels, food), while blue bins are for dry recyclables (paper, plastic).",
      hint: "Color of nature and vegetables.",
    },
    {
      qEn: "Why should we avoid allowing stagnant water puddles near schools and homes?",
      qGu: "શાળા અને ઘરની આસપાસ ખાબોચિયામાં પાણી ભરાઈ ન રહેવું જોઈએ, કેમ?",
      correct: "It becomes a breeding ground for mosquitoes carrying Dengue and Malaria",
      distractors: [
        "It makes birds thirsty",
        "It stops grass from growing",
        "It makes the sky cloudy",
      ],
      exp: "Stagnant clean or dirty water allows mosquitoes to lay eggs, increasing the risk of diseases like Malaria and Dengue.",
      hint: "Mosquitoes multiply in still water.",
    },
  ];

  let pool: any[] = [];
  if (topicId.includes("plant") || topicId === "c-evs-plant-01") {
    pool = EVS_PLANTS_MEDIUM;
  } else if (difficulty === "Easy") {
    pool = EVS_WATER_EASY;
  } else if (difficulty === "Medium") {
    pool = [...EVS_PLANTS_MEDIUM, ...EVS_WATER_EASY];
  } else {
    pool = [...EVS_COMMUNITY_HARD, ...EVS_PLANTS_MEDIUM];
  }

  const selectedPool = pickDistinct(pool, count);
  selectedPool.forEach((item, idx) => {
    const qId = `q-evs-${topicId}-${difficulty.toLowerCase()}-${timestamp}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
    questions.push({
      id: qId,
      type: "mcq",
      questionText: item.qEn,
      questionTextGujarati: item.qGu,
      options: shuffle([item.correct, ...item.distractors]),
      correctAnswer: item.correct,
      explanation: item.exp,
      hint: item.hint,
    });
  });

  return questions;
}

// -------------------------------------------------------------
// Master Generator Function
// -------------------------------------------------------------
export interface GenerateQuestionsOptions {
  subjectCode: "MATH" | "GUJ" | "ENG" | "EVS";
  topicId?: string;
  conceptId?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  count?: number;
  studentName?: string;
}

export function generatePracticeQuestions(options: GenerateQuestionsOptions): ActivityQuestion[] {
  const { subjectCode, difficulty = "Easy", count = 4 } = options;
  let topicId = options.topicId || options.conceptId || "";

  // If topicId not specified, choose default topic for subject
  if (!topicId) {
    const subjectTopics = TOPIC_CATALOG.filter((t) => t.subjectCode === subjectCode);
    topicId = subjectTopics.length > 0 ? subjectTopics[0].id : "default";
  }

  let questions: ActivityQuestion[] = [];

  switch (subjectCode) {
    case "MATH":
      questions = generateMathQuestions(topicId, difficulty, count);
      break;
    case "GUJ":
      questions = generateGujaratiQuestions(topicId, difficulty, count);
      break;
    case "ENG":
      questions = generateEnglishQuestions(topicId, difficulty, count);
      break;
    case "EVS":
      questions = generateEvsQuestions(topicId, difficulty, count);
      break;
    default:
      questions = generateMathQuestions(topicId, difficulty, count);
      break;
  }

  // Final fallback safeguard: ensure at least count questions
  return questions.slice(0, count);
}

export function generateLearningActivity(options: GenerateQuestionsOptions): LearningActivity {
  const { subjectCode, difficulty = "Easy", count = 4, studentName } = options;
  const questions = generatePracticeQuestions(options);

  // Match catalog item
  let topicId = options.topicId || options.conceptId || "";
  let matchedCatalog = TOPIC_CATALOG.find((t) => t.id === topicId || t.conceptId === topicId);
  if (!matchedCatalog) {
    matchedCatalog = TOPIC_CATALOG.find((t) => t.subjectCode === subjectCode) || TOPIC_CATALOG[0];
  }

  const actId = `act-${subjectCode.toLowerCase()}-${matchedCatalog.id}-${difficulty.toLowerCase()}-${Date.now()}`;

  const titleEn = `${matchedCatalog.nameEn} (${difficulty} Level Practice)`;
  const titleGu = `${matchedCatalog.nameGu} (${difficulty === "Easy" ? "સરળ" : difficulty === "Medium" ? "મધ્યમ" : "કઠિન"} મહાવરો)`;

  return {
    id: actId,
    conceptId: matchedCatalog.conceptId,
    conceptName: matchedCatalog.nameEn,
    subjectCode,
    grade: 4,
    title: studentName ? `${titleEn} — ${studentName}` : titleEn,
    titleGujarati: titleGu,
    activityType: "mcq",
    difficulty,
    estimatedMinutes: Math.max(5, count * 2),
    questions,
    createdAt: new Date().toISOString(),
  };
}

export function getTopicsForSubject(subjectCode: string): TopicCatalogItem[] {
  return TOPIC_CATALOG.filter((t) => t.subjectCode === subjectCode);
}

