import * as ProgressPrimitive from "@rn-primitives/progress"
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated"
import { useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    position: "relative",
    height: 12,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 9999,
  },
  indicator: { height: "100%" },
})

function Progress({
  style,
  value,
  indicatorStyle,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorStyle?: StyleProp<ViewStyle>
}) {
  const { colors } = useTheme()
  return (
    <ProgressPrimitive.Root
      style={[styles.root, { backgroundColor: colors.muted }, style]}
      {...props}
    >
      <Indicator value={value} style={indicatorStyle} />
    </ProgressPrimitive.Root>
  )
}

export { Progress }

type IndicatorProps = {
  value: number | undefined | null
  style?: StyleProp<ViewStyle>
}

function Indicator({ value, style }: IndicatorProps) {
  const { colors } = useTheme()
  const progress = useDerivedValue(() => value ?? 0)

  const indicator = useAnimatedStyle(() => {
    return {
      width: withSpring(
        `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
        { overshootClamping: true }
      ),
    }
  })

  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View
        style={[
          styles.indicator,
          { backgroundColor: colors.primary },
          style,
          indicator,
        ]}
      />
    </ProgressPrimitive.Indicator>
  )
}
