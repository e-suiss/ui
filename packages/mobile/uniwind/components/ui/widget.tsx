import { cn } from "cn"
import type { IconProps as PhosphorIconProps } from "phosphor-react-native"
import * as React from "react"
import {
  type AccessibilityActionEvent,
  I18nManager,
  View,
  type ViewProps,
} from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import Svg, { Path } from "react-native-svg"
import { useHaptics } from "@/components/primitives/haptics"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon, IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

type WidgetSize = "small" | "medium" | "large" | "extra-large"

type WidgetAlign = "start" | "center"

type WidgetHandlePlacement = "inside" | "outside"

const WIDGET_DIMENSIONS: Record<WidgetSize, [number, number]> = {
  small: [168, 168],
  medium: [352, 168],
  large: [352, 352],
  "extra-large": [720, 352],
}

const ALL_SIZES: WidgetSize[] = ["small", "medium", "large", "extra-large"]

const STRETCH = 48

const TIMING = {
  duration: 500,
  easing: Easing.inOut(Easing.ease),
  reduceMotion: ReduceMotion.System,
}

const ACTIONS = [{ name: "increment" }, { name: "decrement" }] as const

const WidgetContext = React.createContext<{
  size: WidgetSize | "auto"
  align: WidgetAlign
}>({ size: "auto", align: "start" })

function useWidget() {
  return React.useContext(WidgetContext)
}

function sizesThatFit(sizes: WidgetSize[], room: number) {
  const fitting = sizes.filter((size) => WIDGET_DIMENSIONS[size][0] <= room)
  if (fitting.length > 0) return fitting
  const narrowest = sizes.reduce((best, size) =>
    WIDGET_DIMENSIONS[size][0] < WIDGET_DIMENSIONS[best][0] ? size : best
  )
  return [narrowest]
}

function actionStep(actionName: string) {
  if (actionName === "increment") return 1
  if (actionName === "decrement") return -1
  return 0
}

function wrapText(children: React.ReactNode) {
  if (typeof children === "string" || typeof children === "number") {
    return <Text>{children}</Text>
  }
  return children
}

function InsideHandleShape({ color, size }: PhosphorIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path
        d="M19.9 9.3A22 22 0 0 1 9.3 19.9"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  )
}

function OutsideHandleShape({ color, size }: PhosphorIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 34 34" fill="none">
      <Path
        d="M29.9 13.9A33 33 0 0 1 13.9 29.9"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </Svg>
  )
}

function WidgetFrame({
  className,
  current,
  align,
  fill,
  style,
  children,
  ...props
}: ViewProps & {
  className?: string
  current: WidgetSize | "auto"
  align: WidgetAlign
  fill: boolean
}) {
  const context = React.useMemo(
    () => ({ size: current, align }),
    [current, align]
  )
  return (
    <WidgetContext.Provider value={context}>
      <TextClassContext.Provider
        value={cn(
          "text-base text-foreground",
          align === "center" && "text-center"
        )}
      >
        <View
          className={cn(
            "max-w-full min-w-0 flex-col gap-3 overflow-hidden rounded-3xl bg-muted p-4",
            align === "center" && "items-center justify-center",
            fill && "size-full",
            className
          )}
          style={style}
          {...props}
        >
          {children}
        </View>
      </TextClassContext.Provider>
    </WidgetContext.Provider>
  )
}

function Widget({
  className,
  size,
  defaultSize,
  onSizeChange,
  sizes = ALL_SIZES,
  resizable = false,
  handle = "outside",
  align = "start",
  resizeLabel = "Resize widget",
  style,
  ...props
}: ViewProps &
  React.RefAttributes<View> & {
    className?: string
    size?: WidgetSize | "auto"
    defaultSize?: WidgetSize | "auto"
    onSizeChange?: (size: WidgetSize | "auto") => void
    sizes?: WidgetSize[]
    resizable?: boolean
    handle?: WidgetHandlePlacement
    align?: WidgetAlign
    resizeLabel?: string
  }) {
  const initialSize = defaultSize ?? (resizable ? "small" : "auto")
  const [uncontrolledSize, setUncontrolledSize] = React.useState(initialSize)
  const current = size ?? uncontrolledSize
  const { selection } = useHaptics()
  const [room, setRoom] = React.useState(Number.POSITIVE_INFINITY)
  const [preview, setPreview] = React.useState<WidgetSize | null>(null)
  const [dragging, setDragging] = React.useState(false)
  const [settled, setSettled] = React.useState(0)

  const reachable = React.useMemo(
    () => sizesThatFit(sizes, room),
    [sizes, room]
  )
  const fixed = current === "auto" ? null : WIDGET_DIMENSIONS[current]

  const width = useSharedValue(fixed?.[0] ?? 0)
  const height = useSharedValue(fixed?.[1] ?? 0)
  const startWidth = useSharedValue(0)
  const startHeight = useSharedValue(0)
  const measuredWidth = useSharedValue(0)
  const measuredHeight = useSharedValue(0)
  const previewWidth = useSharedValue(0)
  const previewHeight = useSharedValue(0)
  const last = useSharedValue(-1)
  const active = useSharedValue(0)

  const select = React.useCallback(
    (next: WidgetSize | "auto") => {
      if (size === undefined) setUncontrolledSize(next)
      onSizeChange?.(next)
    },
    [size, onSizeChange]
  )

  React.useEffect(() => {
    if (dragging || !fixed || settled < 0) return
    width.value = withTiming(fixed[0], TIMING)
    height.value = withTiming(fixed[1], TIMING)
  }, [fixed, dragging, settled, width, height])

  const snap = React.useCallback(
    (index: number) => {
      const next = reachable[index]
      if (!next) return
      selection()
      setPreview(next)
    },
    [reachable, selection]
  )

  const release = React.useCallback(
    (index: number) => {
      const next = reachable[index]
      setPreview(null)
      setDragging(false)
      setSettled((count) => count + 1)
      if (next && next !== current) select(next)
    },
    [reachable, current, select]
  )

  const begin = React.useCallback(() => setDragging(true), [])

  const reset = React.useCallback(() => {
    if (initialSize === current) return
    selection()
    select(initialSize)
  }, [initialSize, current, select, selection])

  const gesture = React.useMemo(() => {
    const dimensions = reachable.flatMap((item) => WIDGET_DIMENSIONS[item])
    const currentIndex =
      current === "auto" ? -1 : reachable.indexOf(current as WidgetSize)
    const direction = I18nManager.isRTL ? -1 : 1
    const [minWidth, minHeight] = WIDGET_DIMENSIONS.small
    let maxWidth = 0
    let maxHeight = 0
    for (let index = 0; index < dimensions.length; index += 2) {
      maxWidth = Math.max(maxWidth, dimensions[index] ?? 0)
      maxHeight = Math.max(maxHeight, dimensions[index + 1] ?? 0)
    }
    const limit = room
    const pan = Gesture.Pan()
      .minDistance(2)
      .onStart(() => {
        const startW = currentIndex < 0 ? measuredWidth.value : width.value
        const startH = currentIndex < 0 ? measuredHeight.value : height.value
        startWidth.value = startW
        startHeight.value = startH
        width.value = startW
        height.value = startH
        last.value = currentIndex
        active.value = 1
        if (currentIndex >= 0) {
          previewWidth.value = dimensions[currentIndex * 2] ?? startW
          previewHeight.value = dimensions[currentIndex * 2 + 1] ?? startH
        }
        runOnJS(begin)()
      })
      .onUpdate((event) => {
        const nextWidth = startWidth.value + event.translationX * direction
        const nextHeight = startHeight.value + event.translationY
        width.value = Math.max(
          minWidth,
          Math.min(maxWidth + STRETCH, limit, nextWidth)
        )
        height.value = Math.max(
          minHeight,
          Math.min(maxHeight + STRETCH, nextHeight)
        )
        let best = -1
        let bestDistance = Number.POSITIVE_INFINITY
        for (let index = 0; index * 2 < dimensions.length; index += 1) {
          const distance =
            (nextWidth - (dimensions[index * 2] ?? 0)) ** 2 +
            (nextHeight - (dimensions[index * 2 + 1] ?? 0)) ** 2
          if (distance < bestDistance) {
            best = index
            bestDistance = distance
          }
        }
        if (best >= 0 && best !== last.value) {
          last.value = best
          previewWidth.value = withTiming(dimensions[best * 2] ?? 0, TIMING)
          previewHeight.value = withTiming(
            dimensions[best * 2 + 1] ?? 0,
            TIMING
          )
          runOnJS(snap)(best)
        }
      })
      .onFinalize(() => {
        if (!active.value) return
        active.value = 0
        const index = last.value
        if (index >= 0) {
          width.value = withTiming(dimensions[index * 2] ?? 0, TIMING)
          height.value = withTiming(dimensions[index * 2 + 1] ?? 0, TIMING)
        }
        runOnJS(release)(index)
      })
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd(() => {
        runOnJS(reset)()
      })
    return Gesture.Exclusive(pan, doubleTap)
  }, [
    reachable,
    current,
    room,
    width,
    height,
    startWidth,
    startHeight,
    measuredWidth,
    measuredHeight,
    previewWidth,
    previewHeight,
    last,
    active,
    begin,
    snap,
    release,
    reset,
  ])

  const sizeStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
  }))

  const previewStyle = useAnimatedStyle(() => ({
    width: previewWidth.value,
    height: previewHeight.value,
  }))

  const animated = fixed !== null || dragging

  if (!resizable) {
    if (!fixed) {
      return (
        <WidgetFrame
          className={className}
          current={current}
          align={align}
          fill
          style={style}
          {...props}
        />
      )
    }
    return (
      <AnimatedView className="max-w-full" style={sizeStyle}>
        <WidgetFrame
          className={className}
          current={current}
          align={align}
          fill
          style={style}
          {...props}
        />
      </AnimatedView>
    )
  }

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    const step = actionStep(event.nativeEvent.actionName)
    if (!step) return
    const index = current === "auto" ? -1 : reachable.indexOf(current)
    const next =
      reachable[Math.max(0, Math.min(reachable.length - 1, index + step))]
    if (!next || next === current) return
    selection()
    select(next)
  }

  return (
    <View
      className={cn("w-full items-start", current === "auto" && "h-full")}
      onLayout={(event) => setRoom(event.nativeEvent.layout.width)}
    >
      <AnimatedView
        className={cn("relative max-w-full", !animated && "size-full")}
        style={animated ? sizeStyle : undefined}
        onLayout={(event) => {
          measuredWidth.value = event.nativeEvent.layout.width
          measuredHeight.value = event.nativeEvent.layout.height
        }}
      >
        {preview ? (
          <AnimatedView
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="absolute start-0 top-0 z-10 rounded-3xl border border-dashed border-foreground/25"
            style={previewStyle}
          />
        ) : null}
        <WidgetFrame
          className={className}
          current={current}
          align={align}
          fill
          style={style}
          {...props}
        />
        <GestureDetector gesture={gesture}>
          <View
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel={resizeLabel}
            accessibilityValue={{ text: current }}
            accessibilityActions={ACTIONS}
            onAccessibilityAction={onAccessibilityAction}
            hitSlop={12}
            className={cn(
              "absolute",
              handle === "inside"
                ? "end-0 bottom-0 size-7"
                : "-end-1.5 -bottom-1.5 size-8.5"
            )}
            style={
              I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined
            }
          >
            <IconClassContext.Provider value={undefined}>
              <TextClassContext.Provider value={undefined}>
                <Icon
                  as={
                    handle === "inside" ? InsideHandleShape : OutsideHandleShape
                  }
                  className={cn(
                    handle === "inside" ? "size-7" : "size-8.5",
                    dragging ? "text-primary" : "text-muted-foreground/50"
                  )}
                />
              </TextClassContext.Provider>
            </IconClassContext.Provider>
          </View>
        </GestureDetector>
      </AnimatedView>
    </View>
  )
}

function WidgetHeader({
  className,
  ...props
}: ViewProps & React.RefAttributes<View> & { className?: string }) {
  const { align } = useWidget()
  return (
    <View
      className={cn(
        "max-w-full min-w-0 shrink-0 flex-row items-center gap-2",
        align === "center" && "flex-col gap-3",
        className
      )}
      {...props}
    />
  )
}

const WIDGET_ICON_SIZE = {
  default: { frame: "size-8 rounded-lg bg-secondary", icon: "size-4.5" },
  sm: { frame: "", icon: "size-3.5" },
  lg: { frame: "size-13 rounded-2xl bg-secondary", icon: "size-6" },
} as const

function WidgetIcon({
  className,
  iconClassName,
  size = "default",
  ...props
}: ViewProps &
  React.RefAttributes<View> & {
    className?: string
    iconClassName?: string
    size?: "default" | "sm" | "lg"
  }) {
  return (
    <IconClassContext.Provider
      value={cn(WIDGET_ICON_SIZE[size].icon, "text-foreground", iconClassName)}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className={cn(
          "shrink-0 items-center justify-center",
          WIDGET_ICON_SIZE[size].frame,
          className
        )}
        {...props}
      />
    </IconClassContext.Provider>
  )
}

function WidgetTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  return (
    <Text
      role="heading"
      numberOfLines={1}
      className={cn(
        "max-w-full min-w-0 shrink text-sm font-semibold",
        className
      )}
      {...props}
    />
  )
}

function WidgetAction({
  className,
  ...props
}: ViewProps & React.RefAttributes<View> & { className?: string }) {
  const { align } = useWidget()
  if (align === "center") return null
  return (
    <View
      className={cn("ms-auto shrink-0 flex-row items-center", className)}
      {...props}
    />
  )
}

function WidgetDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  return (
    <Text
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function WidgetValue({
  className,
  style,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  return (
    <Text
      className={cn("text-3xl font-semibold tracking-tight", className)}
      style={[{ fontVariant: ["tabular-nums"] }, style]}
      {...props}
    />
  )
}

function WidgetContent({
  className,
  children,
  ...props
}: ViewProps & React.RefAttributes<View> & { className?: string }) {
  return (
    <View
      className={cn(
        "min-h-0 shrink grow flex-col gap-1 overflow-hidden",
        className
      )}
      {...props}
    >
      {wrapText(children)}
    </View>
  )
}

function WidgetFooter({
  className,
  children,
  ...props
}: ViewProps & React.RefAttributes<View> & { className?: string }) {
  const { align } = useWidget()
  return (
    <TextClassContext.Provider value="text-xs text-muted-foreground">
      <IconClassContext.Provider value="size-3.5 shrink-0 text-muted-foreground">
        <View
          className={cn(
            "min-w-0 shrink-0 flex-row items-center gap-1.5",
            align === "center" ? "mt-0" : "mt-auto",
            className
          )}
          {...props}
        >
          {wrapText(children)}
        </View>
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

export {
  useWidget,
  Widget,
  WidgetAction,
  WidgetContent,
  WidgetDescription,
  WidgetFooter,
  WidgetHeader,
  WidgetIcon,
  type WidgetSize,
  WidgetTitle,
  WidgetValue,
}
