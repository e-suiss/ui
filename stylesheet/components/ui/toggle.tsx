import type * as React from "react"
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import * as TogglePrimitive from "@/components/primitives/toggle"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, type ThemeColors, useTheme } from "@/components/ui/theme"

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
    borderRadius: 26.4,
  },
  outline: { borderWidth: 1 },
  disabled: { opacity: 0.5 },
  icon: { flexShrink: 0 },
})

function toggleStyle(
  { variant, size }: ToggleVariantProps,
  colors: ThemeColors,
  state: { pressed?: boolean; selected?: boolean; disabled?: boolean | null }
): StyleProp<ViewStyle> {
  return [
    styles.root,
    sizes[size ?? "default"],
    variant === "outline" && [styles.outline, { borderColor: colors.input }],
    {
      backgroundColor:
        state.pressed || state.selected ? colors.muted : "transparent",
    },
    state.disabled && styles.disabled,
  ]
}

function toggleTextStyle(colors: ThemeColors): TextStyle {
  return { ...fontSize.sm, fontWeight: "500", color: colors.foreground }
}

function Toggle({
  style,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & ToggleVariantProps) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider value={toggleTextStyle(colors)}>
      <TogglePrimitive.Root
        render={(renderProps, state) => (
          <Pressable
            {...renderProps}
            style={(pressable) => [
              toggleStyle({ variant, size }, colors, {
                pressed: pressable.pressed,
                selected: state.pressed,
                disabled: state.disabled,
              }),
              renderProps.style,
              typeof style === "function" ? style(state) : style,
            ]}
          />
        )}
        {...props}
      />
    </TextStyleContext.Provider>
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
