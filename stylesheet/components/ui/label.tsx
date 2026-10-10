import { StyleSheet } from "react-native"
import * as LabelPrimitive from "@/components/primitives/label"
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
      style={(state) => [styles.root, state.disabled && styles.disabled]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled ?? undefined}
    >
      <LabelPrimitive.Text
        style={(state) => [
          styles.text,
          { color: colors.foreground },
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      />
    </LabelPrimitive.Root>
  )
}

export { Label }
