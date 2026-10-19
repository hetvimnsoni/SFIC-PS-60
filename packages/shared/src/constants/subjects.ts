import type { SubjectCode } from "../types/assessment";

export const SUBJECT_CODES: SubjectCode[] = ["MATH", "ENG", "GUJ", "EVS"];

export const SUBJECT_METADATA: Record<SubjectCode, { name: string; nameGujarati: string; icon: string }> = {
  MATH: { name: "Mathematics", nameGujarati: "ગણિત", icon: "Calculator" },
  ENG: { name: "English", nameGujarati: "અંગ્રેજી", icon: "BookOpen" },
  GUJ: { name: "Gujarati", nameGujarati: "ગુજરાતી", icon: "Languages" },
  EVS: { name: "Environmental Studies", nameGujarati: "પર્યાવરણ", icon: "Trees" },
};
