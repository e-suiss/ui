import type * as React from "react"
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import {
  Toggle as TogglePrimitive,
  type ToggleState,
} from "@/components/primitives/toggle"
import { resolveStyle } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import {
  fontSize,
  metrics,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type ToggleVariant = "default" | "outline"

type ToggleSize = "default" | "sm" | "lg"

type ToggleVariantProps = {
  variant?: ToggleVariant | null
  size?: ToggleSize | null
}

const sizes = StyleSheet.create({
  default: { height: 36, minWidth: 36, paddingHorizontal: 12 },
  sm: { height: 32, minWidth: 32, paddingHorizontal: 12 },
  lg: { height: 40, minWidth: 40, paddingHorizontal: 16 },
})

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: metrics.radius.toggle,
    backgroundColor: "transparent",
  },
  outline: { borderWidth: 1 },
  scaled: { transform: [{ scale: 0.96 }] },
  icon: { flexShrink: 0 },
})

function toggleStyle(
  { variant, size }: ToggleVariantProps,
  colors: ThemeColors,
  state: ToggleState,
  pressing: boolean
): StyleProp<ViewStyle> {
  return [
    styles.root,
    sizes[size ?? "default"],
    variant === "outline" && [styles.outline, { borderColor: colors.border }],
    state.pressed && { backgroundColor: colors.accent },
    pressing && !state.disabled && [styles.scaled, { opacity: 0.8 }],
    state.disabled && { opacity: 0.5 },
  ]
}

function toggleTextStyle(colors: ThemeColors, state: ToggleState): TextStyle {
  const color = state.pressed ? colors.primary : colors.foreground
  return { ...fontSize.sm, color }
}

function Toggle({
  style,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive> & ToggleVariantProps) {
  const { colors } = useTheme()
  return (
    <TogglePrimitive
      {...props}
      render={(renderProps, state) => (
        <TextStyleContext.Provider value={toggleTextStyle(colors, state)}>
          <Pressable
            {...renderProps}
            style={({ pressed }) => [
              toggleStyle({ variant, size }, colors, state, pressed),
              resolveStyle(style, state) as StyleProp<ViewStyle>,
            ]}
          />
        </TextStyleContext.Provider>
      )}
    />
  )
}

function ToggleIcon({
  style,
  size = 16,
  ...props
}: React.ComponentProps<typeof Icon>) {
  return <Icon size={size} style={[styles.icon, style]} {...props} />
}

export type { ToggleSize, ToggleVariant, ToggleVariantProps }
export { Toggle, ToggleIcon, toggleStyle, toggleTextStyle }
