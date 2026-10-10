import {
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native"
import * as RadioPrimitive from "@/components/primitives/radio"
import {
  RadioGroup as RadioGroupPrimitive,
  type RadioGroupProps,
} from "@/components/primitives/radio-group"
import { resolveStyle } from "@/components/primitives/use-render"
import { shadow, type ThemeColors, useTheme } from "@/components/ui/theme"

const HIT_SLOP = { top: 8, bottom: 8, left: 12, right: 12 }

const styles = StyleSheet.create({
  root: { width: "100%", gap: 12 },
  item: {
    aspectRatio: 1,
    width: 16,
    height: 16,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    borderWidth: 1,
  },
  indicator: { alignItems: "center", justifyContent: "center" },
  dot: { width: 8, height: 8, borderRadius: 9999 },
  dotDark: { width: 10, height: 10 },
})

function radioStyle(
  colors: ThemeColors,
  isDark: boolean,
  state: RadioPrimitive.RootState,
  pressed: boolean,
  invalid: boolean | undefined
): ViewStyle {
  if (state.checked) {
    if (state.disabled) {
      return {
        borderColor: "transparent",
        backgroundColor: colors.accentDisabled,
      }
    }
    const color = pressed ? colors.accentPressed : colors.accent
    return { borderColor: color, backgroundColor: color }
  }
  if (state.disabled) {
    return {
      borderColor: isDark ? "transparent" : `${colors.label}1a`,
      backgroundColor: colors.controlDisabled,
    }
  }
  return {
    borderColor: invalid
      ? colors.danger
      : isDark
        ? "transparent"
        : `${colors.label}40`,
    backgroundColor: isDark
      ? colors.labelQuaternary
      : pressed
        ? colors.control
        : colors.surface,
    ...(isDark ? null : shadow.xs),
  }
}

function RadioGroup<Value = string>({
  style,
  ...props
}: RadioGroupProps<Value>) {
  return (
    <RadioGroupPrimitive<Value>
      style={(state) => [
        styles.root,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function RadioGroupItem<Value = string>({
  style,
  invalid,
  ...props
}: RadioPrimitive.RootProps<Value> & { invalid?: boolean }) {
  const { colors, isDark } = useTheme()
  return (
    <RadioPrimitive.Root<Value>
      hitSlop={HIT_SLOP}
      {...props}
      render={(renderProps, state) => (
        <Pressable
          {...renderProps}
          style={({ pressed }) => [
            styles.item,
            radioStyle(colors, isDark, state, pressed, invalid),
            resolveStyle(style, state) as StyleProp<ViewStyle>,
          ]}
        />
      )}
    >
      <RadioPrimitive.Indicator style={styles.indicator}>
        <View
          style={[
            styles.dot,
            isDark && styles.dotDark,
            { backgroundColor: colors.onAccent },
          ]}
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
