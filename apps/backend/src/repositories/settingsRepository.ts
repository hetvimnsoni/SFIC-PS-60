import { db } from "../../../../src/lib/db/database";
import type { School, SchoolSettings } from "../../../../packages/shared/src/types";

export class SettingsRepository {
  async getSchool(): Promise<School> {
    return db.getSchool();
  }

  async getSettings(): Promise<SchoolSettings> {
    return db.getSettings();
  }

  async updateSettings(updates: Partial<SchoolSettings>): Promise<SchoolSettings> {
    return db.updateSettings(updates);
  }

  async resetDemoData(): Promise<void> {
    return db.resetToDemoData();
  }
}

export const settingsRepository = new SettingsRepository();
