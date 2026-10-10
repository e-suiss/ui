import {
  Pressable,
  type PressableStateCallbackType,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, type ThemeColors, useTheme } from "@/components/ui/theme"

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"

type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg"

const sizes = StyleSheet.create({
  default: { height: 36, gap: 6, paddingHorizontal: 12 },
  xs: { height: 24, gap: 4, paddingHorizontal: 10 },
  sm: { height: 32, gap: 4, paddingHorizontal: 12 },
  lg: { height: 40, gap: 6, paddingHorizontal: 16 },
  icon: { width: 36, height: 36 },
  "icon-xs": { width: 24, height: 24 },
  "icon-sm": { width: 32, height: 32 },
  "icon-lg": { width: 40, height: 40 },
})

const styles = StyleSheet.create({
  root: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "transparent",
  },
  disabled: { opacity: 0.5 },
})

function buttonColors(
  variant: ButtonVariant,
  colors: ThemeColors,
  isDark: boolean,
  pressed: boolean
): ViewStyle {
  switch (variant) {
    case "default":
      return {
        backgroundColor: colors.primary,
        opacity: pressed ? 0.8 : 1,
      }
    case "outline":
      return {
        borderColor: colors.border,
        backgroundColor: pressed
          ? isDark
            ? colors.inputSubtle
            : colors.muted
          : isDark
            ? "transparent"
            : colors.background,
      }
    case "secondary":
      return {
        backgroundColor: colors.secondary,
        opacity: pressed ? 0.8 : 1,
      }
    case "ghost":
      return { backgroundColor: pressed ? colors.muted : "transparent" }
    case "destructive":
      return {
        backgroundColor: pressed
          ? colors.destructivePressed
          : colors.destructiveSubtle,
      }
    case "link":
      return {}
  }
}

function buttonTextStyle(
  variant: ButtonVariant,
  size: ButtonSize,
  colors: ThemeColors
): TextStyle {
  const scale = size === "xs" || size === "icon-xs" ? fontSize.xs : fontSize.sm
  const color =
    variant === "default"
      ? colors.primaryForeground
      : variant === "destructive"
        ? colors.destructive
        : variant === "link"
          ? colors.primary
          : variant === "secondary"
            ? colors.secondaryForeground
            : colors.foreground
  return { ...scale, fontWeight: "500", color }
}

type ButtonProps = Omit<React.ComponentProps<typeof Pressable>, "style"> &
  React.RefAttributes<typeof Pressable> & {
    variant?: ButtonVariant
    size?: ButtonSize
    style?:
      | StyleProp<ViewStyle>
      | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
  }

function Button({
  variant = "default",
  size = "default",
  style,
  disabled,
  ...props
}: ButtonProps) {
  const { colors, isDark } = useTheme()
  return (
    <TextStyleContext.Provider value={buttonTextStyle(variant, size, colors)}>
      <Pressable
        role="button"
        disabled={disabled}
        style={(state) => [
          styles.root,
          sizes[size],
          buttonColors(variant, colors, isDark, state.pressed),
          disabled && styles.disabled,
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

export type { ButtonProps, ButtonSize, ButtonVariant }
export { Button, buttonTextStyle }
