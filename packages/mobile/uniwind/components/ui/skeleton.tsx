import { cn } from "cn"
import * as React from "react"
import type { View } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

const duration = 1000

function Skeleton({
  className,
  style,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>>) {
  const sv = useSharedValue(1)

  React.useEffect(() => {
    sv.value = withRepeat(withTiming(0.5, { duration }), -1, true)
  }, [sv])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: sv.value,
  }))
  return (
    <Animated.View
      {...props}
      style={[style, animatedStyle]}
      className={cn("rounded-md bg-muted", className)}
    />
  )
}

export { Skeleton }
