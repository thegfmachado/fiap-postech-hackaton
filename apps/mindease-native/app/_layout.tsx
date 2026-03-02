import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/auth-context";
import { DisplayModeProvider } from "@/contexts/display-mode-context";
import { TasksProvider } from "@/contexts/tasks-context";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import { PomodoroSettingsProvider } from "@/contexts/pomodoro-settings-context";

function InnerLayout() {
  const { isDark } = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <DisplayModeProvider>
              <TasksProvider>
                <PomodoroSettingsProvider>
                  <InnerLayout />
                </PomodoroSettingsProvider>
              </TasksProvider>
            </DisplayModeProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
