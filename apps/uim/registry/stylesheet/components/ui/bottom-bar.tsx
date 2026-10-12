import * as React from "react"
import { StyleSheet, View, type ViewProps } from "react-native"
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
import { useTheme } from "@/components/ui/theme"

const EASING = Easing.bezier(0.17, 0.59, 0.4, 0.77)

const styles = StyleSheet.create({
  separator: { borderTopWidth: 1 },
  content: { gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
})

function BottomBar({
  separator = false,
  style,
  ...props
}: ViewProps & {
  separator?: boolean
}) {
  const { colors } = useTheme()
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
      style={[
        { backgroundColor: colors.surface },
        separator && [styles.separator, { borderColor: colors.separator }],
        animatedStyle,
        style,
      ]}
      {...props}
    />
  )
}

function BottomBarContent({ style, ...props }: ViewProps) {
  return <View style={[styles.content, style]} {...props} />
}

export { BottomBar, BottomBarContent }
