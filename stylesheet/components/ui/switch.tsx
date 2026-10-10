import { StyleSheet } from "react-native"
import * as SwitchPrimitives from "@/components/primitives/switch"
import { shadow, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    height: 20,
    width: 44,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    borderWidth: 2,
  },
  disabled: { opacity: 0.5 },
  thumb: {
    height: 16,
    width: 24,
    borderRadius: 9999,
    ...shadow.sm,
  },
})

function Switch({
  style,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root>) {
  const { colors, isDark } = useTheme()
  return (
    <SwitchPrimitives.Root
      style={(state) => [
        styles.root,
        props.checked
          ? { borderColor: colors.primary, backgroundColor: colors.primary }
          : { borderColor: "transparent", backgroundColor: colors.inputStrong },
        props.disabled && styles.disabled,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <SwitchPrimitives.Thumb
        style={[
          styles.thumb,
          {
            backgroundColor: isDark
              ? props.checked
                ? colors.primaryForeground
                : colors.foreground
              : colors.background,
            transform: [{ translateX: props.checked ? 16 : 0 }],
          },
        ]}
      />
    </SwitchPrimitives.Root>
  )
}

export { Switch }
