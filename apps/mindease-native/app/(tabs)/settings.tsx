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
import { useTheme } from "@/contexts/theme-context";
import { usePomodoroSettingsContext } from "@/contexts/pomodoro-settings-context";
import { UserCard } from "@/components/settings/UserCard";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { PomodoroConfig } from "@/components/settings/PomodoroConfig";
import { DisplayModeSection } from "@/components/settings/DisplayMode";
import { useAppColors } from "@/hooks/useAppColors";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { displayMode, setDisplayMode } = useDisplayMode();
  const { setTheme } = useTheme();
  const { isDark, colors } = useAppColors();
  const { settings: pomodoroSettings, updateSettings: updatePomodoroSettings } = usePomodoroSettingsContext();

  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-6 pt-2 pb-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configurações</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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

        <View className="mx-6 mt-4">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex-row items-center justify-center gap-2 border border-red-200 dark:border-red-800"
          >
            <MaterialIcons name="logout" size={20} color={colors.destructive} />
            <Text className="font-semibold text-red-500 dark:text-red-400">Sair da conta</Text>
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
