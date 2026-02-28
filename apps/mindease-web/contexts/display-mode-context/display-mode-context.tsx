'use client'

import { createContext, useMemo, useCallback, type ReactNode } from 'react'
import { useUserSettings } from '@/hooks/use-user-settings'
import { useCurrentUser } from '@/hooks/use-current-user'
import { ViewMode } from '@mindease/models'

export interface DisplayModeContextType {
  displayMode: ViewMode
  setDisplayMode: (mode: ViewMode) => void
  isSimplified: boolean
  isDetailed: boolean
}

export const DisplayModeContext = createContext<DisplayModeContextType | undefined>(undefined)

interface DisplayModeProviderProps {
  children: ReactNode
}

export function DisplayModeProvider({ children }: DisplayModeProviderProps) {
  const { user } = useCurrentUser()
  const { userSettings, updateSettings } = useUserSettings(user?.id)

  const setDisplayMode = useCallback(
    (mode: ViewMode) => {
      updateSettings({
        ...userSettings,
        viewMode: mode,
      })
    },
    [userSettings, updateSettings]
  )

  const value = useMemo(
    () => ({
      displayMode: userSettings.viewMode,
      setDisplayMode,
      isSimplified: userSettings.viewMode === ViewMode.summary,
      isDetailed: userSettings.viewMode === ViewMode.detailed,
    }),
    [userSettings.viewMode, setDisplayMode]
  )

  return <DisplayModeContext.Provider value={value}>{children}</DisplayModeContext.Provider>
}