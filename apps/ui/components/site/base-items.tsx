"use client"

import * as React from "react"
import type { BaseItems } from "@/lib/dependencies"

const BaseItemsContext = React.createContext<BaseItems>({})

export function BaseItemsProvider({
  value,
  children,
}: {
  value: BaseItems | undefined
  children: React.ReactNode
}) {
  return (
    <BaseItemsContext.Provider value={value ?? {}}>
      {children}
    </BaseItemsContext.Provider>
  )
}

export const useBaseItems = () => React.useContext(BaseItemsContext)
