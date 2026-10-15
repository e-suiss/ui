import {
  CaretLeftIcon,
  CaretRightIcon,
  PauseIcon,
  PlayIcon,
} from "phosphor-react-native"
import * as React from "react"
import { I18nManager, StyleSheet, View, type ViewProps } from "react-native"
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import * as CarouselPrimitive from "@/components/primitives/carousel"
import { resolveStyle } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { radius, useTheme } from "@/components/ui/theme"

type CarouselApi = CarouselPrimitive.CarouselApi

const CarouselControlsContext = React.createContext(false)

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

const DOT_SIZE = 8

const ACTIVE_DOT_WIDTH = 24

const styles = StyleSheet.create({
  root: { position: "relative" },
  contentHorizontal: { marginStart: -16 },
  contentVertical: { marginTop: -16 },
  itemHorizontal: { paddingStart: 16 },
  itemVertical: { paddingTop: 16 },
  round: { borderRadius: radius.full },
  rotate: { transform: [{ rotate: "90deg" }] },
  navHorizontal: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    pointerEvents: "box-none",
  },
  navVertical: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "box-none",
  },
  previousHorizontal: { start: -48 },
  nextHorizontal: { end: -48 },
  previousVertical: { top: -48 },
  nextVertical: { bottom: -48 },
  controls: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dots: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: radius.full,
  },
  dotsDefault: { paddingHorizontal: 16 },
  dotHit: { height: DOT_SIZE },
  dot: { height: DOT_SIZE, overflow: "hidden", borderRadius: radius.full },
  progress: {
    position: "absolute",
    top: 0,
    bottom: 0,
    start: 0,
    borderRadius: radius.full,
  },
})

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
  style,
  ...props
}: React.ComponentProps<typeof CarouselPrimitive.Root>) {
  return (
    <CarouselPrimitive.Root
      style={(state) => [
        styles.root,
        resolveStyle(style, state) as ViewProps["style"],
      ]}
      {...props}
    />
  )
}

function CarouselContent({
  style,
  ...props
}: React.ComponentProps<typeof CarouselPrimitive.Content>) {
  const { orientation } = useCarousel()
  return (
    <CarouselPrimitive.Viewport>
      <CarouselPrimitive.Content
        style={[
          orientation === "horizontal"
            ? styles.contentHorizontal
            : styles.contentVertical,
          style,
        ]}
        {...props}
      />
    </CarouselPrimitive.Viewport>
  )
}

function CarouselItem({
  style,
  ...props
}: React.ComponentProps<typeof CarouselPrimitive.Item>) {
  const { orientation } = useCarousel()
  return (
    <CarouselPrimitive.Item
      style={(state) => [
        orientation === "horizontal"
          ? styles.itemHorizontal
          : styles.itemVertical,
        resolveStyle(style, state) as ViewProps["style"],
      ]}
      {...props}
    />
  )
}

function CarouselNavButton({
  direction,
  style,
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
          style={(state) => [
            styles.round,
            !inControls && !horizontal && styles.rotate,
            typeof style === "function" ? style(state) : style,
          ]}
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
      style={[
        horizontal ? styles.navHorizontal : styles.navVertical,
        horizontal &&
          (direction === "previous"
            ? styles.previousHorizontal
            : styles.nextHorizontal),
        !horizontal &&
          (direction === "previous"
            ? styles.previousVertical
            : styles.nextVertical),
      ]}
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

function CarouselControls({ style, ...props }: ViewProps) {
  return (
    <CarouselControlsContext.Provider value>
      <View style={[styles.controls, style]} {...props} />
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
  const { colors } = useTheme()
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
      style={[
        styles.progress,
        { backgroundColor: colors.foreground },
        animatedStyle,
      ]}
    />
  )
}

function CarouselDot({ index }: { index: number }) {
  const { colors } = useTheme()
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
    <CarouselPrimitive.Dot index={index} hitSlop={8} style={styles.dotHit}>
      <AnimatedView
        style={[
          styles.dot,
          {
            backgroundColor:
              active && !autoplay.enabled
                ? colors.foreground
                : colors.mutedForeground,
          },
          animatedStyle,
        ]}
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
  style,
  variant = "default",
  ...props
}: ViewProps & { variant?: "default" | "plain" }) {
  const { colors } = useTheme()
  const { scrollSnaps } = useCarousel()
  return (
    <View
      style={[
        styles.dots,
        variant === "plain"
          ? undefined
          : [styles.dotsDefault, { backgroundColor: colors.secondary }],
        style,
      ]}
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
  style,
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
          style={(state) => [
            styles.round,
            typeof style === "function" ? style(state) : style,
          ]}
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
