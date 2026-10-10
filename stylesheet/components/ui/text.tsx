import { Slot } from "@rn-primitives/slot"
import * as React from "react"
import {
  Text as RNText,
  type Role,
  StyleSheet,
  type TextStyle,
} from "react-native"
import { fontSize, type ThemeColors, useTheme } from "@/components/ui/theme"

type TextVariant =
  | "default"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "blockquote"
  | "code"
  | "lead"
  | "large"
  | "small"
  | "muted"

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
}

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: "1",
  h2: "2",
  h3: "3",
  h4: "4",
}

const styles = StyleSheet.create({
  default: { ...fontSize.base },
  h1: {
    ...fontSize["4xl"],
    textAlign: "center",
    fontWeight: "800",
    letterSpacing: -0.9,
  },
  h2: {
    ...fontSize["3xl"],
    fontWeight: "600",
    letterSpacing: -0.75,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  h3: { ...fontSize["2xl"], fontWeight: "600", letterSpacing: -0.6 },
  h4: { ...fontSize.xl, fontWeight: "600", letterSpacing: -0.5 },
  p: { ...fontSize.base, lineHeight: 28, marginTop: 12 },
  blockquote: {
    ...fontSize.base,
    marginTop: 16,
    borderLeftWidth: 2,
    paddingLeft: 12,
    fontStyle: "italic",
  },
  code: {
    ...fontSize.sm,
    fontFamily: "Menlo",
    fontWeight: "600",
    borderRadius: 4,
    paddingHorizontal: 4.8,
    paddingVertical: 3.2,
  },
  lead: { ...fontSize.xl },
  large: { ...fontSize.lg, fontWeight: "600" },
  small: { ...fontSize.sm, fontWeight: "500", lineHeight: 14 },
  muted: { ...fontSize.sm },
})

function variantColors(variant: TextVariant, colors: ThemeColors): TextStyle {
  switch (variant) {
    case "h2":
      return { color: colors.foreground, borderColor: colors.border }
    case "code":
      return { color: colors.foreground, backgroundColor: colors.muted }
    case "lead":
    case "muted":
      return { color: colors.mutedForeground }
    default:
      return { color: colors.foreground }
  }
}

const TextStyleContext = React.createContext<TextStyle | undefined>(undefined)

function Text({
  style,
  asChild = false,
  variant = "default",
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<typeof RNText> & {
    asChild?: boolean
    variant?: TextVariant
  }) {
  const { colors } = useTheme()
  const inherited = React.useContext(TextStyleContext)
  const Component = asChild ? Slot : RNText
  return (
    <Component
      style={[
        styles[variant],
        variantColors(variant, colors),
        inherited,
        style,
      ]}
      role={ROLE[variant]}
      aria-level={ARIA_LEVEL[variant]}
      {...props}
    />
  )
}

export type { TextVariant }
export { Text, TextStyleContext }
