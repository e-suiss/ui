import { StyleSheet } from "react-native"
import * as InputPrimitive from "@/components/primitives/input"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type InputSize = "sm" | "md" | "default"

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
    height: 44,
    width: "100%",
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  md: { ...fontSize.sm, height: 36 },
  sm: {
    ...fontSize.sm,
    height: 32,
    borderRadius: radius.md,
    paddingHorizontal: 10,
  },
})

function Input({
  style,
  size = "default",
  ...props
}: React.ComponentProps<typeof InputPrimitive.Root> & {
  size?: InputSize
}) {
  const { colors, isDark } = useTheme()
  return (
    <InputPrimitive.Root
      style={(state) => [
        styles.root,
        size === "md" && styles.md,
        size === "sm" && styles.sm,
        { backgroundColor: colors.secondary, color: colors.foreground },
        state.focused && { borderColor: colors.ring },
        state.invalid && {
          borderColor: colors.destructive,
          backgroundColor: withAlpha(colors.destructive, isDark ? 0.1 : 0.05),
        },
        state.disabled && { opacity: 0.5 },
        typeof style === "function" ? style(state) : style,
      ]}
      placeholderTextColor={colors.mutedForeground}
      cursorColor={colors.primary}
      selectionColor={colors.primary}
      {...props}
    />
  )
}

export { Input }
