import * as React from "react"
import {
  AccessibilityInfo,
  AppState,
  I18nManager,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native"
import {
  cancelAnimation,
  Easing,
  Keyframe,
  ReduceMotion,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Portal } from "@/components/primitives/portal"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  radius,
  shadow,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type UndoBarOptions = {
  title: React.ReactNode
  actionLabel?: React.ReactNode
  onUndo: () => void
  onCommit?: () => void
}

type UndoBarEntry = UndoBarOptions & { id: number }

type UndoBarContextProps = {
  show: (options: UndoBarOptions) => void
  undo: () => void
  dismiss: () => void
}

const UndoBarContext = React.createContext<UndoBarContextProps | null>(null)

function useUndoBar() {
  const context = React.useContext(UndoBarContext)
  if (!context) {
    throw new Error("useUndoBar must be used within an <UndoBarProvider />")
  }
  return context
}

const MAX_WIDTH = 384

const RING_SIZE = 18

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

const ENTERING = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 80 }, { scale: 0.95 }] },
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
    transform: [{ translateY: 80 }, { scale: 0.95 }],
    easing: EASING,
  },
})
  .duration(300)
  .reduceMotion(ReduceMotion.System)

let nextId = 0

const styles = StyleSheet.create({
  ringBox: {
    width: 20,
    height: 20,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: { width: RING_SIZE, height: RING_SIZE },
  circle: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: radius.full,
    borderWidth: 2,
  },
  frame: { position: "absolute", zIndex: 50 },
  bar: {
    height: 52,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingStart: 16,
    paddingEnd: 4,
    ...shadow.xl,
  },
  titleBox: { minWidth: 0, flex: 1 },
  title: { ...fontSize.sm, fontWeight: "500" },
  action: { paddingHorizontal: 16 },
  actionText: { fontWeight: "600" },
})

function CountdownRing({
  progress,
  colors,
}: {
  progress: SharedValue<number>
  colors: ThemeColors
}) {
  const half = RING_SIZE / 2
  const endStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${Math.min(progress.value * 360, 180)}deg` }],
  }))
  const startStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${Math.max(progress.value * 360 - 180, 0)}deg` }],
  }))
  const arc = [styles.circle, { borderColor: colors.labelSecondary }]
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.ringBox,
        I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined,
      ]}
    >
      <View style={styles.ring}>
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.circle,
            { borderColor: colors.separator },
          ]}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: half,
            width: half,
            height: RING_SIZE,
            overflow: "hidden",
          }}
        >
          <AnimatedView
            style={[
              {
                position: "absolute",
                top: 0,
                left: -half,
                width: RING_SIZE,
                height: RING_SIZE,
              },
              endStyle,
            ]}
          >
            <View
              style={{ width: half, height: RING_SIZE, overflow: "hidden" }}
            >
              <View style={arc} />
            </View>
          </AnimatedView>
        </View>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: half,
            height: RING_SIZE,
            overflow: "hidden",
          }}
        >
          <AnimatedView
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                width: RING_SIZE,
                height: RING_SIZE,
              },
              startStyle,
            ]}
          >
            <View
              style={{
                position: "absolute",
                top: 0,
                left: half,
                width: half,
                height: RING_SIZE,
                overflow: "hidden",
              }}
            >
              <View
                style={[arc, { position: "absolute", top: 0, left: -half }]}
              />
            </View>
          </AnimatedView>
        </View>
      </View>
    </View>
  )
}

function UndoBarProvider({
  timeout = 5000,
  style,
  portalHost,
  children,
}: {
  timeout?: number
  style?: StyleProp<ViewStyle>
  portalHost?: string
  children?: React.ReactNode
}) {
  const { colors, isDark } = useTheme()
  const [entry, setEntry] = React.useState<UndoBarEntry | null>(null)
  const [active, setActive] = React.useState(AppState.currentState === "active")
  const entryRef = React.useRef<UndoBarEntry | null>(null)
  const remainingRef = React.useRef({ id: 0, duration: timeout })
  const progress = useSharedValue(1)
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const inset = Math.max(16, (width - MAX_WIDTH) / 2)
  const id = React.useId()

  const settle = React.useCallback((undo: boolean) => {
    const current = entryRef.current
    if (!current) return
    entryRef.current = null
    setEntry(null)
    if (undo) current.onUndo()
    else current.onCommit?.()
  }, [])

  const show = React.useCallback(
    (options: UndoBarOptions) => {
      entryRef.current?.onCommit?.()
      nextId += 1
      const next = { ...options, id: nextId }
      entryRef.current = next
      remainingRef.current = { id: next.id, duration: timeout }
      setEntry(next)
      if (typeof options.title === "string") {
        AccessibilityInfo.announceForAccessibility(options.title)
      }
    },
    [timeout]
  )

  const undo = React.useCallback(() => settle(true), [settle])
  const dismiss = React.useCallback(() => settle(false), [settle])

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) =>
      setActive(state === "active")
    )
    return () => subscription.remove()
  }, [])

  React.useEffect(() => {
    if (!entry) return
    if (!active) {
      cancelAnimation(progress)
      return
    }
    const remaining =
      remainingRef.current.id === entry.id
        ? remainingRef.current.duration
        : timeout
    const started = Date.now()
    progress.value = remaining / timeout
    progress.value = withTiming(0, {
      duration: remaining,
      easing: Easing.linear,
      reduceMotion: ReduceMotion.Never,
    })
    const timer = setTimeout(dismiss, remaining)
    return () => {
      clearTimeout(timer)
      if (remainingRef.current.id !== entry.id) return
      remainingRef.current = {
        id: entry.id,
        duration: Math.max(0, remaining - (Date.now() - started)),
      }
    }
  }, [entry, active, timeout, dismiss, progress])

  const contextValue = React.useMemo(
    () => ({ show, undo, dismiss }),
    [show, undo, dismiss]
  )

  return (
    <UndoBarContext.Provider value={contextValue}>
      {children}
      <Portal name={`undo-bar-${id}`} hostName={portalHost}>
        {entry ? (
          <AnimatedView
            key={entry.id}
            entering={ENTERING}
            exiting={EXITING}
            style={[
              styles.frame,
              {
                left: inset,
                right: inset,
                bottom: Math.max(16, insets.bottom),
                pointerEvents: "box-none",
              },
            ]}
          >
            <View
              role="group"
              accessibilityLiveRegion="polite"
              style={[
                styles.bar,
                {
                  borderColor: colors.separator,
                  backgroundColor: isDark
                    ? colors.surfaceSecondary
                    : colors.surfaceRaised,
                },
                style,
              ]}
            >
              <CountdownRing progress={progress} colors={colors} />
              <View style={styles.titleBox}>
                {typeof entry.title === "string" ||
                typeof entry.title === "number" ? (
                  <Text numberOfLines={1} style={styles.title}>
                    {entry.title}
                  </Text>
                ) : (
                  entry.title
                )}
              </View>
              <Button
                variant="plain"
                size="lg"
                style={styles.action}
                onPress={undo}
              >
                {typeof entry.actionLabel === "string" ||
                typeof entry.actionLabel === "number" ||
                entry.actionLabel === undefined ? (
                  <Text style={styles.actionText}>
                    {entry.actionLabel ?? "Undo"}
                  </Text>
                ) : (
                  entry.actionLabel
                )}
              </Button>
            </View>
          </AnimatedView>
        ) : null}
      </Portal>
    </UndoBarContext.Provider>
  )
}

export { UndoBarProvider, useUndoBar }
