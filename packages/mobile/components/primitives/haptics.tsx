import * as React from "react"

type HapticsImpactStyle = "light" | "medium" | "heavy" | "soft" | "rigid"

type HapticsNotificationType = "success" | "warning" | "error"

interface HapticsAdapter {
  impact(style: HapticsImpactStyle): void
  selection(): void
  notification(type: HapticsNotificationType): void
}

interface HapticsContextValue {
  adapter: HapticsAdapter | null
  enabled: boolean
}

function noop() {
  return undefined
}

const NOOP_HAPTICS_ADAPTER: HapticsAdapter = {
  impact: noop,
  selection: noop,
  notification: noop,
}

const HapticsContext = React.createContext<HapticsContextValue>({
  adapter: NOOP_HAPTICS_ADAPTER,
  enabled: true,
})

function useHaptics(): HapticsAdapter {
  const { adapter, enabled } = React.useContext(HapticsContext)
  return React.useMemo<HapticsAdapter>(() => {
    if (!enabled || !adapter) return NOOP_HAPTICS_ADAPTER
    return {
      impact: (style) => adapter.impact(style),
      selection: () => adapter.selection(),
      notification: (type) => adapter.notification(type),
    }
  }, [adapter, enabled])
}

export type {
  HapticsAdapter,
  HapticsContextValue,
  HapticsImpactStyle,
  HapticsNotificationType,
}
export { HapticsContext, NOOP_HAPTICS_ADAPTER, useHaptics }
