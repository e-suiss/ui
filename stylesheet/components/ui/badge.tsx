import { StyleSheet, type TextStyle, View, type ViewStyle } from "react-native"
import { Slot } from "@/components/primitives/slot"
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
    asChild?: boolean
    variant?: BadgeVariant
  }

function Badge({ style, variant = "default", asChild, ...props }: BadgeProps) {
  const { colors } = useTheme()
  const Component = asChild ? Slot : View
  return (
    <TextStyleContext.Provider value={badgeTextStyle(variant, colors)}>
      <Component
        style={[styles.root, badgeStyle(variant, colors), style]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

export type { BadgeProps, BadgeVariant }
export { Badge, badgeStyle, badgeTextStyle }
