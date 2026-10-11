import * as React from "react"
import {
  type HapticsAdapter,
  HapticsContext,
  type HapticsContextValue,
  type HapticsImpactStyle,
  type HapticsNotificationType,
  NOOP_HAPTICS_ADAPTER,
  useHaptics,
} from "@/components/primitives/haptics"

function HapticsProvider({
  adapter,
  enabled = true,
  children,
}: {
  adapter?: HapticsAdapter | null
  enabled?: boolean
  children?: React.ReactNode
}) {
  const value = React.useMemo<HapticsContextValue>(
    () => ({ adapter: adapter ?? NOOP_HAPTICS_ADAPTER, enabled }),
    [adapter, enabled]
  )
  return (
    <HapticsContext.Provider value={value}>{children}</HapticsContext.Provider>
  )
}

export type { HapticsAdapter, HapticsImpactStyle, HapticsNotificationType }
export { HapticsProvider, useHaptics }
