'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { UserSettings } from '@mindease/models'
import { AuthContext } from '@/contexts/auth-context'
import { useUserSettings } from '@/hooks/use-user-settings'

interface UserSettingsContextType {
  userSettings: UserSettings
  updateSettings: (newSettings: UserSettings) => Promise<void>
  loading: boolean
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined)

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext)
  const { userSettings, updateSettings, loading } = useUserSettings(auth?.user?.id)

  return (
    <UserSettingsContext.Provider value={{ userSettings, updateSettings, loading }}>
      {children}
    </UserSettingsContext.Provider>
  )
}

export function useUserSettingsContext() {
  const context = useContext(UserSettingsContext)
  if (!context) {
    throw new Error('useUserSettingsContext must be used within a UserSettingsProvider')
  }
  return context
}
