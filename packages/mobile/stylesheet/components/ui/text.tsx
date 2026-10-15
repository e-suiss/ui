import * as React from "react"
import {
  Text as RNText,
  type Role,
  StyleSheet,
  type TextStyle,
} from "react-native"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

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

const styles = StyleSheet.create({
  default: { ...fontSize.base },
  h1: { ...fontSize["3xl"], fontWeight: "700" },
  h2: { ...fontSize["2xl"], fontWeight: "700" },
  h3: { ...fontSize.xl, fontWeight: "600" },
  h4: { ...fontSize.lg, fontWeight: "600" },
  p: { ...fontSize.base, marginTop: 12 },
  blockquote: {
    ...fontSize.base,
    marginTop: 16,
    borderStartWidth: 2,
    paddingStart: 12,
    fontStyle: "italic",
  },
  code: {
    ...fontSize.sm,
    fontFamily: "Menlo",
    fontWeight: "600",
    borderRadius: radius.sm,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  lead: { ...fontSize.lg },
  large: { ...fontSize.lg, fontWeight: "600" },
  small: { ...fontSize.sm, fontWeight: "500" },
  muted: { ...fontSize.sm },
})

function variantColors(variant: TextVariant, colors: ThemeColors): TextStyle {
  switch (variant) {
    case "blockquote":
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
  render,
  variant = "default",
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<React.ComponentRef<typeof RNText>> & {
    render?: RenderProp<Record<string, unknown>, Record<string, never>>
    variant?: TextVariant
  }) {
  const { colors } = useTheme()
  const inherited = React.useContext(TextStyleContext)
  return useRender({
    defaultComponent: RNText,
    render,
    props: [
      {
        style: [
          styles[variant],
          variantColors(variant, colors),
          inherited,
          style,
        ],
        role: ROLE[variant],
      },
      props,
    ],
  })
}

export type { TextVariant }
export { Text, TextStyleContext }
