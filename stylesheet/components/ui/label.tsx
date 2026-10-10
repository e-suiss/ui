import * as LabelPrimitive from "@rn-primitives/label"
import { StyleSheet } from "react-native"
import { fontSize, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disabled: { opacity: 0.5 },
  text: { ...fontSize.sm, fontWeight: "500", userSelect: "none" },
})

function Label({
  style,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Text>) {
  const { colors } = useTheme()
  return (
    <LabelPrimitive.Root
      style={StyleSheet.flatten([styles.root, disabled && styles.disabled])}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <LabelPrimitive.Text
        style={[styles.text, { color: colors.foreground }, style]}
        {...props}
      />
    </LabelPrimitive.Root>
  )
}

export { Label }
