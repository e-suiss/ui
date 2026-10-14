import { StyleSheet, type TextStyle, View, type ViewStyle } from "react-native"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"
import { IconSizeContext } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link"

const styles = StyleSheet.create({
  root: {
    height: 20,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "transparent",
  },
  padded: { paddingHorizontal: 8 },
})

function badgeStyle(variant: BadgeVariant, colors: ThemeColors): ViewStyle {
  switch (variant) {
    case "outline":
      return { ...styles.padded, borderColor: colors.separator }
    case "ghost":
      return styles.padded
    default:
      return {}
  }
}

function badgeTextStyle(variant: BadgeVariant, colors: ThemeColors): TextStyle {
  const color =
    variant === "secondary"
      ? colors.labelSecondary
      : variant === "destructive"
        ? colors.danger
        : variant === "outline" || variant === "ghost"
          ? colors.label
          : colors.link
  return { ...fontSize.xs, fontWeight: "600", color }
}

type BadgeProps = React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    render?: RenderProp<Record<string, unknown>, Record<string, never>>
    variant?: BadgeVariant
  }

function Badge({ style, variant = "default", render, ...props }: BadgeProps) {
  const { colors } = useTheme()
  const element = useRender({
    defaultComponent: View,
    render,
    props: [
      { style: [styles.root, badgeStyle(variant, colors), style] },
      props,
    ],
  })
  return (
    <TextStyleContext.Provider value={badgeTextStyle(variant, colors)}>
      <IconSizeContext.Provider value={12}>{element}</IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

export type { BadgeProps, BadgeVariant }
export { Badge, badgeStyle, badgeTextStyle }
