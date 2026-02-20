'use client'

import { createContext, useState, useMemo, useCallback, type ReactNode } from 'react'
import { StorageService } from '@mindease/services'

export type DisplayMode = 'detailed' | 'simplified'

export interface DisplayModeContextType {
  displayMode: DisplayMode
  setDisplayMode: (mode: DisplayMode) => void
  isSimplified: boolean
  isDetailed: boolean
}

export const DisplayModeContext = createContext<DisplayModeContextType | undefined>(undefined)

interface DisplayModeProviderProps {
  children: ReactNode
}

const storage = new StorageService()
const STORAGE_KEY = 'displayMode'

export function DisplayModeProvider({ children }: DisplayModeProviderProps) {
  const [displayMode, setDisplayModeState] = useState<DisplayMode>(() => {
    const saved = storage.getItem(STORAGE_KEY) as DisplayMode | null
    return saved || 'detailed'
  })

  const setDisplayMode = useCallback((mode: DisplayMode) => {
    setDisplayModeState(mode)
    storage.setItem(STORAGE_KEY, mode)
  }, [])

  const value = useMemo(
    () => ({
      displayMode,
      setDisplayMode,
      isSimplified: displayMode === 'simplified',
      isDetailed: displayMode === 'detailed',
    }),
    [displayMode, setDisplayMode]
  )

  return <DisplayModeContext.Provider value={value}>{children}</DisplayModeContext.Provider>
}
