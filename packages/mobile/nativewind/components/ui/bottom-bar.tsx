import { cn } from "cn"
import * as React from "react"
import { View, type ViewProps } from "react-native"
import {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useKeyboard } from "@/components/primitives/keyboard"
import { AnimatedView } from "@/components/ui/animated-view"
import { ScreenContext } from "@/components/ui/screen"

const EASING = Easing.bezier(0.17, 0.59, 0.4, 0.77)

function BottomBar({
  separator = false,
  className,
  style,
  ...props
}: ViewProps & {
  separator?: boolean
}) {
  const insets = useSafeAreaInsets()
  const screen = React.useContext(ScreenContext)
  const keyboard = useKeyboard()
  const consumed = screen?.edges.includes("bottom") ? insets.bottom : 0
  const target = Math.max(
    0,
    (keyboard.height > 0 ? keyboard.height : insets.bottom) - consumed
  )
  const padding = useSharedValue(target)

  React.useEffect(() => {
    padding.value = withTiming(target, {
      duration: keyboard.duration,
      easing: EASING,
      reduceMotion: ReduceMotion.System,
    })
  }, [target, keyboard.duration, padding])

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: padding.value,
  }))

  return (
    <AnimatedView
      className={cn(
        "bg-background",
        separator && "border-t border-border",
        className
      )}
      style={[animatedStyle, style]}
      {...props}
    />
  )
}

function BottomBarContent({ className, ...props }: ViewProps) {
  return <View className={cn("gap-2 px-4 py-3", className)} {...props} />
}

export { BottomBar, BottomBarContent }
