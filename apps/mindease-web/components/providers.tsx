"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

import { AuthProvider } from "@/contexts/auth-context"
import { UserSettingsProvider } from "@/contexts/user-settings-context"
import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { DisplayModeProvider } from "@/contexts/display-mode-context/display-mode-context"
import { TasksProvider } from "@/contexts/tasks-context"
import { PomodoroProvider } from "@/contexts/pomodoro-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <AuthProvider>
        <UserSettingsProvider>
          <DisplayModeProvider>
            <AccessibilityProvider>
              <TasksProvider>
                <PomodoroProvider>
                  {children}
                </PomodoroProvider>
              </TasksProvider>
            </AccessibilityProvider>
          </DisplayModeProvider>
        </UserSettingsProvider>
      </AuthProvider>
    </NextThemesProvider>
  )
}
