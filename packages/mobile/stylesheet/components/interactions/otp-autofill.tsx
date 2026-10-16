import * as React from "react"
import {
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextInput,
  View,
  type ViewStyle,
} from "react-native"
import {
  Easing,
  Keyframe,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useKeyboard } from "@/components/primitives/keyboard"
import { Portal } from "@/components/primitives/portal"
import { AnimatedView } from "@/components/ui/animated-view"
import {
  InputOTP,
  InputOTPSlotStyleContext,
  type InputOTPSlotStyles,
} from "@/components/ui/input-otp"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  palette,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type OtpAutofillState =
  | "idle"
  | "filling"
  | "verifying"
  | "verified"
  | "invalid"

type OtpAutofillContextProps = {
  state: OtpAutofillState
  value: string
  focused: boolean
  maxLength: number
  inputRef: React.RefObject<React.ComponentRef<typeof TextInput> | null>
  fill: (code: string) => void
  type: (value: string) => void
  setFocused: (focused: boolean) => void
}

const OtpAutofillContext = React.createContext<OtpAutofillContextProps | null>(
  null
)

function useOtpAutofill() {
  const context = React.useContext(OtpAutofillContext)

  if (!context) {
    throw new Error("useOtpAutofill must be used within an <OtpAutofill />")
  }

  return context
}

const FILL_INTERVAL = 70
const INVALID_HOLD = 600
const SHAKE_STEP = 400 / 5

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

const ENTERING = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 8 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }], easing: EASING },
})
  .duration(300)
  .reduceMotion(ReduceMotion.System)

const EXITING = new Keyframe({
  0: { opacity: 1, transform: [{ translateY: 0 }] },
  100: { opacity: 0, transform: [{ translateY: 8 }], easing: EASING },
})
  .duration(300)
  .reduceMotion(ReduceMotion.System)

const styles = StyleSheet.create({
  root: { alignItems: "center", gap: 16 },
  frame: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 50,
    borderTopWidth: 1,
  },
  suggestion: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
  },
  source: { ...fontSize.xs },
  code: {
    ...fontSize.base,
    fontWeight: "600",
    letterSpacing: 0.85,
    fontVariant: ["tabular-nums"],
  },
})

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function slotStyles(
  state: OtpAutofillState,
  colors: ThemeColors,
  isDark: boolean
): InputOTPSlotStyles | undefined {
  switch (state) {
    case "invalid":
      return {
        style: {
          borderColor: colors.destructive,
          backgroundColor: withAlpha(colors.destructive, isDark ? 0.1 : 0.05),
        },
        textStyle: { color: colors.destructive },
      }
    case "verified":
      return {
        style: {
          borderColor: palette.green500,
          backgroundColor: withAlpha(palette.green500, isDark ? 0.2 : 0.1),
        },
        textStyle: { color: isDark ? palette.green400 : palette.green600 },
      }
    case "verifying":
      return { style: { opacity: 0.6 } }
    default:
      return undefined
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function OtpAutofill({
  maxLength,
  onVerify,
  style,
  ...props
}: React.ComponentProps<typeof View> & {
  maxLength: number
  onVerify: (code: string) => Promise<boolean> | boolean
}) {
  const [value, setValue] = React.useState("")
  const [state, setState] = React.useState<OtpAutofillState>("idle")
  const [focused, setFocused] = React.useState(false)
  const inputRef = React.useRef<React.ComponentRef<typeof TextInput>>(null)
  const runRef = React.useRef(0)
  const onVerifyRef = React.useRef(onVerify)

  React.useEffect(() => {
    onVerifyRef.current = onVerify
  }, [onVerify])

  const verify = React.useCallback(async (code: string, run: number) => {
    setState("verifying")
    let valid = false
    try {
      valid = await onVerifyRef.current(code)
    } catch {
      valid = false
    }
    if (run !== runRef.current) return
    if (valid) {
      setState("verified")
      return
    }
    setState("invalid")
    await wait(INVALID_HOLD)
    if (run !== runRef.current) return
    setValue("")
    setState("idle")
    inputRef.current?.focus()
  }, [])

  const fill = React.useCallback(
    async (code: string) => {
      const digits = code.replace(/\s/g, "").slice(0, maxLength)
      if (!digits) return
      runRef.current += 1
      const run = runRef.current
      setState("filling")
      for (let index = 1; index <= digits.length; index += 1) {
        setValue(digits.slice(0, index))
        await wait(FILL_INTERVAL)
        if (run !== runRef.current) return
      }
      if (digits.length === maxLength) verify(digits, run)
      else setState("idle")
    },
    [maxLength, verify]
  )

  const type = React.useCallback(
    (next: string) => {
      if (next.length - value.length > 1) {
        fill(next)
        return
      }
      runRef.current += 1
      setState("idle")
      setValue(next)
      if (next.length === maxLength) verify(next, runRef.current)
    },
    [value, maxLength, fill, verify]
  )

  const context = React.useMemo(
    () => ({
      state,
      value,
      focused,
      maxLength,
      inputRef,
      fill,
      type,
      setFocused,
    }),
    [state, value, focused, maxLength, fill, type]
  )

  return (
    <OtpAutofillContext.Provider value={context}>
      <View style={[styles.root, style]} {...props} />
    </OtpAutofillContext.Provider>
  )
}

function OtpAutofillInput({
  containerStyle,
  accessibilityLabel,
  inputProps,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof InputOTP>,
  | "length"
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "readOnly"
  | "inputRef"
  | "children"
> & {
  containerStyle?: StyleProp<ViewStyle>
  children: React.ReactNode
}) {
  const { colors, isDark } = useTheme()
  const { state, value, maxLength, inputRef, type, setFocused } =
    useOtpAutofill()
  const offset = useSharedValue(0)
  const locked =
    state === "filling" || state === "verifying" || state === "verified"

  React.useEffect(() => {
    if (state !== "invalid") return
    const step = { duration: SHAKE_STEP, reduceMotion: ReduceMotion.System }
    offset.value = withSequence(
      withTiming(-8, step),
      withTiming(7, step),
      withTiming(-5, step),
      withTiming(3, step),
      withTiming(0, step)
    )
  }, [state, offset])

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  return (
    <AnimatedView style={[containerStyle, shakeStyle]}>
      <InputOTPSlotStyleContext.Provider
        value={slotStyles(state, colors, isDark)}
      >
        <InputOTP
          {...props}
          length={maxLength}
          value={value}
          readOnly={locked}
          inputRef={inputRef}
          inputProps={{
            textContentType: "oneTimeCode",
            autoComplete: Platform.OS === "ios" ? "one-time-code" : "sms-otp",
            ...inputProps,
            ...(accessibilityLabel ? { accessibilityLabel } : null),
            onFocus: (event) => {
              setFocused(true)
              inputProps?.onFocus?.(event)
            },
            onBlur: (event) => {
              setFocused(false)
              inputProps?.onBlur?.(event)
            },
          }}
          onValueChange={(next) => {
            if (!locked) type(next)
          }}
        >
          {children}
        </InputOTP>
      </InputOTPSlotStyleContext.Provider>
    </AnimatedView>
  )
}

function OtpAutofillSuggestion({
  code,
  source = "From Messages",
  portalHost,
  style,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children" | "onPress"> & {
  code: string | null | undefined
  source?: React.ReactNode
  portalHost?: string
}) {
  const { colors, isDark } = useTheme()
  const context = useOtpAutofill()
  const { state, value, focused, fill } = context
  const keyboard = useKeyboard()
  const insets = useSafeAreaInsets()
  const id = React.useId()
  const open = Boolean(code) && focused && value === "" && state === "idle"

  return (
    <Portal name={`otp-autofill-${id}`} hostName={portalHost}>
      {open ? (
        <OtpAutofillContext.Provider value={context}>
          <AnimatedView
            entering={ENTERING}
            exiting={EXITING}
            style={[
              styles.frame,
              {
                bottom: keyboard.height,
                borderTopColor: colors.border,
                backgroundColor: isDark ? colors.muted : colors.popover,
              },
            ]}
          >
            <Pressable
              role="button"
              onPress={() => {
                if (code) fill(code)
              }}
              {...props}
              style={(pressState) => [
                styles.suggestion,
                pressState.pressed && { opacity: 0.8 },
                {
                  paddingBottom:
                    keyboard.height > 0 ? 6 : Math.max(6, insets.bottom),
                },
                typeof style === "function" ? style(pressState) : style,
              ]}
            >
              {typeof source === "string" || typeof source === "number" ? (
                <Text
                  style={[styles.source, { color: colors.mutedForeground }]}
                >
                  {source}
                </Text>
              ) : (
                source
              )}
              <Text style={styles.code}>{code}</Text>
            </Pressable>
          </AnimatedView>
        </OtpAutofillContext.Provider>
      ) : null}
    </Portal>
  )
}

export { OtpAutofill, OtpAutofillInput, OtpAutofillSuggestion, useOtpAutofill }
