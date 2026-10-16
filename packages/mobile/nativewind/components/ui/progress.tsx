import { cn } from "cn"
import * as React from "react"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import * as ProgressPrimitive from "@/components/primitives/progress"
import { resolveClassName } from "@/components/primitives/use-render"

function Progress({
  className,
  children,
  trackClassName,
  indicatorClassName,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  trackClassName?: string
  indicatorClassName?: string
}) {
  return (
    <ProgressPrimitive.Root
      className={(state) =>
        cn(
          "w-full flex-row flex-wrap gap-3",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {children}
      <ProgressTrack className={trackClassName}>
        <ProgressIndicator className={indicatorClassName} />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({
  className,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Track>) {
  return (
    <ProgressPrimitive.Track
      className={(state) =>
        cn(
          "relative h-1 w-full flex-row items-center overflow-hidden rounded-full bg-muted",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: Omit<React.ComponentProps<typeof ProgressPrimitive.Indicator>, "render">) {
  const { percentage } = ProgressPrimitive.useRootContext()
  const target = Math.min(Math.max(percentage ?? 0, 0), 100)
  const progress = useSharedValue(target)

  React.useEffect(() => {
    progress.value = withSpring(target, { overshootClamping: true })
  }, [progress, target])

  const indicator = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }))

  return (
    <ProgressPrimitive.Indicator
      className={(state) =>
        cn("h-full bg-primary", resolveClassName(className, state))
      }
      render={<Animated.View style={indicator} />}
      {...props}
    />
  )
}

function ProgressLabel({
  className,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Label>) {
  return (
    <ProgressPrimitive.Label
      className={(state) =>
        cn("text-sm text-foreground", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

function ProgressValue({
  className,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Value>) {
  return (
    <ProgressPrimitive.Value
      className={(state) =>
        cn(
          "ms-auto text-sm text-muted-foreground tabular-nums",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
}
