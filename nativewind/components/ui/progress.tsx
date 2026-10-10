import * as ProgressPrimitive from "@rn-primitives/progress"
import { cn } from "cn"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated"

function Progress({
  className,
  value,
  indicatorClassName,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string
}) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-3 w-full flex-row items-center overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <Indicator value={value} className={indicatorClassName} />
    </ProgressPrimitive.Root>
  )
}

export { Progress }

type IndicatorProps = {
  value: number | undefined | null
  className?: string
}

function Indicator({ value, className }: IndicatorProps) {
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
        style={indicator}
        className={cn("h-full bg-primary", className)}
      />
    </ProgressPrimitive.Indicator>
  )
}
