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
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
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
  palette,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type QRScannerState = "idle" | "success" | "error"

const FRAME_RADIUS = 32

const FRAME_LIFT = 24

const BRACKET_ARM = 48

const BRACKET_WIDTH = 6

const BRACKET_PAD = BRACKET_WIDTH

const SUCCESS_SCALE = 0.94

const SHAKE_DURATION = 400

const LINE_INSET = 24

const LINE_HEIGHT = 2

const AnimatedPath = Animated.createAnimatedComponent(Path)

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

function bracketPath(size: number, radius: number, arm: number, pad: number) {
  const r = Math.min(radius, size / 2)
  const a = Math.max(r, Math.min(arm, size / 2))
  const s = size + pad
  const p = pad
  return [
    `M${p} ${p + a}V${p + r}A${r} ${r} 0 0 1 ${p + r} ${p}H${p + a}`,
    `M${s - a} ${p}H${s - r}A${r} ${r} 0 0 1 ${s} ${p + r}V${p + a}`,
    `M${s} ${s - a}V${s - r}A${r} ${r} 0 0 1 ${s - r} ${s}H${s - a}`,
    `M${p + a} ${s}H${p + r}A${r} ${r} 0 0 1 ${p} ${s - r}V${s - a}`,
  ].join("")
}

function bracketColor(state: QRScannerState, colors: ThemeColors) {
  if (state === "success") return palette.green500
  if (state === "error") return colors.destructive
  return palette.white
}

const styles = StyleSheet.create({
  root: { position: "relative", overflow: "hidden" },
  absolute: { position: "absolute" },
  brackets: { position: "absolute", top: -BRACKET_PAD, left: -BRACKET_PAD },
  line: {
    position: "absolute",
    left: LINE_INSET,
    right: LINE_INSET,
    top: LINE_INSET,
    height: LINE_HEIGHT,
    borderRadius: radius.full,
  },
  title: { position: "absolute", left: 24, right: 24, alignItems: "center" },
  titleText: { ...fontSize.lg, fontWeight: "600", textAlign: "center" },
  footer: { position: "absolute", left: 24, right: 24, alignItems: "center" },
  descriptionBox: { maxWidth: 280 },
  description: { ...fontSize.sm, textAlign: "center" },
  torchRow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 48,
    alignItems: "center",
  },
  torch: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
})

function QRScannerBrackets({ size, color }: { size: number; color: string }) {
  const stroke = useSharedValue(color)
  const box = size + BRACKET_PAD * 2

  React.useEffect(() => {
    stroke.value = withTiming(color, { duration: 250 })
  }, [color, stroke])

  const animatedProps = useAnimatedProps(() => ({ stroke: stroke.value }))

  return (
    <Svg width={box} height={box}>
      <AnimatedPath
        d={bracketPath(size, FRAME_RADIUS, BRACKET_ARM, BRACKET_PAD)}
        fill="none"
        strokeWidth={BRACKET_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        animatedProps={animatedProps}
      />
    </Svg>
  )
}

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
  scanLine = false,
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
    Math.min(260, Math.round(Math.min(layout.width, layout.height) * 0.66))
  const frameTop = Math.max(0, (layout.height - frameSize) / 2 - FRAME_LIFT)
  const frameLeft = Math.max(0, (layout.width - frameSize) / 2)
  const reduceMotion = useReducedMotion()
  const offset = useSharedValue(0)
  const scale = useSharedValue(
    state === "success" && !reduceMotion ? SUCCESS_SCALE : 1
  )
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
    const target = state === "success" && !reduceMotion ? SUCCESS_SCALE : 1
    scale.value = withSpring(target, {
      duration: 350,
      dampingRatio: 0.6,
    })
  }, [state, reduceMotion, scale])

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
    transform: [{ translateX: offset.value }, { scale: scale.value }],
  }))

  const lineTravel = Math.max(0, frameSize - LINE_INSET * 2 - LINE_HEIGHT)

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: line.value * lineTravel }],
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
        children == null && { backgroundColor: palette.black },
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
              fill={"rgba(0, 0, 0, 0.5)"}
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
            <View style={styles.brackets}>
              <QRScannerBrackets
                size={frameSize}
                color={bracketColor(state, colors)}
              />
            </View>
            {scanning ? (
              <AnimatedView
                style={[
                  styles.line,
                  { backgroundColor: colors.primary },
                  lineStyle,
                ]}
              />
            ) : null}
          </AnimatedView>
          {title !== undefined ? (
            <View
              pointerEvents="none"
              style={[styles.title, { bottom: layout.height - frameTop + 32 }]}
            >
              {wrapText(title, [styles.titleText, { color: palette.white }])}
            </View>
          ) : null}
          {description !== undefined ? (
            <View
              pointerEvents="box-none"
              style={[styles.footer, { top: frameTop + frameSize + 20 }]}
            >
              <View pointerEvents="box-none" style={styles.descriptionBox}>
                {wrapText(description, [
                  styles.description,
                  { color: palette.white },
                ])}
              </View>
            </View>
          ) : null}
          {onTorchToggle ? (
            <View pointerEvents="box-none" style={styles.torchRow}>
              <Pressable
                role="button"
                accessibilityLabel={torchLabel}
                accessibilityState={{ selected: torch }}
                hitSlop={8}
                onPress={() => onTorchToggle(!torch)}
                style={({ pressed }) => [
                  styles.torch,
                  {
                    backgroundColor: torch
                      ? palette.white
                      : "rgba(0, 0, 0, 0.5)",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Icon
                  as={FlashlightIcon}
                  weight={torch ? "fill" : "regular"}
                  size={24}
                  color={torch ? palette.black : palette.white}
                />
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}

export type { QRScannerState }
export { QRScanner }
