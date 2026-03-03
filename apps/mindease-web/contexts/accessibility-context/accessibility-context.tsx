'use client'

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useUserSettingsContext } from '@/contexts/user-settings-context'
import { ContrastMode, Size } from '@mindease/models'

interface AccessibilityContextType {
  contrastMode: ContrastMode
  fontSize: Size
  spacing: Size
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const { userSettings } = useUserSettingsContext()

  useEffect(() => {
    const el = document.documentElement
    el.dataset.contrast = userSettings.contrastMode
    el.dataset.fontSize = userSettings.fontSize
    el.dataset.spacing = userSettings.spacing
  }, [userSettings.contrastMode, userSettings.fontSize, userSettings.spacing])

  const value = useMemo(
    () => ({
      contrastMode: userSettings.contrastMode,
      fontSize: userSettings.fontSize,
      spacing: userSettings.spacing,
    }),
    [userSettings.contrastMode, userSettings.fontSize, userSettings.spacing]
  )

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
