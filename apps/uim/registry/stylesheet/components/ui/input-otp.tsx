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
import * as OTPFieldPrimitive from "@/components/primitives/otp-field"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

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
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  slotActive: { zIndex: 10 },
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

function InputOTP({
  style,
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Root>) {
  return (
    <OTPFieldPrimitive.Root
      style={(state) => [
        styles.root,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
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
        style={[styles.caret, { backgroundColor: colors.accent }, caretStyle]}
      />
    </View>
  )
}

function InputOTPSlot({
  index,
  style,
  ...props
}: Omit<React.ComponentProps<typeof OTPFieldPrimitive.Input>, "children">) {
  const { colors } = useTheme()
  const { disabled } = OTPFieldPrimitive.useRootContext().state
  const slotStyles = React.useContext(InputOTPSlotStyleContext)
  return (
    <OTPFieldPrimitive.Input
      index={index}
      style={(state) => [
        styles.slot,
        {
          backgroundColor: state.disabled
            ? colors.controlDisabled
            : colors.control,
        },
        state.active && [styles.slotActive, { borderColor: colors.accent }],
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
                color: disabled ? colors.labelQuaternary : colors.label,
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
      color={disabled ? colors.labelQuaternary : colors.label}
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
