"use client";

import { useEffect, useState, useCallback } from "react";
import { SettingsClientService } from "@/client/services/settings-service";
import { HTTPService } from "@mindease/services";
import { defaultPomodoroSettings, UserSettings } from "@mindease/models";

const settingsService = new SettingsClientService(new HTTPService());

export function useUserSettings(userId?: string) {
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultPomodoroSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchSettings = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await settingsService.getById(userId);

      setUserSettings(result);
    } catch (err) {
      setError(err);
      console.error("Erro ao carregar settings:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateSettings = async (newSettings: UserSettings) => {
    if (!userId) return;

    setUserSettings(newSettings);

    try {
      await settingsService.update(userId, newSettings);
    } catch (err) {
      setError(err);
      console.error("Erro ao atualizar settings:", err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    userSettings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings,
  };
}