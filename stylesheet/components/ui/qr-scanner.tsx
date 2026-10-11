import { FlashlightIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native"
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import Svg, { Path } from "react-native-svg"
import { useHaptics } from "@/components/primitives/haptics"
import { useEffectEvent } from "@/components/primitives/hooks"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type QRScannerState = "idle" | "success" | "error"

const FRAME_RADIUS = 28

const BRACKET = 32

const SHAKE_DURATION = 400

function surroundPath(
  width: number,
  height: number,
  left: number,
  top: number,
  size: number,
  radius: number
) {
  const r = Math.min(radius, size / 2)
  const right = left + size
  const bottom = top + size
  return [
    `M0 0H${width}V${height}H0Z`,
    `M${left + r} ${top}H${right - r}`,
    `A${r} ${r} 0 0 1 ${right} ${top + r}V${bottom - r}`,
    `A${r} ${r} 0 0 1 ${right - r} ${bottom}H${left + r}`,
    `A${r} ${r} 0 0 1 ${left} ${bottom - r}V${top + r}`,
    `A${r} ${r} 0 0 1 ${left + r} ${top}Z`,
  ].join("")
}

function bracketColor(state: QRScannerState, colors: ThemeColors) {
  if (state === "success") return colors.success
  if (state === "error") return colors.danger
  return colors.onMedia
}

const CORNERS: ViewStyle[] = [
  {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: radius["3xl"],
  },
  {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: radius["3xl"],
  },
  {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: radius["3xl"],
  },
  {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: radius["3xl"],
  },
]

const styles = StyleSheet.create({
  root: { position: "relative", overflow: "hidden" },
  absolute: { position: "absolute" },
  bracket: { position: "absolute", width: BRACKET, height: BRACKET },
  line: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 12,
    height: 2,
    borderRadius: radius.full,
  },
  title: { position: "absolute", left: 24, right: 24, alignItems: "center" },
  titleText: { ...fontSize.lg, fontWeight: "600", textAlign: "center" },
  footer: {
    position: "absolute",
    left: 24,
    right: 24,
    alignItems: "center",
    gap: 24,
  },
  description: { ...fontSize.sm, textAlign: "center" },
  torch: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
})

function wrapText(children: React.ReactNode, style: StyleProp<TextStyle>) {
  if (typeof children === "string" || typeof children === "number") {
    return <Text style={style}>{children}</Text>
  }
  return children
}

function QRScanner({
  state = "idle",
  title,
  description,
  scanLine = true,
  torch = false,
  onTorchToggle,
  torchLabel = "Flashlight",
  frameSize: frameSizeProp,
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof View>, "style"> & {
  style?: StyleProp<ViewStyle>
  state?: QRScannerState
  title?: React.ReactNode
  description?: React.ReactNode
  scanLine?: boolean
  torch?: boolean
  onTorchToggle?: (torch: boolean) => void
  torchLabel?: string
  frameSize?: number
}) {
  const { colors } = useTheme()
  const [layout, setLayout] = React.useState({ width: 0, height: 0 })
  const frameSize =
    frameSizeProp ??
    Math.min(280, Math.round(Math.min(layout.width, layout.height) * 0.68))
  const frameTop = Math.max(0, (layout.height - frameSize) / 2)
  const frameLeft = Math.max(0, (layout.width - frameSize) / 2)
  const offset = useSharedValue(0)
  const line = useSharedValue(0)
  const previousState = React.useRef(state)
  const haptics = useHaptics()
  const scanning = scanLine && state === "idle" && frameSize > 0

  const onError = useEffectEvent(() => {
    const step = {
      duration: SHAKE_DURATION / 6,
      reduceMotion: ReduceMotion.System,
    }
    offset.value = withSequence(
      withTiming(-12, step),
      withTiming(10, step),
      withTiming(-8, step),
      withTiming(6, step),
      withTiming(-3, step),
      withTiming(0, step)
    )
  })

  React.useEffect(() => {
    const previous = previousState.current
    previousState.current = state
    if (state === previous) return
    if (state === "error") {
      haptics.notification("error")
      onError()
    } else if (state === "success") {
      haptics.notification("success")
    }
  }, [state, onError, haptics])

  React.useEffect(() => {
    if (!scanning) {
      cancelAnimation(line)
      line.value = 0
      return
    }
    line.value = 0
    line.value = withRepeat(
      withTiming(1, {
        duration: 1800,
        easing: Easing.inOut(Easing.quad),
        reduceMotion: ReduceMotion.System,
      }),
      -1,
      true
    )
    return () => cancelAnimation(line)
  }, [scanning, line])

  const frameStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: line.value * (frameSize - 24) }],
  }))

  return (
    <View
      onLayout={(event) =>
        setLayout({
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        })
      }
      style={[
        styles.root,
        children == null && { backgroundColor: colors.media },
        style,
      ]}
      {...props}
    >
      <View style={StyleSheet.absoluteFill}>{children}</View>
      {frameSize > 0 ? (
        <View
          pointerEvents="box-none"
          style={StyleSheet.absoluteFill}
          accessibilityLiveRegion="polite"
        >
          <Svg
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            width={layout.width}
            height={layout.height}
            style={StyleSheet.absoluteFill}
          >
            <Path
              d={surroundPath(
                layout.width,
                layout.height,
                frameLeft,
                frameTop,
                frameSize,
                FRAME_RADIUS
              )}
              fill={colors.scrim}
              fillRule="evenodd"
            />
          </Svg>
          <AnimatedView
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[
              styles.absolute,
              {
                top: frameTop,
                left: frameLeft,
                width: frameSize,
                height: frameSize,
              },
              frameStyle,
            ]}
          >
            {CORNERS.map((corner, index) => (
              <View
                key={["tl", "tr", "bl", "br"][index]}
                style={[
                  styles.bracket,
                  corner,
                  { borderColor: bracketColor(state, colors) },
                ]}
              />
            ))}
            {scanning ? (
              <AnimatedView
                style={[
                  styles.line,
                  { backgroundColor: colors.accent },
                  lineStyle,
                ]}
              />
            ) : null}
          </AnimatedView>
          {title !== undefined ? (
            <View
              pointerEvents="none"
              style={[styles.title, { bottom: layout.height - frameTop + 24 }]}
            >
              {wrapText(title, [styles.titleText, { color: colors.onMedia }])}
            </View>
          ) : null}
          <View
            pointerEvents="box-none"
            style={[styles.footer, { top: frameTop + frameSize + 24 }]}
          >
            {description !== undefined
              ? wrapText(description, [
                  styles.description,
                  { color: colors.onMedia },
                ])
              : null}
            {onTorchToggle ? (
              <Pressable
                role="button"
                accessibilityLabel={torchLabel}
                accessibilityState={{ selected: torch }}
                hitSlop={8}
                onPress={() => onTorchToggle(!torch)}
                style={({ pressed }) => [
                  styles.torch,
                  {
                    backgroundColor: torch ? colors.onMedia : colors.scrim,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Icon
                  as={FlashlightIcon}
                  weight={torch ? "fill" : "regular"}
                  size={24}
                  color={torch ? colors.media : colors.onMedia}
                />
              </Pressable>
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  )
}

export type { QRScannerState }
export { QRScanner }
