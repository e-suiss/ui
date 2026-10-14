import { Pressable } from "react-native"
import Animated from "react-native-reanimated"

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type AnimatedViewProps =
  | (React.ComponentProps<typeof Animated.View> &
      React.RefAttributes<typeof Animated.View> & { as?: "View" })
  | (React.ComponentProps<typeof AnimatedPressable> &
      React.RefAttributes<typeof AnimatedPressable> & { as: "Pressable" })

function AnimatedView(props: AnimatedViewProps) {
  if (props.as === "Pressable") {
    return <AnimatedPressable {...props} />
  }
  return <Animated.View {...props} />
}

export { AnimatedView }
