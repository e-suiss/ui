import { type StyleProp, StyleSheet, type ViewStyle } from "react-native"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated"
import * as ProgressPrimitive from "@/components/primitives/progress"
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
  indicatorStyle,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorStyle?: StyleProp<ViewStyle>
}) {
  const { colors } = useTheme()
  return (
    <ProgressPrimitive.Root
      style={(state) => [
        styles.root,
        { backgroundColor: colors.muted },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <Indicator style={indicatorStyle} />
    </ProgressPrimitive.Root>
  )
}

export { Progress }

function Indicator({ style }: { style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme()
  const { percentage } = ProgressPrimitive.useRootContext()
  const progress = useDerivedValue(() => percentage ?? 0)

  const indicator = useAnimatedStyle(() => {
    return {
      width: withSpring(
        `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
        { overshootClamping: true }
      ),
    }
  })

  return (
    <ProgressPrimitive.Indicator
      style={[styles.indicator, { backgroundColor: colors.primary }, style]}
      render={<Animated.View style={indicator} />}
    />
  )
}
