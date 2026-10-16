import { MinusIcon, PlusIcon } from "phosphor-react-native"
import type * as React from "react"
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import * as NumberFieldPrimitive from "@/components/primitives/number-field"
import { resolveStyle } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import {
  fontSize,
  radius,
  shadow,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "center", gap: 12 },
  input: {
    fontSize: fontSize.base.fontSize,
    height: 32,
    width: 64,
    minWidth: 0,
    borderRadius: radius.md,
    backgroundColor: "transparent",
    paddingHorizontal: 4,
    paddingVertical: 0,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  group: {
    height: 32,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: radius.lg,
    padding: 3,
  },
  button: {
    position: "relative",
    height: "100%",
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  separator: { height: 18, width: 1, flexShrink: 0 },
})

function buttonStyle(
  colors: ThemeColors,
  isDark: boolean,
  disabled: boolean,
  pressed: boolean
): StyleProp<ViewStyle> {
  return [
    isDark
      ? { backgroundColor: colors.border }
      : [{ backgroundColor: colors.card }, shadow.sm],
    pressed && { opacity: 0.8 },
    disabled && { opacity: 0.5 },
  ]
}

function Stepper({
  value,
  defaultValue = 0,
  onValueChange,
  style,
  ...props
}: Omit<
  React.ComponentProps<typeof NumberFieldPrimitive.Root>,
  "value" | "defaultValue" | "onValueChange"
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (
    value: number,
    eventDetails: NumberFieldPrimitive.ChangeEventDetails
  ) => void
}) {
  return (
    <NumberFieldPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next, details) => {
        if (next === null) {
          details.cancel()
          return
        }
        onValueChange?.(next, details)
      }}
      style={(state) => [
        styles.root,
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

function StepperInput({
  style,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Input>) {
  const { colors } = useTheme()
  return (
    <NumberFieldPrimitive.Input
      style={(state) => [
        styles.input,
        { color: colors.foreground },
        state.disabled && { opacity: 0.5 },
        resolveStyle(style, state) as StyleProp<TextStyle>,
      ]}
      cursorColor={colors.primary}
      selectionColor={colors.primary}
      {...props}
    />
  )
}

function StepperGroup({
  style,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Group>) {
  const { colors } = useTheme()
  return (
    <NumberFieldPrimitive.Group
      style={(state) => [
        styles.group,
        { backgroundColor: colors.secondary },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

function StepperDecrement({
  style,
  children,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Decrement>) {
  const { colors, isDark } = useTheme()
  const { canDecrement } = NumberFieldPrimitive.useRootContext()
  return (
    <NumberFieldPrimitive.Decrement
      hitSlop={{ top: 9, bottom: 9 }}
      render={(renderProps, state) => (
        <Pressable
          {...renderProps}
          style={({ pressed }) => [
            styles.button,
            buttonStyle(
              colors,
              isDark,
              state.disabled || !canDecrement,
              pressed
            ),
            resolveStyle(style, state) as StyleProp<ViewStyle>,
          ]}
        />
      )}
      {...props}
    >
      {children ?? (
        <Icon
          as={MinusIcon}
          weight="bold"
          size={16}
          color={colors.foreground}
        />
      )}
    </NumberFieldPrimitive.Decrement>
  )
}

function StepperIncrement({
  style,
  children,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Increment>) {
  const { colors, isDark } = useTheme()
  const { canIncrement } = NumberFieldPrimitive.useRootContext()
  return (
    <NumberFieldPrimitive.Increment
      hitSlop={{ top: 9, bottom: 9 }}
      render={(renderProps, state) => (
        <Pressable
          {...renderProps}
          style={({ pressed }) => [
            styles.button,
            buttonStyle(
              colors,
              isDark,
              state.disabled || !canIncrement,
              pressed
            ),
            resolveStyle(style, state) as StyleProp<ViewStyle>,
          ]}
        />
      )}
      {...props}
    >
      {children ?? (
        <Icon as={PlusIcon} weight="bold" size={16} color={colors.foreground} />
      )}
    </NumberFieldPrimitive.Increment>
  )
}

function StepperSeparator({ style, ...props }: ViewProps) {
  const { colors } = useTheme()
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      style={[styles.separator, { backgroundColor: colors.border }, style]}
      {...props}
    />
  )
}

export {
  Stepper,
  StepperDecrement,
  StepperGroup,
  StepperIncrement,
  StepperInput,
  StepperSeparator,
}
