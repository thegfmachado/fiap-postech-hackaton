'use client'

import { createContext, useState, useMemo, useCallback, type ReactNode } from 'react'

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

export function DisplayModeProvider({ children }: DisplayModeProviderProps) {
  const [displayMode, setDisplayModeState] = useState<DisplayMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('displayMode')
      return (saved as DisplayMode) || 'detailed'
    }
    return 'detailed'
  })

  const setDisplayMode = useCallback((mode: DisplayMode) => {
    setDisplayModeState(mode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('displayMode', mode)
    }
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
