import * as React from "react"
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import * as ProgressPrimitive from "@/components/primitives/progress"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  track: {
    position: "relative",
    height: 4,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: radius.full,
  },
  indicator: { height: "100%" },
  label: { ...fontSize.sm },
  value: {
    ...fontSize.sm,
    marginStart: "auto",
    fontVariant: ["tabular-nums"],
  },
})

function Progress({
  style,
  children,
  trackStyle,
  indicatorStyle,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  trackStyle?: StyleProp<ViewStyle>
  indicatorStyle?: StyleProp<ViewStyle>
}) {
  return (
    <ProgressPrimitive.Root
      style={(state) => [
        styles.root,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {children}
      <ProgressTrack style={trackStyle}>
        <ProgressIndicator style={indicatorStyle} />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({
  style,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Track>) {
  const { colors } = useTheme()
  return (
    <ProgressPrimitive.Track
      style={(state) => [
        styles.track,
        { backgroundColor: colors.muted },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function ProgressIndicator({
  style,
  ...props
}: Omit<React.ComponentProps<typeof ProgressPrimitive.Indicator>, "render">) {
  const { colors } = useTheme()
  const { percentage } = ProgressPrimitive.useRootContext()
  const target = Math.min(Math.max(percentage ?? 0, 0), 100)
  const progress = useSharedValue(target)

  React.useEffect(() => {
    progress.value = withSpring(target, { overshootClamping: true })
  }, [progress, target])

  const indicator = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }))

  return (
    <ProgressPrimitive.Indicator
      style={(state) => [
        styles.indicator,
        { backgroundColor: colors.primary },
        typeof style === "function" ? style(state) : style,
      ]}
      render={<Animated.View style={indicator} />}
      {...props}
    />
  )
}

function ProgressLabel({
  style,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Label>) {
  const { colors } = useTheme()
  return (
    <ProgressPrimitive.Label
      style={(state) => [
        styles.label,
        { color: colors.foreground },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function ProgressValue({
  style,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Value>) {
  const { colors } = useTheme()
  return (
    <ProgressPrimitive.Value
      style={(state) => [
        styles.value,
        { color: colors.mutedForeground },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
}
