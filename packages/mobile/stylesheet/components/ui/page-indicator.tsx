import * as React from "react"
import {
  type AccessibilityActionEvent,
  Pressable,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native"
import {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useHaptics } from "@/components/primitives/haptics"
import { AnimatedView } from "@/components/ui/animated-view"
import { radius, useTheme } from "@/components/ui/theme"

type PageIndicatorSize = "default" | "sm"

type PageIndicatorVariant = "default" | "accent"

const SIZES: Record<
  PageIndicatorSize,
  { dot: number; active: number; gap: number }
> = {
  default: { dot: 8, active: 20, gap: 8 },
  sm: { dot: 6, active: 14, gap: 6 },
}

const TIMING = {
  duration: 300,
  easing: Easing.bezier(0.32, 0.72, 0, 1),
  reduceMotion: ReduceMotion.System,
}

function actionStep(actionName: string) {
  if (actionName === "increment") return 1
  if (actionName === "decrement") return -1
  return 0
}

const styles = StyleSheet.create({
  root: { alignItems: "center", justifyContent: "center", alignSelf: "center" },
  frame: { justifyContent: "center", overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center" },
  dot: { borderRadius: radius.full },
})

const ACTIONS = [{ name: "increment" }, { name: "decrement" }]

function windowStart(count: number, index: number, maxVisible: number) {
  if (count <= maxVisible) return 0
  return Math.min(
    Math.max(index - Math.floor(maxVisible / 2), 0),
    count - maxVisible
  )
}

function dotScale(
  position: number,
  start: number,
  count: number,
  maxVisible: number
) {
  if (count <= maxVisible) return 1
  const offset = position - start
  if (offset < 0 || offset >= maxVisible) return 0
  const end = start + maxVisible < count
  if (start > 0 && offset === 0) return 0.5
  if (start > 0 && offset === 1) return 0.75
  if (end && offset === maxVisible - 1) return 0.5
  if (end && offset === maxVisible - 2) return 0.75
  return 1
}

function PageIndicatorDot({
  active,
  scale,
  size,
  variant,
  onPress,
}: {
  active: boolean
  scale: number
  size: PageIndicatorSize
  variant: PageIndicatorVariant
  onPress?: () => void
}) {
  const { colors } = useTheme()
  const metrics = SIZES[size]
  const width = useSharedValue(active ? metrics.active : metrics.dot)
  const dotScaleValue = useSharedValue(scale)

  React.useEffect(() => {
    width.value = withTiming(active ? metrics.active : metrics.dot, TIMING)
  }, [active, metrics, width])

  React.useEffect(() => {
    dotScaleValue.value = withTiming(scale, TIMING)
  }, [scale, dotScaleValue])

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    transform: [{ scale: dotScaleValue.value }],
  }))

  const activeColor = variant === "accent" ? colors.primary : colors.foreground

  return (
    <Pressable
      accessible={false}
      disabled={!onPress}
      onPress={onPress}
      hitSlop={{
        top: 8,
        bottom: 8,
        left: metrics.gap / 2,
        right: metrics.gap / 2,
      }}
    >
      <AnimatedView
        style={[
          styles.dot,
          {
            height: metrics.dot,
            backgroundColor: active ? activeColor : colors.border,
          },
          animatedStyle,
        ]}
      />
    </Pressable>
  )
}

function PageIndicator({
  count,
  index,
  onIndexChange,
  size = "default",
  variant = "default",
  maxVisible = 7,
  accessibilityLabel = "Page",
  style,
  ...props
}: Omit<ViewProps, "children"> & {
  count: number
  index: number
  onIndexChange?: (index: number) => void
  size?: PageIndicatorSize
  variant?: PageIndicatorVariant
  maxVisible?: number
}) {
  const haptics = useHaptics()
  const metrics = SIZES[size]
  const visible = Math.max(3, maxVisible)
  const current = Math.min(Math.max(index, 0), Math.max(0, count - 1))
  const start = windowStart(count, current, visible)
  const shown = Math.min(count, visible)
  const frameWidth =
    shown * metrics.dot +
    (shown - 1) * metrics.gap +
    metrics.active -
    metrics.dot
  const offset = useSharedValue(-start * (metrics.dot + metrics.gap))

  React.useEffect(() => {
    offset.value = withTiming(-start * (metrics.dot + metrics.gap), TIMING)
  }, [start, metrics, offset])

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  if (count <= 0) return null

  const select = (next: number) => {
    if (!onIndexChange || next === current) return
    haptics.selection()
    onIndexChange(next)
  }

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (!onIndexChange) return
    const step = actionStep(event.nativeEvent.actionName)
    const next = Math.min(Math.max(current + step, 0), count - 1)
    if (next !== current) onIndexChange(next)
  }

  return (
    <View
      {...props}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: `${current + 1} of ${count}` }}
      accessibilityActions={onIndexChange ? ACTIONS : undefined}
      onAccessibilityAction={onAccessibilityAction}
      style={[styles.root, style]}
    >
      <View
        style={[styles.frame, { width: frameWidth, height: metrics.dot + 16 }]}
      >
        <AnimatedView style={[styles.row, { gap: metrics.gap }, rowStyle]}>
          {Array.from({ length: count }, (_, position) => position).map(
            (position) => (
              <PageIndicatorDot
                key={position}
                active={position === current}
                scale={dotScale(position, start, count, visible)}
                size={size}
                variant={variant}
                onPress={onIndexChange ? () => select(position) : undefined}
              />
            )
          )}
        </AnimatedView>
      </View>
    </View>
  )
}

export type { PageIndicatorSize, PageIndicatorVariant }
export { PageIndicator }
