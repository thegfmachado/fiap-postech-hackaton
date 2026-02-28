"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { SettingsClientService } from "@/client/services/settings-service";
import { HTTPService } from "@mindease/services";
import { UserSettings, defaultPomodoroSettings } from "@mindease/models";

export function useUserSettings(userId?: string) {
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultPomodoroSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const settingsService = useMemo(() => {
    return new SettingsClientService(new HTTPService());
  }, []);


  const fetchSettings = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await settingsService.getById(userId);

      if (result) {
        setUserSettings(result);
      }
    } catch (err) {
      setError(err);
      console.error("Erro ao carregar settings:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, settingsService]);


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