import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import { settingsService } from "@/lib/services/settings-service";

export type ContrastMode = "low" | "high";
export type SizeOption = "small" | "medium" | "large";

type AccessibilityState = {
  contrastMode: ContrastMode;
  fontSize: SizeOption;
  spacing: SizeOption;
};

type AccessibilityContextType = AccessibilityState & {
  setContrastMode: (mode: ContrastMode) => void;
  setFontSize: (size: SizeOption) => void;
  setSpacing: (size: SizeOption) => void;
  isHighContrast: boolean;
  fontScale: number;
  spacingScale: number;
};

const FONT_SCALE: Record<SizeOption, number> = {
  small: 0.875,
  medium: 1.0,
  large: 1.15,
};

const SPACING_SCALE: Record<SizeOption, number> = {
  small: 0.75,
  medium: 1.0,
  large: 1.35,
};

const DEFAULT_STATE: AccessibilityState = {
  contrastMode: "low",
  fontSize: "medium",
  spacing: "medium",
};

const STORAGE_KEY = "mindease_accessibility";

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

function isContrastMode(v: unknown): v is ContrastMode {
  return v === "low" || v === "high";
}

function isSizeOption(v: unknown): v is SizeOption {
  return v === "small" || v === "medium" || v === "large";
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessibilityState>(DEFAULT_STATE);

  React.useEffect(() => {
    async function loadSettings() {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<AccessibilityState>;
          setState((prev) => ({ ...prev, ...parsed }));
        } catch {
        }
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const dbSettings = await settingsService.getAccessibility(user.id);
        if (!dbSettings) return;

        const next: Partial<AccessibilityState> = {};
        if (isContrastMode(dbSettings.contrast_intensity)) next.contrastMode = dbSettings.contrast_intensity;
        if (isSizeOption(dbSettings.font_size)) next.fontSize = dbSettings.font_size;
        if (isSizeOption(dbSettings.spacing)) next.spacing = dbSettings.spacing;

        if (Object.keys(next).length > 0) {
          setState((prev) => {
            const merged = { ...prev, ...next };
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      } catch {
      }
    }

    loadSettings();
  }, []);

  const persist = useCallback((next: AccessibilityState) => {
    setState(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    supabase.auth.getUser()
      .then(({ data: { user } }) => {
        if (!user) return;
        return settingsService.updateAccessibility(user.id, {
          contrast_intensity: next.contrastMode,
          font_size: next.fontSize,
          spacing: next.spacing,
        });
      })
      .catch(() => {
      });
  }, []);

  const setContrastMode = useCallback(
    (contrastMode: ContrastMode) => persist({ ...state, contrastMode }),
    [state, persist]
  );

  const setFontSize = useCallback(
    (fontSize: SizeOption) => persist({ ...state, fontSize }),
    [state, persist]
  );

  const setSpacing = useCallback(
    (spacing: SizeOption) => persist({ ...state, spacing }),
    [state, persist]
  );

  const value = useMemo(
    () => ({
      ...state,
      setContrastMode,
      setFontSize,
      setSpacing,
      isHighContrast: state.contrastMode === "high",
      fontScale: FONT_SCALE[state.fontSize],
      spacingScale: SPACING_SCALE[state.spacing],
    }),
    [state, setContrastMode, setFontSize, setSpacing]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
