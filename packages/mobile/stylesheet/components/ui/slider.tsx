import { StyleSheet, type ViewStyle } from "react-native"
import * as SliderPrimitive from "@/components/primitives/slider"
import { shadow, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  rootHorizontal: { width: "100%" },
  rootVertical: { height: "100%" },
  controlHorizontal: {
    position: "relative",
    height: 32,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  controlVertical: {
    position: "relative",
    height: "100%",
    minHeight: 160,
    width: 32,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    position: "relative",
    flexGrow: 1,
    overflow: "hidden",
    borderRadius: 9999,
  },
  trackHorizontal: { height: 4, width: "100%" },
  trackVertical: { height: "100%", width: 4 },
  indicator: { borderRadius: 9999 },
  thumb: {
    borderRadius: 9999,
    borderWidth: 1,
    ...shadow.md,
  },
  thumbHorizontal: { height: 20, width: 32 },
  thumbHorizontalActive: { height: 20, width: 36 },
  thumbVertical: { height: 32, width: 20 },
  thumbVerticalActive: { height: 36, width: 20 },
  thumbDisabled: { boxShadow: [] },
})

function thumbIndexes(
  value: SliderPrimitive.SliderValue | undefined,
  defaultValue: SliderPrimitive.SliderValue | undefined
) {
  const source = Array.isArray(value) ? value : defaultValue
  const count = Array.isArray(source) ? source.length : 1
  return Array.from({ length: count }, (_, index) => index)
}

function Slider<
  Value extends SliderPrimitive.SliderValue = SliderPrimitive.SliderValue,
>({
  style,
  defaultValue,
  value,
  min = 0,
  max = 100,
  accessibilityLabel,
  ...props
}: SliderPrimitive.RootProps<Value>) {
  const { colors, isDark } = useTheme()
  return (
    <SliderPrimitive.Root
      style={(state) => [
        state.orientation === "vertical"
          ? styles.rootVertical
          : styles.rootHorizontal,
        state.disabled && { opacity: 0.5 },
        typeof style === "function" ? style(state) : style,
      ]}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control
        style={(state) =>
          state.orientation === "vertical"
            ? styles.controlVertical
            : styles.controlHorizontal
        }
      >
        <SliderPrimitive.Track
          style={(state) => [
            styles.track,
            state.orientation === "vertical"
              ? styles.trackVertical
              : styles.trackHorizontal,
            { backgroundColor: colors.border },
          ]}
        >
          <SliderPrimitive.Indicator
            style={[styles.indicator, { backgroundColor: colors.primary }]}
          />
        </SliderPrimitive.Track>
        {thumbIndexes(value, defaultValue).map((index) => (
          <SliderPrimitive.Thumb
            key={index}
            index={index}
            getAccessibilityLabel={
              accessibilityLabel ? () => accessibilityLabel : undefined
            }
            style={(state) => {
              const expanded = state.dragging && state.active
              let size: ViewStyle = expanded
                ? styles.thumbHorizontalActive
                : styles.thumbHorizontal
              if (state.orientation === "vertical") {
                size = expanded
                  ? styles.thumbVerticalActive
                  : styles.thumbVertical
              }
              return [
                styles.thumb,
                size,
                {
                  backgroundColor: isDark
                    ? colors.foreground
                    : colors.background,
                  borderColor: `${colors.foreground}1a`,
                },
                state.disabled && styles.thumbDisabled,
              ]
            }}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
