import type { Icon as PhosphorIcon } from "phosphor-react-native"
import * as React from "react"
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native"
import {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useHaptics } from "@/components/primitives/haptics"
import { useEffectEvent } from "@/components/primitives/hooks"
import { AnimatedView } from "@/components/ui/animated-view"
import { Keypad, type KeypadKeyValue } from "@/components/ui/keypad"
import { radius, useTheme } from "@/components/ui/theme"

const SHAKE_DURATION = 400

const styles = StyleSheet.create({
  root: { alignItems: "center", gap: 40 },
  dots: { flexDirection: "row", alignItems: "center", gap: 16 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
})

function clampLength(length: number) {
  return Math.min(8, Math.max(4, Math.round(length)))
}

function defaultDotsLabel(entered: number, length: number) {
  return `${entered} of ${length} entered`
}

function PinPad({
  length: lengthProp = 6,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onComplete,
  error = false,
  disabled = false,
  onBiometric,
  biometricIcon,
  biometricLabel,
  deleteLabel,
  dotsLabel = defaultDotsLabel,
  style,
  dotsStyle,
  keypadStyle,
  ...props
}: React.ComponentProps<typeof View> & {
  length?: number
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onComplete?: (value: string) => void
  error?: boolean
  disabled?: boolean
  onBiometric?: () => void
  biometricIcon?: PhosphorIcon
  biometricLabel?: string
  deleteLabel?: string
  dotsLabel?: (entered: number, length: number) => string
  dotsStyle?: StyleProp<ViewStyle>
  keypadStyle?: StyleProp<ViewStyle>
}) {
  const { colors } = useTheme()
  const length = clampLength(lengthProp)
  const haptics = useHaptics()
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    defaultValue.replace(/\D/g, "").slice(0, length)
  )
  const isControlled = valueProp !== undefined
  const value = (isControlled ? valueProp : uncontrolled).slice(0, length)
  const valueRef = React.useRef(value)
  valueRef.current = value
  const offset = useSharedValue(0)
  const wasError = React.useRef(error)

  const commit = React.useCallback(
    (next: string) => {
      if (next === valueRef.current) return false
      valueRef.current = next
      if (!isControlled) setUncontrolled(next)
      onValueChange?.(next)
      return true
    },
    [isControlled, onValueChange]
  )

  const onError = useEffectEvent(() => {
    haptics.notification("error")
    const step = {
      duration: SHAKE_DURATION / 6,
      reduceMotion: ReduceMotion.System,
    }
    offset.value = withSequence(
      withTiming(-12, step),
      withTiming(10, step),
      withTiming(-8, step),
      withTiming(6, step),
      withTiming(-3, step),
      withTiming(0, step)
    )
  })

  React.useEffect(() => {
    const previous = wasError.current
    wasError.current = error
    if (!error || previous) return
    onError()
  }, [error, onError])

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  const press = (key: KeypadKeyValue) => {
    if (key === "biometric") {
      onBiometric?.()
      return
    }
    const current = valueRef.current
    if (key === "delete") {
      if (commit(current.slice(0, -1))) haptics.selection()
      return
    }
    if (key === "decimal" || current.length >= length) return
    const next = current + key
    if (!commit(next)) return
    haptics.selection()
    if (next.length === length) onComplete?.(next)
  }

  return (
    <View style={[styles.root, style]} {...props}>
      <AnimatedView
        accessible
        accessibilityLabel={dotsLabel(value.length, length)}
        accessibilityLiveRegion="polite"
        style={[
          styles.dots,
          disabled && { opacity: 0.5 },
          dotsStyle,
          shakeStyle,
        ]}
      >
        {Array.from({ length }, (_, position) => position).map((index) => {
          const filled = index < value.length
          let color = filled ? colors.foreground : colors.input
          if (error) color = colors.destructive
          return (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  borderColor: color,
                  backgroundColor: filled ? color : "transparent",
                },
              ]}
            />
          )
        })}
      </AnimatedView>
      <Keypad
        accessoryKey={onBiometric ? "biometric" : undefined}
        biometricIcon={biometricIcon}
        biometricLabel={biometricLabel}
        deleteLabel={deleteLabel}
        disabled={disabled}
        deleteDisabled={value.length === 0}
        onKeyPress={press}
        style={keypadStyle}
      />
    </View>
  )
}

export { PinPad }
