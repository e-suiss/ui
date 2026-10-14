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
        { backgroundColor: colors.control, color: colors.label },
        state.focused && { borderColor: colors.focus },
        state.invalid && {
          borderColor: colors.danger,
          backgroundColor: withAlpha(colors.danger, isDark ? 0.1 : 0.05),
        },
        state.disabled && {
          backgroundColor: colors.controlDisabled,
          color: colors.labelQuaternary,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      placeholderTextColor={
        props.disabled ? colors.labelQuaternary : colors.labelSecondary
      }
      cursorColor={colors.accent}
      selectionColor={colors.accent}
      {...props}
    />
  )
}

export { Input }
