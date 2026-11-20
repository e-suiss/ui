import { MinusIcon } from "phosphor-react-native"
import * as React from "react"
import { StyleSheet, type TextStyle, View, type ViewStyle } from "react-native"
import Animated, {
  cancelAnimation,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useFieldRootContext } from "@/components/primitives/field"
import * as OTPFieldPrimitive from "@/components/primitives/otp-field"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { fontSize, metrics, useTheme } from "@/components/ui/theme"

type InputOTPSlotStyles = {
  style?: ViewStyle
  textStyle?: TextStyle
}

const InputOTPSlotStyleContext = React.createContext<
  InputOTPSlotStyles | undefined
>(undefined)

const styles = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "center", gap: 8 },
  group: { flexDirection: "row", alignItems: "center", gap: 8 },
  slot: {
    position: "relative",
    height: 52,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: metrics.radius.input,
    borderWidth: 1,
  },
  slotActive: { zIndex: 10 },
  slotInvalid: { borderWidth: 1.5 },
  char: { ...fontSize.xl, fontWeight: "600", fontVariant: ["tabular-nums"] },
  caretContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  caret: { height: 24, width: 2, borderRadius: 9999 },
  separator: { alignItems: "center" },
})

const InputOTPInvalidContext = React.createContext(false)

function ring(color: string) {
  return {
    boxShadow: [{ offsetX: 0, offsetY: 0, spreadDistance: 1, color }],
  }
}

function InputOTP({
  style,
  invalid,
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Root> & {
  invalid?: boolean
}) {
  const field = useFieldRootContext()
  const isInvalid = invalid ?? field.state.invalid
  return (
    <InputOTPInvalidContext.Provider value={isInvalid}>
      <OTPFieldPrimitive.Root
        style={(state) => [
          styles.root,
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      />
    </InputOTPInvalidContext.Provider>
  )
}

function InputOTPGroup({ style, ...props }: React.ComponentProps<typeof View>) {
  return <View style={[styles.group, style]} {...props} />
}

function InputOTPCaret() {
  const { colors } = useTheme()
  const opacity = useSharedValue(1)

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 200 }),
        withDelay(300, withTiming(1, { duration: 200 })),
        withDelay(300, withTiming(1, { duration: 0 }))
      ),
      -1,
      false,
      undefined,
      ReduceMotion.System
    )
    return () => cancelAnimation(opacity)
  }, [opacity])

  const caretStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <View pointerEvents="none" style={styles.caretContainer}>
      <Animated.View
        style={[styles.caret, { backgroundColor: colors.primary }, caretStyle]}
      />
    </View>
  )
}

function InputOTPSlot({
  index,
  style,
  ...props
}: Omit<React.ComponentProps<typeof OTPFieldPrimitive.Input>, "children">) {
  const { colors, isDark } = useTheme()
  const slotStyles = React.useContext(InputOTPSlotStyleContext)
  const invalid = React.useContext(InputOTPInvalidContext)
  return (
    <OTPFieldPrimitive.Input
      index={index}
      style={(state) => [
        styles.slot,
        {
          backgroundColor: isDark
            ? `${colors.foreground}0f`
            : colors.background,
          borderColor: colors.border,
        },
        state.disabled && { opacity: 0.5 },
        state.active && [
          styles.slotActive,
          { borderColor: colors.ring, ...ring(colors.ring) },
        ],
        invalid && [
          styles.slotInvalid,
          {
            borderColor: colors.destructive,
            backgroundColor: `${colors.destructive}${isDark ? "1a" : "0d"}`,
          },
          state.active && { boxShadow: [] },
        ],
        slotStyles?.style,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {(slot) => (
        <>
          <Text
            style={[
              styles.char,
              {
                color: colors.foreground,
              },
              slotStyles?.textStyle,
            ]}
          >
            {slot.char}
          </Text>
          {slot.hasFakeCaret ? <InputOTPCaret /> : null}
        </>
      )}
    </OTPFieldPrimitive.Input>
  )
}

function InputOTPSeparator({
  style,
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Separator>) {
  return (
    <OTPFieldPrimitive.Separator
      style={(state) => [
        styles.separator,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <OTPSeparatorIcon />
    </OTPFieldPrimitive.Separator>
  )
}

function OTPSeparatorIcon() {
  const { colors } = useTheme()
  const { disabled } = OTPFieldPrimitive.useRootContext().state
  return (
    <Icon
      as={MinusIcon}
      size={16}
      color={colors.foreground}
      style={disabled && { opacity: 0.5 }}
    />
  )
}

export type { InputOTPSlotStyles }
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  InputOTPSlotStyleContext,
}
