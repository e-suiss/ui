import { cn } from "cn"
import {
  CaretLeftIcon,
  CaretRightIcon,
  PauseIcon,
  PlayIcon,
} from "phosphor-react-native"
import * as React from "react"
import { I18nManager, View, type ViewProps } from "react-native"
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import * as CarouselPrimitive from "@/components/primitives/carousel"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

type CarouselApi = CarouselPrimitive.CarouselApi

const CarouselControlsContext = React.createContext(false)

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

const DOT_SIZE = 8

const ACTIVE_DOT_WIDTH = 24

function useCarousel() {
  const context = CarouselPrimitive.useRootContext("useCarousel")
  return {
    api: context.api,
    orientation: context.orientation,
    opts: context.options,
    scrollPrev: context.scrollPrev,
    scrollNext: context.scrollNext,
    scrollTo: context.scrollTo,
    canScrollPrev: context.canScrollPrev,
    canScrollNext: context.canScrollNext,
    selectedIndex: context.selectedIndex,
    scrollSnaps: context.snaps,
    autoplay: context.autoplay,
  }
}

function Carousel({
  className,
  ...props
}: React.ComponentProps<typeof CarouselPrimitive.Root>) {
  return (
    <CarouselPrimitive.Root
      className={(state) => cn("relative", resolveClassName(className, state))}
      {...props}
    />
  )
}

function CarouselContent({
  className,
  ...props
}: React.ComponentProps<typeof CarouselPrimitive.Content>) {
  const { orientation } = useCarousel()
  return (
    <CarouselPrimitive.Viewport>
      <CarouselPrimitive.Content
        className={cn(
          orientation === "horizontal" ? "-ms-4" : "-mt-4",
          className
        )}
        {...props}
      />
    </CarouselPrimitive.Viewport>
  )
}

function CarouselItem({
  className,
  ...props
}: React.ComponentProps<typeof CarouselPrimitive.Item>) {
  const { orientation } = useCarousel()
  return (
    <CarouselPrimitive.Item
      className={(state) =>
        cn(
          orientation === "horizontal" ? "ps-4" : "pt-4",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function CarouselNavButton({
  direction,
  className,
  variant = "secondary",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button> & {
  direction: "previous" | "next"
}) {
  const { orientation } = useCarousel()
  const inControls = React.useContext(CarouselControlsContext)
  const horizontal = orientation === "horizontal"
  const Part =
    direction === "previous"
      ? CarouselPrimitive.Previous
      : CarouselPrimitive.Next
  const button = (
    <Part
      render={
        <Button
          variant={variant}
          size={size}
          className={cn(
            "rounded-full",
            !inControls && !horizontal && "rotate-90",
            className
          )}
          {...props}
        />
      }
    >
      <Icon
        as={direction === "previous" ? CaretLeftIcon : CaretRightIcon}
        mirrored={I18nManager.isRTL}
      />
    </Part>
  )
  if (inControls) return button
  return (
    <View
      className={cn(
        "absolute",
        horizontal
          ? "top-0 bottom-0 justify-center"
          : "right-0 left-0 items-center",
        horizontal && direction === "previous" && "-start-12",
        horizontal && direction === "next" && "-end-12",
        !horizontal && direction === "previous" && "-top-12",
        !horizontal && direction === "next" && "-bottom-12"
      )}
      style={{ pointerEvents: "box-none" }}
    >
      {button}
    </View>
  )
}

function CarouselPrevious(props: React.ComponentProps<typeof Button>) {
  return <CarouselNavButton direction="previous" {...props} />
}

function CarouselNext(props: React.ComponentProps<typeof Button>) {
  return <CarouselNavButton direction="next" {...props} />
}

function CarouselControls({ className, ...props }: ViewProps) {
  return (
    <CarouselControlsContext.Provider value>
      <View
        className={cn("mt-6 flex-row items-center gap-3", className)}
        {...props}
      />
    </CarouselControlsContext.Provider>
  )
}

function CarouselDotProgress({
  delay,
  playing,
  running,
}: {
  delay: number
  playing: boolean
  running: boolean
}) {
  const progress = useSharedValue(playing ? 0 : 1)

  React.useEffect(() => {
    if (playing) return
    cancelAnimation(progress)
    progress.value = 1
  }, [playing, progress])

  React.useEffect(() => {
    if (!playing) return
    if (!running) {
      cancelAnimation(progress)
      return
    }
    if (progress.value >= 1) progress.value = 0
    progress.value = withTiming(1, {
      duration: delay * (1 - progress.value),
      easing: Easing.linear,
      reduceMotion: ReduceMotion.System,
    })
  }, [playing, running, delay, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    width: progress.value * ACTIVE_DOT_WIDTH,
  }))

  return (
    <AnimatedView
      className="absolute top-0 bottom-0 start-0 rounded-full bg-foreground"
      style={animatedStyle}
    />
  )
}

function CarouselDot({ index }: { index: number }) {
  const { selectedIndex, autoplay } = useCarousel()
  const active = index === selectedIndex
  const width = useSharedValue(active ? ACTIVE_DOT_WIDTH : DOT_SIZE)

  React.useEffect(() => {
    width.value = withTiming(active ? ACTIVE_DOT_WIDTH : DOT_SIZE, {
      duration: 500,
      easing: EASING,
      reduceMotion: ReduceMotion.System,
    })
  }, [active, width])

  const animatedStyle = useAnimatedStyle(() => ({ width: width.value }))

  return (
    <CarouselPrimitive.Dot index={index} hitSlop={8} className="h-2">
      <AnimatedView
        className={cn(
          "h-2 overflow-hidden rounded-full",
          active && !autoplay.enabled ? "bg-foreground" : "bg-muted-foreground"
        )}
        style={animatedStyle}
      >
        {active && autoplay.enabled ? (
          <CarouselDotProgress
            delay={autoplay.delay}
            playing={autoplay.playing}
            running={autoplay.running}
          />
        ) : null}
      </AnimatedView>
    </CarouselPrimitive.Dot>
  )
}

function CarouselDots({
  className,
  variant = "default",
  ...props
}: ViewProps & { variant?: "default" | "plain" }) {
  const { scrollSnaps } = useCarousel()
  return (
    <View
      className={cn(
        "h-9 flex-row items-center gap-4 rounded-full",
        variant === "plain" ? "px-0" : "bg-secondary px-4",
        className
      )}
      {...props}
    >
      {scrollSnaps
        .map((_, index) => index)
        .map((index) => (
          <CarouselDot key={index} index={index} />
        ))}
    </View>
  )
}

function CarouselPlayButton({
  className,
  variant = "secondary",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { autoplay } = useCarousel()
  return (
    <CarouselPrimitive.PlayButton
      render={
        <Button
          variant={variant}
          size={size}
          className={cn("rounded-full", className)}
          {...props}
        />
      }
    >
      <Icon as={autoplay.playing ? PauseIcon : PlayIcon} weight="fill" />
    </CarouselPrimitive.PlayButton>
  )
}

export {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPlayButton,
  CarouselPrevious,
  useCarousel,
}
