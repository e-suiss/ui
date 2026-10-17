import * as React from "react"
import {
  Pressable,
  type PressableStateCallbackType,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { IconSizeContext } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import {
  fontSize,
  metrics,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "tinted"
  | "ghost"
  | "plain"
  | "destructive"
  | "link"

type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "xl"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg"
  | "icon-xl"

const sizes = StyleSheet.create({
  default: {
    height: metrics.height.button,
    gap: 6,
    paddingHorizontal: metrics.paddingX.button,
  },
  xs: {
    height: metrics.height.buttonXs,
    gap: 4,
    paddingHorizontal: metrics.paddingX.buttonXs,
  },
  sm: {
    height: metrics.height.buttonSm,
    gap: 4,
    paddingHorizontal: metrics.paddingX.buttonSm,
  },
  lg: {
    height: metrics.height.buttonLg,
    gap: 6,
    paddingHorizontal: metrics.paddingX.buttonLg,
  },
  xl: { height: 56, gap: 8, paddingHorizontal: 31 },
  icon: { width: metrics.height.button, height: metrics.height.button },
  "icon-xs": {
    width: metrics.height.buttonXs,
    height: metrics.height.buttonXs,
  },
  "icon-sm": {
    width: metrics.height.buttonSm,
    height: metrics.height.buttonSm,
  },
  "icon-lg": {
    width: metrics.height.buttonLg,
    height: metrics.height.buttonLg,
  },
  "icon-xl": { width: 56, height: 56 },
})

const blockRadius: Partial<Record<ButtonSize, number>> = {
  xs: radius.sm,
  sm: radius.md,
  default: radius.md,
  lg: radius.lg,
  xl: radius.xl,
}

const styles = StyleSheet.create({
  root: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: metrics.radius.button,
    borderWidth: 1,
    borderColor: "transparent",
  },
  block: { width: "100%" },
})

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function buttonColors(
  variant: ButtonVariant,
  colors: ThemeColors,
  isDark: boolean
): ViewStyle {
  switch (variant) {
    case "default":
      return { backgroundColor: colors.primary }
    case "outline":
      return {
        borderColor: colors.border,
        backgroundColor: isDark ? "transparent" : colors.background,
      }
    case "secondary":
      return { backgroundColor: colors.secondary }
    case "tinted":
      return { backgroundColor: withAlpha(colors.primary, isDark ? 0.2 : 0.1) }
    case "destructive":
      return {
        backgroundColor: withAlpha(colors.destructive, isDark ? 0.2 : 0.1),
      }
    default:
      return {}
  }
}

function buttonTextColor(variant: ButtonVariant, colors: ThemeColors) {
  switch (variant) {
    case "default":
      return colors.primaryForeground
    case "secondary":
      return colors.secondaryForeground
    case "tinted":
    case "plain":
    case "link":
      return colors.primary
    case "destructive":
      return colors.destructive
    default:
      return colors.foreground
  }
}

function buttonTextStyle(
  variant: ButtonVariant,
  size: ButtonSize,
  colors: ThemeColors
): TextStyle {
  let scale: TextStyle =
    size === "lg" || size === "xl" ? fontSize.base : fontSize.sm
  if (size === "xs") scale = fontSize.xs
  return {
    ...scale,
    fontWeight: metrics.fontWeight.button,
    color: buttonTextColor(variant, colors),
  }
}

const ButtonStyleContext = React.createContext<
  ((variant: ButtonVariant) => ViewStyle | undefined) | undefined
>(undefined)

type ButtonProps = Omit<React.ComponentProps<typeof Pressable>, "style"> &
  React.RefAttributes<React.ComponentRef<typeof Pressable>> & {
    variant?: ButtonVariant
    size?: ButtonSize
    block?: boolean
    style?:
      | StyleProp<ViewStyle>
      | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
  }

function Button({
  variant = "default",
  size = "default",
  block = false,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const { colors, isDark } = useTheme()
  const isDisabled = Boolean(disabled)
  const blockRadiusValue = block ? blockRadius[size] : undefined
  const groupStyle = React.useContext(ButtonStyleContext)
  return (
    <ButtonStyleContext.Provider value={undefined}>
      <TextStyleContext.Provider value={buttonTextStyle(variant, size, colors)}>
        <IconSizeContext.Provider
          value={size === "xs" || size === "icon-xs" ? 12 : 16}
        >
          <Pressable
            role="button"
            disabled={disabled}
            style={(state) => [
              styles.root,
              sizes[size],
              block && styles.block,
              blockRadiusValue !== undefined && {
                borderRadius: blockRadiusValue,
              },
              buttonColors(variant, colors, isDark),
              state.pressed && !isDisabled && { opacity: 0.8 },
              isDisabled && { opacity: 0.5 },
              groupStyle?.(variant),
              typeof style === "function" ? style(state) : style,
            ]}
            {...props}
          />
        </IconSizeContext.Provider>
      </TextStyleContext.Provider>
    </ButtonStyleContext.Provider>
  )
}

export type { ButtonProps, ButtonSize, ButtonVariant }
export { Button, ButtonStyleContext, buttonTextStyle }
