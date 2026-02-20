"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

import { AuthProvider } from "@/contexts/auth-context"
import { DisplayModeProvider } from "@/contexts/display-mode-context/display-mode-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
    >
      <AuthProvider>
        <DisplayModeProvider>
          {children}
        </DisplayModeProvider>
      </AuthProvider>
    </NextThemesProvider>
  )
}
