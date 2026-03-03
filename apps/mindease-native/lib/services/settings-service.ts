import { supabase } from "@/lib/supabase";

export type AccessibilitySettingsUpdate = {
  contrast_intensity: string;
  font_size: string;
  spacing: string;
};

export const settingsService = {
  async getAccessibility(userId: string): Promise<AccessibilitySettingsUpdate | null> {
    const { data, error } = await supabase
      .from("settings")
      .select("contrast_intensity, font_size, spacing")
      .eq("id", userId)
      .single();

    if (error || !data) return null;
    return data as AccessibilitySettingsUpdate;
  },

  async updateAccessibility(userId: string, updates: AccessibilitySettingsUpdate): Promise<void> {
    const { error } = await supabase
      .from("settings")
      .update(updates)
      .eq("id", userId);
    if (error) throw error;
  },
};
