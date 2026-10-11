import * as React from "react"
import {
  RefreshControl,
  type RefreshControlProps,
  ScrollView,
} from "react-native"
import { useHaptics } from "@/components/primitives/haptics"
import { useTheme } from "@/components/ui/theme"

const MIN_REFRESH = 600

type RefreshHandler = () => Promise<unknown> | unknown

function useRefresh(onRefresh: RefreshHandler) {
  const [refreshing, setRefreshing] = React.useState(false)
  const onRefreshRef = React.useRef(onRefresh)
  const mountedRef = React.useRef(true)
  const haptics = useHaptics()

  React.useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const refresh = React.useCallback(async () => {
    haptics.impact("light")
    setRefreshing(true)
    const started = Date.now()
    await Promise.allSettled([
      new Promise((resolve) => resolve(onRefreshRef.current())),
    ])
    const elapsed = Date.now() - started
    await new Promise((resolve) =>
      setTimeout(resolve, Math.max(0, MIN_REFRESH - elapsed))
    )
    if (mountedRef.current) setRefreshing(false)
  }, [haptics])

  return { refreshing, refresh }
}

function RefreshIndicator(props: RefreshControlProps) {
  const { colors } = useTheme()
  return (
    <RefreshControl
      tintColor={colors.labelSecondary}
      colors={[colors.labelSecondary]}
      progressBackgroundColor={colors.surfaceRaised}
      {...props}
    />
  )
}

function PullToRefreshControl({
  onRefresh,
  refreshing: refreshingProp,
  ...props
}: Omit<RefreshControlProps, "onRefresh" | "refreshing"> & {
  onRefresh: RefreshHandler
  refreshing?: boolean
}) {
  const { refreshing, refresh } = useRefresh(onRefresh)
  return (
    <RefreshIndicator
      accessibilityLabel={refreshing ? "Refreshing" : undefined}
      refreshing={refreshingProp ?? refreshing}
      onRefresh={refresh}
      {...props}
    />
  )
}

function PullToRefresh({
  onRefresh,
  style,
  children,
  ...props
}: React.ComponentProps<typeof ScrollView> & {
  onRefresh: RefreshHandler
}) {
  const { refreshing, refresh } = useRefresh(onRefresh)
  return (
    <ScrollView
      accessibilityState={{ busy: refreshing }}
      style={[{ flex: 1 }, style]}
      refreshControl={
        <RefreshIndicator refreshing={refreshing} onRefresh={refresh} />
      }
      {...props}
    >
      {children}
    </ScrollView>
  )
}

export { PullToRefresh, PullToRefreshControl }
