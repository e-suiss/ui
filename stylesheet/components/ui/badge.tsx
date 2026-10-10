import { StyleSheet, type TextStyle, View, type ViewStyle } from "react-native"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"
import { TextStyleContext } from "@/components/ui/text"
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

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
    borderRadius: radius["3xl"],
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
})

function badgeStyle(variant: BadgeVariant, colors: ThemeColors): ViewStyle {
  switch (variant) {
    case "default":
      return { backgroundColor: colors.primary }
    case "secondary":
      return { backgroundColor: colors.secondary }
    case "destructive":
      return { backgroundColor: colors.destructiveSubtle }
    case "outline":
      return { borderColor: colors.border }
  }
}

function badgeTextStyle(variant: BadgeVariant, colors: ThemeColors): TextStyle {
  const color =
    variant === "default"
      ? colors.primaryForeground
      : variant === "secondary"
        ? colors.secondaryForeground
        : variant === "destructive"
          ? colors.destructive
          : colors.foreground
  return { ...fontSize.xs, fontWeight: "500", color }
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
      {element}
    </TextStyleContext.Provider>
  )
}

export type { BadgeProps, BadgeVariant }
export { Badge, badgeStyle, badgeTextStyle }
