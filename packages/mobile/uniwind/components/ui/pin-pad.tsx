import { cn } from "cn"
import type { Icon as PhosphorIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
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

const SHAKE_DURATION = 400

function clampLength(length: number) {
  return Math.min(8, Math.max(4, Math.round(length)))
}

function defaultDotsLabel(entered: number, length: number) {
  return `${entered} of ${length} entered`
}

function dotClassName(
  error: boolean | undefined,
  filled: boolean,
  disabled: boolean | undefined
) {
  if (error) return filled ? "border-danger bg-danger" : "border-danger"
  if (filled) {
    return disabled
      ? "border-label-quaternary bg-label-quaternary"
      : "border-label bg-label"
  }
  return disabled ? "border-label-quaternary" : "border-separator-strong"
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
  className,
  dotsClassName,
  keypadClassName,
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
  dotsClassName?: string
  keypadClassName?: string
}) {
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
    <View className={cn("items-center gap-10", className)} {...props}>
      <AnimatedView
        accessible
        accessibilityLabel={dotsLabel(value.length, length)}
        accessibilityLiveRegion="polite"
        className={cn("flex-row items-center gap-4", dotsClassName)}
        style={shakeStyle}
      >
        {Array.from({ length }, (_, position) => position).map((index) => {
          const filled = index < value.length
          return (
            <View
              key={index}
              className={cn(
                "size-3.5 rounded-full border-[1.5px]",
                dotClassName(error, filled, disabled)
              )}
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
        className={keypadClassName}
      />
    </View>
  )
}

export { PinPad }
