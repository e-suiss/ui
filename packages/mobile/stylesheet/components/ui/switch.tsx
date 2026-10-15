import * as React from "react"
import { type GestureResponderEvent, StyleSheet } from "react-native"
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import * as SwitchPrimitives from "@/components/primitives/switch"
import { shadow, type ThemeColors, useTheme } from "@/components/ui/theme"

type SwitchSize = "default" | "sm"

const HIT_SLOP = { top: 8, bottom: 8, left: 12, right: 12 }

const THUMB = {
  default: {
    height: 20,
    width: 32,
    pressedWidth: 36,
    travel: 16,
    pressedTravel: 12,
  },
  sm: {
    height: 16,
    width: 26,
    pressedWidth: 30,
    travel: 14,
    pressedTravel: 10,
  },
} satisfies Record<SwitchSize, Record<string, number>>

const TIMING = {
  duration: 200,
  easing: Easing.bezier(0.32, 0.72, 0, 1),
  reduceMotion: ReduceMotion.System,
}

const styles = StyleSheet.create({
  root: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    borderWidth: 2,
  },
  default: { height: 24, width: 52 },
  sm: { height: 20, width: 44 },
  thumb: { borderRadius: 9999, ...shadow.sm },
})

function trackColors(checked: boolean, disabled: boolean, colors: ThemeColors) {
  if (!checked) {
    return {
      borderColor: "transparent",
      backgroundColor: disabled
        ? colors.controlDisabled
        : colors.labelQuaternary,
    }
  }
  if (disabled) {
    return {
      borderColor: "transparent",
      backgroundColor: colors.accentDisabled,
    }
  }
  return { borderColor: colors.accent, backgroundColor: colors.accent }
}

function SwitchThumb({
  size,
  pressed,
}: {
  size: SwitchSize
  pressed: boolean
}) {
  const { colors, isDark } = useTheme()
  const { state } = SwitchPrimitives.useRootContext()
  const metrics = THUMB[size]
  const squeezed = pressed && !state.disabled && !state.readOnly
  const width = squeezed ? metrics.pressedWidth : metrics.width
  let travel = 0
  if (state.checked) travel = squeezed ? metrics.pressedTravel : metrics.travel
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(width, TIMING),
    transform: [{ translateX: withTiming(travel, TIMING) }],
  }))
  return (
    <SwitchPrimitives.Thumb
      style={[
        styles.thumb,
        {
          height: metrics.height,
          backgroundColor: isDark ? colors.label : colors.surface,
        },
      ]}
      render={<Animated.View style={animatedStyle} />}
    />
  )
}

function Switch({
  style,
  size = "default",
  invalid,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root> & {
  size?: SwitchSize
  invalid?: boolean
}) {
  const { colors } = useTheme()
  const [pressed, setPressed] = React.useState(false)
  return (
    <SwitchPrimitives.Root
      style={(state) => [
        styles.root,
        styles[size],
        trackColors(state.checked, state.disabled, colors),
        invalid && !state.disabled && { borderColor: colors.danger },
        typeof style === "function" ? style(state) : style,
      ]}
      hitSlop={HIT_SLOP}
      onPressIn={(event: GestureResponderEvent) => {
        setPressed(true)
        onPressIn?.(event)
      }}
      onPressOut={(event: GestureResponderEvent) => {
        setPressed(false)
        onPressOut?.(event)
      }}
      {...props}
    >
      <SwitchThumb size={size} pressed={pressed} />
    </SwitchPrimitives.Root>
  )
}

export type { SwitchSize }
export { Switch }
