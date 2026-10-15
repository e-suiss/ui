import * as React from "react"
import { StyleSheet, type View } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { radius, useTheme } from "@/components/ui/theme"

const duration = 1000

const styles = StyleSheet.create({
  root: { borderRadius: radius.md },
})

function Skeleton({
  style,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>>) {
  const { colors } = useTheme()
  const sv = useSharedValue(1)

  React.useEffect(() => {
    sv.value = withRepeat(withTiming(0.5, { duration }), -1, true)
  }, [sv])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: sv.value,
  }))
  return (
    <Animated.View
      style={[
        styles.root,
        { backgroundColor: colors.muted },
        style,
        animatedStyle,
      ]}
      {...props}
    />
  )
}

export { Skeleton }
