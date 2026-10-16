import { cn } from "cn"
import type { Icon as PhosphorIcon } from "phosphor-react-native"
import * as React from "react"
import { AccessibilityInfo, useWindowDimensions, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import {
  Easing,
  Keyframe,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Portal } from "@/components/primitives/portal"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

type TopBannerOptions = {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: PhosphorIcon
  action?: { label: React.ReactNode; onPress: () => void }
  timeout?: number
}

type TopBannerEntry = TopBannerOptions & { id: number }

type TopBannerContextProps = {
  show: (options: TopBannerOptions) => number
  dismiss: (id?: number) => void
}

const TopBannerContext = React.createContext<TopBannerContextProps | null>(null)

function useTopBanner() {
  const context = React.useContext(TopBannerContext)
  if (!context) {
    throw new Error("useTopBanner must be used within a <TopBannerProvider />")
  }
  return context
}

const MAX_WIDTH = 384

const GAP = 300

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

const ENTERING = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: -80 }, { scale: 0.95 }] },
  100: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
    easing: EASING,
  },
})
  .duration(400)
  .reduceMotion(ReduceMotion.System)

const EXITING = new Keyframe({
  0: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
  100: {
    opacity: 0,
    transform: [{ translateY: -80 }, { scale: 0.95 }],
    easing: EASING,
  },
})
  .duration(300)
  .reduceMotion(ReduceMotion.System)

let nextId = 0

function wrapText(children: React.ReactNode, className: string) {
  if (typeof children === "string" || typeof children === "number") {
    return <Text className={className}>{children}</Text>
  }
  return children
}

function TopBannerView({
  entry,
  top,
  inset,
  swiped,
  className,
  onSwipe,
  onPause,
  onDismiss,
}: {
  entry: TopBannerEntry
  top: number
  inset: number
  swiped: boolean
  className?: string
  onSwipe: () => void
  onPause: (paused: boolean) => void
  onDismiss: () => void
}) {
  const translateY = useSharedValue(0)
  const height = useSharedValue(0)

  const gesture = React.useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-8, 8])
        .onStart(() => {
          runOnJS(onPause)(true)
        })
        .onUpdate((event) => {
          translateY.value =
            event.translationY < 0
              ? event.translationY
              : event.translationY * 0.2
        })
        .onEnd((event) => {
          if (event.translationY < -32 || event.velocityY < -500) {
            translateY.value = withTiming(
              -(height.value + top + 16),
              { duration: 200, easing: EASING },
              (finished) => {
                if (finished) runOnJS(onSwipe)()
              }
            )
            return
          }
          translateY.value = withSpring(0, { damping: 20, stiffness: 240 })
          runOnJS(onPause)(false)
        }),
    [translateY, height, top, onSwipe, onPause]
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <AnimatedView
      entering={ENTERING}
      exiting={swiped ? undefined : EXITING}
      className="absolute z-50"
      style={{ top, left: inset, right: inset, pointerEvents: "box-none" }}
    >
      <GestureDetector gesture={gesture}>
        <AnimatedView
          role="alert"
          accessibilityLiveRegion="polite"
          accessibilityActions={[{ name: "dismiss" }]}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === "dismiss") onDismiss()
          }}
          onLayout={(event) => {
            height.value = event.nativeEvent.layout.height
          }}
          className={cn(
            "w-full flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-xl dark:bg-muted",
            className
          )}
          style={animatedStyle}
        >
          {entry.icon ? (
            <Icon as={entry.icon} className="size-6 shrink-0 text-primary" />
          ) : null}
          <View className="min-w-0 flex-1 gap-0.5">
            {wrapText(entry.title, "text-sm font-semibold")}
            {entry.description !== undefined
              ? wrapText(entry.description, "text-sm text-muted-foreground")
              : null}
          </View>
          {entry.action ? (
            <Button
              variant="tinted"
              size="sm"
              onPress={() => {
                entry.action?.onPress()
                onDismiss()
              }}
            >
              {wrapText(entry.action.label, "font-semibold")}
            </Button>
          ) : null}
        </AnimatedView>
      </GestureDetector>
    </AnimatedView>
  )
}

function TopBannerProvider({
  timeout = 4000,
  className,
  portalHost,
  children,
}: {
  timeout?: number
  className?: string
  portalHost?: string
  children?: React.ReactNode
}) {
  const [queue, setQueue] = React.useState<TopBannerEntry[]>([])
  const [ready, setReady] = React.useState(true)
  const [paused, setPaused] = React.useState(false)
  const [swipedId, setSwipedId] = React.useState<number | null>(null)
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const inset = Math.max(16, (width - MAX_WIDTH) / 2)
  const top = insets.top + 8
  const id = React.useId()
  const current = ready ? queue[0] : undefined

  const show = React.useCallback((options: TopBannerOptions) => {
    nextId += 1
    const entry = { ...options, id: nextId }
    setQueue((items) => [...items, entry])
    return entry.id
  }, [])

  const queueRef = React.useRef(queue)
  queueRef.current = queue

  const dismiss = React.useCallback((entryId?: number) => {
    const first = queueRef.current[0]?.id
    const target = entryId ?? first
    if (target === undefined) return
    if (target === first) {
      setReady(false)
      setPaused(false)
    }
    setQueue((items) => items.filter((item) => item.id !== target))
  }, [])

  React.useEffect(() => {
    if (ready) return
    const timer = setTimeout(() => setReady(true), GAP)
    return () => clearTimeout(timer)
  }, [ready])

  React.useEffect(() => {
    if (!current) return
    if (typeof current.title === "string") {
      AccessibilityInfo.announceForAccessibility(current.title)
    }
  }, [current])

  React.useEffect(() => {
    if (!current || paused) return
    const duration = current.timeout ?? timeout
    if (!Number.isFinite(duration) || duration <= 0) return
    const timer = setTimeout(() => dismiss(current.id), duration)
    return () => clearTimeout(timer)
  }, [current, paused, timeout, dismiss])

  React.useEffect(() => {
    if (swipedId === null) return
    dismiss(swipedId)
    setSwipedId(null)
  }, [swipedId, dismiss])

  const contextValue = React.useMemo(() => ({ show, dismiss }), [show, dismiss])

  return (
    <TopBannerContext.Provider value={contextValue}>
      {children}
      <Portal name={`top-banner-${id}`} hostName={portalHost}>
        <TopBannerContext.Provider value={contextValue}>
          {current ? (
            <TopBannerView
              key={current.id}
              entry={current}
              top={top}
              inset={inset}
              swiped={swipedId === current.id}
              className={className}
              onSwipe={() => setSwipedId(current.id)}
              onPause={setPaused}
              onDismiss={() => dismiss(current.id)}
            />
          ) : null}
        </TopBannerContext.Provider>
      </Portal>
    </TopBannerContext.Provider>
  )
}

export { TopBannerProvider, useTopBanner }
