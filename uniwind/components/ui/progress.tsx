import { cn } from "cn"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated"
import * as ProgressPrimitive from "@/components/primitives/progress"
import { resolveClassName } from "@/components/primitives/use-render"

function Progress({
  className,
  indicatorClassName,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string
}) {
  return (
    <ProgressPrimitive.Root
      className={(state) =>
        cn(
          "relative h-3 w-full flex-row items-center overflow-hidden rounded-full bg-muted",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      <Indicator className={indicatorClassName} />
    </ProgressPrimitive.Root>
  )
}

export { Progress }

function Indicator({ className }: { className?: string }) {
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
      className={cn("h-full bg-primary", className)}
      render={<Animated.View style={indicator} />}
    />
  )
}
