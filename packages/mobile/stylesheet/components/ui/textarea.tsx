import { StyleSheet } from "react-native"
import * as InputPrimitive from "@/components/primitives/input"
import { fontSize, metrics, useTheme } from "@/components/ui/theme"

type TextareaSize = "default" | "lg"

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const styles = StyleSheet.create({
  root: {
    ...fontSize.base,
    minHeight: 64,
    width: "100%",
    flexDirection: "row",
    borderRadius: metrics.radius.textarea,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  lg: {
    fontSize: 17,
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  invalid: { borderWidth: 1.5 },
})

function Textarea({
  style,
  size = "default",
  multiline = true,
  numberOfLines = 8,
  ...props
}: React.ComponentProps<typeof InputPrimitive.Root> & {
  size?: TextareaSize
}) {
  const { colors, isDark } = useTheme()
  return (
    <InputPrimitive.Root
      style={(state) => [
        styles.root,
        size === "lg" && styles.lg,
        {
          backgroundColor: isDark
            ? withAlpha(colors.foreground, 0.06)
            : colors.background,
          borderColor: colors.border,
          color: colors.foreground,
        },
        state.focused && { borderColor: colors.ring },
        state.invalid && [
          styles.invalid,
          {
            borderColor: colors.destructive,
            backgroundColor: withAlpha(colors.destructive, isDark ? 0.1 : 0.05),
          },
          state.focused && { boxShadow: [] },
        ],
        state.disabled && { opacity: 0.5 },
        typeof style === "function" ? style(state) : style,
      ]}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      placeholderTextColor={colors.mutedForeground}
      cursorColor={colors.primary}
      selectionColor={colors.primary}
      {...props}
    />
  )
}

export { Textarea }
