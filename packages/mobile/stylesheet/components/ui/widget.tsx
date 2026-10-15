import type { IconProps as PhosphorIconProps } from "phosphor-react-native"
import * as React from "react"
import {
  type AccessibilityActionEvent,
  I18nManager,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewProps,
  type ViewStyle,
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
import { Icon, IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

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

function actionStep(actionName: string) {
  if (actionName === "increment") return 1
  if (actionName === "decrement") return -1
  return 0
}

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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

const styles = StyleSheet.create({
  frame: {
    maxWidth: "100%",
    minWidth: 0,
    flexDirection: "column",
    gap: 12,
    overflow: "hidden",
    borderRadius: radius["3xl"],
    padding: 16,
  },
  center: { alignItems: "center", justifyContent: "center" },
  fill: { width: "100%", height: "100%" },
  sized: { maxWidth: "100%" },
  room: { width: "100%", alignItems: "flex-start" },
  roomFill: { height: "100%" },
  stage: { position: "relative", maxWidth: "100%" },
  preview: {
    position: "absolute",
    start: 0,
    top: 0,
    zIndex: 10,
    borderRadius: radius["3xl"],
    borderWidth: 1,
    borderStyle: "dashed",
  },
  handleInside: {
    position: "absolute",
    end: 0,
    bottom: 0,
    width: 28,
    height: 28,
  },
  handleOutside: {
    position: "absolute",
    end: -6,
    bottom: -6,
    width: 34,
    height: 34,
  },
  header: {
    maxWidth: "100%",
    minWidth: 0,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerCenter: { flexDirection: "column", gap: 12 },
  icon: { flexShrink: 0, alignItems: "center", justifyContent: "center" },
  iconDefault: { width: 32, height: 32, borderRadius: radius.lg },
  iconLarge: { width: 52, height: 52, borderRadius: radius["2xl"] },
  title: {
    maxWidth: "100%",
    minWidth: 0,
    flexShrink: 1,
    ...fontSize.sm,
    fontWeight: "600",
  },
  description: { ...fontSize.sm },
  value: {
    ...fontSize["3xl"],
    fontWeight: "600",
    letterSpacing: fontSize["3xl"].fontSize * -0.025,
    fontVariant: ["tabular-nums"],
  },
  action: {
    marginStart: "auto",
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    minHeight: 0,
    flexShrink: 1,
    flexGrow: 1,
    overflow: "hidden",
    flexDirection: "column",
    gap: 4,
  },
  footer: {
    minWidth: 0,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
})

const ICON_SIZE = { default: 18, sm: 14, lg: 24 } as const

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
  current,
  align,
  style,
  children,
  ...props
}: ViewProps & {
  current: WidgetSize | "auto"
  align: WidgetAlign
}) {
  const { colors } = useTheme()
  const context = React.useMemo(
    () => ({ size: current, align }),
    [current, align]
  )
  return (
    <WidgetContext.Provider value={context}>
      <TextStyleContext.Provider
        value={{
          ...fontSize.base,
          color: colors.foreground,
          textAlign: align === "center" ? "center" : undefined,
        }}
      >
        <View
          style={[
            styles.frame,
            { backgroundColor: colors.muted },
            align === "center" && styles.center,
            styles.fill,
            style,
          ]}
          {...props}
        >
          {children}
        </View>
      </TextStyleContext.Provider>
    </WidgetContext.Provider>
  )
}

function Widget({
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
    size?: WidgetSize | "auto"
    defaultSize?: WidgetSize | "auto"
    onSizeChange?: (size: WidgetSize | "auto") => void
    sizes?: WidgetSize[]
    resizable?: boolean
    handle?: WidgetHandlePlacement
    align?: WidgetAlign
    resizeLabel?: string
  }) {
  const { colors } = useTheme()
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
        <WidgetFrame current={current} align={align} style={style} {...props} />
      )
    }
    return (
      <AnimatedView style={[styles.sized, sizeStyle]}>
        <WidgetFrame current={current} align={align} style={style} {...props} />
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
      style={[styles.room, current === "auto" && styles.roomFill]}
      onLayout={(event) => setRoom(event.nativeEvent.layout.width)}
    >
      <AnimatedView
        style={[styles.stage, animated ? sizeStyle : styles.fill]}
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
            style={[
              styles.preview,
              {
                borderColor: withAlpha(colors.foreground, 0.25),
              },
              previewStyle,
            ]}
          />
        ) : null}
        <WidgetFrame current={current} align={align} style={style} {...props} />
        <GestureDetector gesture={gesture}>
          <View
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel={resizeLabel}
            accessibilityValue={{ text: current }}
            accessibilityActions={ACTIONS}
            onAccessibilityAction={onAccessibilityAction}
            hitSlop={12}
            style={[
              handle === "inside" ? styles.handleInside : styles.handleOutside,
              I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : null,
            ]}
          >
            <Icon
              as={handle === "inside" ? InsideHandleShape : OutsideHandleShape}
              size={handle === "inside" ? 28 : 34}
              color={
                dragging
                  ? colors.primary
                  : withAlpha(colors.mutedForeground, 0.5)
              }
            />
          </View>
        </GestureDetector>
      </AnimatedView>
    </View>
  )
}

function WidgetHeader({
  style,
  ...props
}: ViewProps & React.RefAttributes<View>) {
  const { align } = useWidget()
  return (
    <View
      style={[styles.header, align === "center" && styles.headerCenter, style]}
      {...props}
    />
  )
}

function WidgetIcon({
  style,
  iconColor,
  size = "default",
  ...props
}: ViewProps &
  React.RefAttributes<View> & {
    iconColor?: string
    size?: "default" | "sm" | "lg"
  }) {
  const { colors } = useTheme()
  return (
    <IconSizeContext.Provider value={ICON_SIZE[size]}>
      <TextStyleContext.Provider
        value={{ color: iconColor ?? colors.foreground }}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.icon,
            size === "default" && [
              styles.iconDefault,
              { backgroundColor: colors.secondary },
            ],
            size === "lg" && [
              styles.iconLarge,
              { backgroundColor: colors.secondary },
            ],
            style,
          ]}
          {...props}
        />
      </TextStyleContext.Provider>
    </IconSizeContext.Provider>
  )
}

function WidgetTitle({
  style,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  return (
    <Text
      role="heading"
      numberOfLines={1}
      style={[styles.title, style]}
      {...props}
    />
  )
}

function WidgetAction({
  style,
  ...props
}: ViewProps & React.RefAttributes<View>) {
  const { align } = useWidget()
  if (align === "center") return null
  return <View style={[styles.action, style]} {...props} />
}

function WidgetDescription({
  style,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      style={[styles.description, { color: colors.mutedForeground }, style]}
      {...props}
    />
  )
}

function WidgetValue({
  style,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  return <Text style={[styles.value, style]} {...props} />
}

function WidgetContent({
  style,
  children,
  ...props
}: ViewProps & React.RefAttributes<View>) {
  return (
    <View style={[styles.content, style]} {...props}>
      {wrapText(children)}
    </View>
  )
}

function WidgetFooter({
  style,
  children,
  ...props
}: ViewProps & React.RefAttributes<View>) {
  const { colors } = useTheme()
  const { align } = useWidget()
  const text: StyleProp<TextStyle> = {
    ...fontSize.xs,
    color: colors.mutedForeground,
  }
  const footer: StyleProp<ViewStyle> = [
    styles.footer,
    { marginTop: align === "center" ? 0 : "auto" },
    style,
  ]
  return (
    <TextStyleContext.Provider value={text as TextStyle}>
      <IconSizeContext.Provider value={14}>
        <View style={footer} {...props}>
          {wrapText(children)}
        </View>
      </IconSizeContext.Provider>
    </TextStyleContext.Provider>
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
