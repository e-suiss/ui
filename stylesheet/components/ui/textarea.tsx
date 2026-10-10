import { StyleSheet } from "react-native"
import * as InputPrimitive from "@/components/primitives/input"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

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
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
})

function Textarea({
  style,
  multiline = true,
  numberOfLines = 8,
  ...props
}: React.ComponentProps<typeof InputPrimitive.Root>) {
  const { colors, isDark } = useTheme()
  return (
    <InputPrimitive.Root
      style={(state) => [
        styles.root,
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
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      placeholderTextColor={
        props.disabled ? colors.labelQuaternary : colors.labelSecondary
      }
      cursorColor={colors.accent}
      selectionColor={colors.accent}
      {...props}
    />
  )
}

export { Textarea }
