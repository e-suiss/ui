import * as RadioGroupPrimitive from "@rn-primitives/radio-group"
import { type PressableStateCallbackType, StyleSheet, View } from "react-native"
import { useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: { gap: 12 },
  item: {
    aspectRatio: 1,
    width: 16,
    height: 16,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "transparent",
  },
  disabled: { opacity: 0.5 },
  indicator: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
  dot: { width: 8, height: 8, borderRadius: 9999 },
  dotDark: { width: 10, height: 10 },
})

function RadioGroup({
  style,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root style={[styles.root, style]} {...props} />
}

function RadioGroupItem({
  style,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const { colors, isDark } = useTheme()
  return (
    <RadioGroupPrimitive.Item
      style={(state: PressableStateCallbackType) => [
        styles.item,
        { backgroundColor: colors.inputStrong },
        props.disabled && styles.disabled,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        style={[styles.indicator, { backgroundColor: colors.primary }]}
      >
        <View
          style={[
            styles.dot,
            isDark && styles.dotDark,
            { backgroundColor: colors.primaryForeground },
          ]}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
