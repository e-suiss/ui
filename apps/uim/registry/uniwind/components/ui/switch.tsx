import { cn } from "cn"
import * as React from "react"
import type { GestureResponderEvent } from "react-native"
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated"
import * as SwitchPrimitives from "@/components/primitives/switch"
import { resolveClassName } from "@/components/primitives/use-render"

type SwitchSize = "default" | "sm"

const HIT_SLOP = { top: 8, bottom: 8, left: 12, right: 12 }

const THUMB = {
  default: { width: 32, pressedWidth: 36, travel: 16, pressedTravel: 12 },
  sm: { width: 26, pressedWidth: 30, travel: 14, pressedTravel: 10 },
} satisfies Record<SwitchSize, Record<string, number>>

const TIMING = {
  duration: 200,
  easing: Easing.bezier(0.32, 0.72, 0, 1),
  reduceMotion: ReduceMotion.System,
}

function SwitchThumb({
  size,
  pressed,
}: {
  size: SwitchSize
  pressed: boolean
}) {
  const { state } = SwitchPrimitives.useRootContext()
  const metrics = THUMB[size]
  const squeezed = pressed && !state.disabled && !state.readOnly
  const width = squeezed ? metrics.pressedWidth : metrics.width
  const travel = state.checked
    ? squeezed
      ? metrics.pressedTravel
      : metrics.travel
    : 0
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(width, TIMING),
    transform: [{ translateX: withTiming(travel, TIMING) }],
  }))
  return (
    <SwitchPrimitives.Thumb
      className={cn(
        "rounded-full bg-surface shadow-sm dark:bg-label",
        size === "sm" ? "h-4" : "h-5"
      )}
      render={<Animated.View style={animatedStyle} />}
    />
  )
}

function Switch({
  className,
  size = "default",
  invalid,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root> & {
  size?: SwitchSize
  invalid?: boolean
}) {
  const [pressed, setPressed] = React.useState(false)
  return (
    <SwitchPrimitives.Root
      className={(state) =>
        cn(
          "shrink-0 flex-row items-center rounded-full border-2",
          size === "sm" ? "h-5 w-11" : "h-6 w-13",
          state.checked
            ? state.disabled
              ? "border-transparent bg-accent-disabled"
              : "border-accent bg-accent"
            : state.disabled
              ? "border-transparent bg-control-disabled"
              : "border-transparent bg-label-quaternary",
          invalid && !state.disabled && "border-danger",
          resolveClassName(className, state)
        )
      }
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
