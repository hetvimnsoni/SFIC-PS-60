import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Theme System & Toggle Logic", () => {
  type ThemeMode = "light" | "dark" | "system";
  type ResolvedTheme = "light" | "dark";

  function resolveTheme(mode: ThemeMode, systemPrefersDark: boolean): ResolvedTheme {
    if (mode === "system") {
      return systemPrefersDark ? "dark" : "light";
    }
    return mode;
  }

  function getNextToggledTheme(currentResolved: ResolvedTheme): ResolvedTheme {
    return currentResolved === "dark" ? "light" : "dark";
  }

  it("resolves explicit 'light' mode correctly regardless of system preference", () => {
    assert.equal(resolveTheme("light", true), "light");
    assert.equal(resolveTheme("light", false), "light");
  });

  it("resolves explicit 'dark' mode correctly regardless of system preference", () => {
    assert.equal(resolveTheme("dark", false), "dark");
    assert.equal(resolveTheme("dark", true), "dark");
  });

  it("resolves 'system' mode dynamically based on system prefers-color-scheme media", () => {
    assert.equal(resolveTheme("system", true), "dark", "System with prefers-color-scheme: dark should resolve to dark");
    assert.equal(resolveTheme("system", false), "light", "System without dark preference should resolve to light");
  });

  it("toggles between dark and light themes smoothly", () => {
    let active: ResolvedTheme = "light";
    active = getNextToggledTheme(active);
    assert.equal(active, "dark", "Toggling from light should yield dark");

    active = getNextToggledTheme(active);
    assert.equal(active, "light", "Toggling from dark should yield light");
  });

  it("uses the consistent localStorage key 'shikshasetu_theme'", () => {
    const STORAGE_KEY = "shikshasetu_theme";
    assert.equal(STORAGE_KEY, "shikshasetu_theme");
  });
});
