import { cn } from "cn"
import { cssInterop } from "nativewind"
import * as React from "react"
import {
  type ColorValue,
  RefreshControl,
  type RefreshControlProps,
  ScrollView,
} from "react-native"

const MIN_REFRESH = 600

type RefreshHandler = () => Promise<unknown> | unknown

function useRefresh(onRefresh: RefreshHandler) {
  const [refreshing, setRefreshing] = React.useState(false)
  const onRefreshRef = React.useRef(onRefresh)
  const mountedRef = React.useRef(true)

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
  }, [])

  return { refreshing, refresh }
}

function RefreshIndicator({
  color,
  ...props
}: RefreshControlProps & { color?: ColorValue }) {
  return (
    <RefreshControl
      tintColor={color}
      colors={color ? [color] : undefined}
      {...props}
    />
  )
}

const StyledRefreshIndicator = cssInterop(RefreshIndicator, {
  colorClassName: { target: false, nativeStyleToProp: { color: true } },
  progressBackgroundColorClassName: {
    target: false,
    nativeStyleToProp: { color: "progressBackgroundColor" },
  },
})

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
    <StyledRefreshIndicator
      colorClassName="text-label-secondary"
      progressBackgroundColorClassName="text-surface-raised"
      accessibilityLabel={refreshing ? "Refreshing" : undefined}
      refreshing={refreshingProp ?? refreshing}
      onRefresh={refresh}
      {...props}
    />
  )
}

function PullToRefresh({
  onRefresh,
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollView> & {
  onRefresh: RefreshHandler
}) {
  const { refreshing, refresh } = useRefresh(onRefresh)
  return (
    <ScrollView
      accessibilityState={{ busy: refreshing }}
      className={cn("flex-1", className)}
      refreshControl={
        <StyledRefreshIndicator
          colorClassName="text-label-secondary"
          progressBackgroundColorClassName="text-surface-raised"
          refreshing={refreshing}
          onRefresh={refresh}
        />
      }
      {...props}
    >
      {children}
    </ScrollView>
  )
}

export { PullToRefresh, PullToRefreshControl }
