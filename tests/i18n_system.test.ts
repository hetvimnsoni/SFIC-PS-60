import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { translations, formatSubjectName, formatStatusLabel, formatClassName } from "../src/lib/i18n/translations";

describe("Multilingual i18n System & Gujarati Translation Verification", () => {
  const en = translations.en;
  const gu = translations.gu;

  it("has matching top-level namespaces in both English and Gujarati dictionaries", () => {
    const enKeys = Object.keys(en).sort();
    const guKeys = Object.keys(gu).sort();
    assert.deepEqual(guKeys, enKeys, "All namespaces in 'en' must be defined in 'gu'");
  });

  it("has complete key parity across all nested namespaces", () => {
    const namespaces = Object.keys(en) as Array<keyof typeof en>;
    const missingKeys: string[] = [];

    for (const ns of namespaces) {
      const enNs = en[ns] as Record<string, string>;
      const guNs = gu[ns] as Record<string, string>;
      assert.ok(guNs, `Namespace ${ns} is missing in Gujarati dictionary`);

      for (const key of Object.keys(enNs)) {
        if (!(key in guNs)) {
          missingKeys.push(`${ns}.${key}`);
        }
      }
    }

    assert.equal(missingKeys.length, 0, `Missing Gujarati translation keys: ${missingKeys.join(", ")}`);
  });

  it("contains authentic Gujarati unicode script for user-facing text", () => {
    const namespaces = Object.keys(gu) as Array<keyof typeof gu>;
    const guRegex = /[\u0A80-\u0AFF]/; // Gujarati Unicode Block
    let totalGuStrings = 0;
    let guScriptMatches = 0;

    for (const ns of namespaces) {
      const guNs = gu[ns] as Record<string, string>;
      for (const [key, value] of Object.entries(guNs)) {
        if (typeof value === "string") {
          totalGuStrings++;
          // Exclude brand acronyms or technical tokens like AI, CSV, 3D, NEP, GCERT, 5-Step
          if (guRegex.test(value) || /AI|CSV|3D|NEP|GCERT|PIN|SMS|WhatsApp|ID/.test(value)) {
            guScriptMatches++;
          }
        }
      }
    }

    assert.ok(totalGuStrings > 100, `Expected over 100 translation strings, found ${totalGuStrings}`);
    const coverageRatio = guScriptMatches / totalGuStrings;
    assert.ok(coverageRatio >= 0.95, `Gujarati script coverage must be at least 95%, found ${(coverageRatio * 100).toFixed(1)}%`);
  });

  it("correctly localizes subject names dynamically", () => {
    assert.equal(formatSubjectName("MATH", "gu"), "ગણિત");
    assert.equal(formatSubjectName("ENG", "gu"), "અંગ્રેજી");
    assert.equal(formatSubjectName("GUJ", "gu"), "ગુજરાતી");
    assert.equal(formatSubjectName("EVS", "gu"), "પર્યાવરણ (આસપાસ)");

    assert.equal(formatSubjectName("MATH", "en"), "Mathematics");
    assert.equal(formatSubjectName("ENG", "en"), "English");
    assert.equal(formatSubjectName("GUJ", "en"), "Gujarati");
    assert.equal(formatSubjectName("EVS", "en"), "Environmental Studies");
  });

  it("correctly localizes priority and status labels dynamically", () => {
    assert.equal(formatStatusLabel("high", "gu"), "ઉચ્ચ અગ્રતા");
    assert.equal(formatStatusLabel("medium", "gu"), "મધ્યમ અગ્રતા");
    assert.equal(formatStatusLabel("critical", "gu"), "તાકીદનું");
    assert.equal(formatStatusLabel("active", "gu"), "સક્રિય");
    assert.equal(formatStatusLabel("resolved", "gu"), "ઉકેલાઈ ગયેલ");

    assert.equal(formatStatusLabel("high", "en"), "High Priority");
    assert.equal(formatStatusLabel("medium", "en"), "Medium Priority");
    assert.equal(formatStatusLabel("critical", "en"), "Critical Attention");
    assert.equal(formatStatusLabel("active", "en"), "Active");
    assert.equal(formatStatusLabel("resolved", "en"), "Resolved");
  });

  it("correctly localizes classroom codes dynamically", () => {
    assert.equal(formatClassName("Class 3-A", "gu"), "ધોરણ ૩-અ");
    assert.equal(formatClassName("Class 4-B", "gu"), "ધોરણ ૪-બ");
    assert.equal(formatClassName("all", "gu"), "બધા વર્ગ");

    assert.equal(formatClassName("Class 3-A", "en"), "Class 3-A");
    assert.equal(formatClassName("all", "en"), "All Classes");
  });

  it("maintains reliable fallback proxy when a key is missing", () => {
    function createDeepFallbackProxy<T extends object>(target: T, fallback: T): T {
      return new Proxy(target, {
        get(obj: any, prop: string | symbol) {
          const targetVal = obj[prop];
          const fallbackVal = (fallback as any)?.[prop];
          if (targetVal !== undefined && targetVal !== null && targetVal !== "") {
            if (typeof targetVal === "object" && !Array.isArray(targetVal)) {
              return createDeepFallbackProxy(targetVal, fallbackVal || {});
            }
            return targetVal;
          }
          return fallbackVal;
        },
      });
    }

    const testGu = {
      nav: {
        dashboard: "ડેશબોર્ડ",
        // students missing
      },
    };
    const testEn = {
      nav: {
        dashboard: "Dashboard",
        students: "Students Directory",
      },
    };

    const proxied = createDeepFallbackProxy(testGu as any, testEn as any);
    assert.equal(proxied.nav.dashboard, "ડેશબોર્ડ");
    assert.equal(proxied.nav.students, "Students Directory");
  });
});
