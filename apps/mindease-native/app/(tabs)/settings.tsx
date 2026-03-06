import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ConfirmModal } from "@/components/ConfirmModal";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

import { useAuth } from "@/contexts/auth-context";
import { useDisplayMode } from "@/contexts/display-mode-context";
import { useAccessibility } from "@/contexts/accessibility-context";
import { useTheme } from "@/contexts/theme-context";
import { usePomodoroSettingsContext } from "@/contexts/pomodoro-settings-context";
import { UserCard } from "@/components/settings/UserCard";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { PomodoroConfig } from "@/components/settings/PomodoroConfig";
import { DisplayModeSection } from "@/components/settings/DisplayMode";
import { AccessibilitySection } from "@/components/settings/AccessibilitySection";
import { useAppColors } from "@/hooks/useAppColors";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { displayMode, setDisplayMode } = useDisplayMode();
  const { setTheme } = useTheme();
  const { isDark, colors } = useAppColors();
  const { settings: pomodoroSettings, updateSettings: updatePomodoroSettings } = usePomodoroSettingsContext();
  const { contrastMode, fontSize, spacing, setContrastMode, setFontSize, setSpacing, fontScale, spacingScale, isHighContrast } = useAccessibility();

  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 * spacingScale }}>
        <View style={{ paddingHorizontal: 24 * spacingScale, paddingTop: 8 * spacingScale, paddingBottom: 16 * spacingScale }}>
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100" style={{ fontSize: 24 * fontScale, color: colors.text }}>Configurações</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1" style={{ fontSize: 14 * fontScale, color: colors.mutedForeground }}>
            Personalize sua experiência
          </Text>
        </View>

        <UserCard
          name={user?.user_metadata?.name || ""}
          email={user?.email || ""}
        />

        <ThemeSelector
          isDark={isDark}
          onSelectLight={() => setTheme("light")}
          onSelectDark={() => setTheme("dark")}
        />

        <PomodoroConfig
          settings={pomodoroSettings}
          onUpdate={updatePomodoroSettings}
        />

        <DisplayModeSection
          displayMode={displayMode}
          onSelect={setDisplayMode}
        />

        <AccessibilitySection
          contrastMode={contrastMode}
          fontSize={fontSize}
          spacing={spacing}
          onContrastChange={setContrastMode}
          onFontSizeChange={setFontSize}
          onSpacingChange={setSpacing}
        />

        <View style={{ marginHorizontal: 24 * spacingScale, marginTop: 16 * spacingScale }}>
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-white dark:bg-gray-800 rounded-2xl flex-row items-center justify-center border border-red-200 dark:border-red-800"
            style={{
              padding: 16 * spacingScale,
              gap: 8 * spacingScale,
              ...(isHighContrast ? { borderColor: colors.destructive, borderWidth: 2 } : {}),
            }}
          >
            <MaterialIcons name="logout" size={20} color={colors.destructive} />
            <Text className="font-semibold text-red-500 dark:text-red-400" style={{ fontSize: 14 * fontScale, color: colors.destructive }}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showSignOutConfirm}
        title="Sair"
        message="Tem certeza que deseja sair da sua conta?"
        confirmLabel="Sair"
        cancelLabel="Cancelar"
        destructive
        onConfirm={async () => {
          setShowSignOutConfirm(false);
          await signOut();
          router.replace("/");
        }}
        onCancel={() => setShowSignOutConfirm(false)}
      />
    </SafeAreaView>
  );
}
