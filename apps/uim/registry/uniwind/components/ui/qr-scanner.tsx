import { cn } from "cn"
import {
  FlashlightIcon,
  type IconProps as PhosphorIconProps,
} from "phosphor-react-native"
import * as React from "react"
import { Pressable, View } from "react-native"
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

type QRScannerState = "idle" | "success" | "error"

const FRAME_RADIUS = 28

const BRACKET = 32

const SHAKE_DURATION = 400

const BRACKET_COLOR: Record<QRScannerState, string> = {
  idle: "border-on-media",
  success: "border-success",
  error: "border-danger",
}

const CORNERS = [
  { position: "top-0 left-0", border: "border-t-4 border-l-4 rounded-tl-3xl" },
  { position: "top-0 right-0", border: "border-t-4 border-r-4 rounded-tr-3xl" },
  {
    position: "bottom-0 left-0",
    border: "border-b-4 border-l-4 rounded-bl-3xl",
  },
  {
    position: "bottom-0 right-0",
    border: "border-b-4 border-r-4 rounded-br-3xl",
  },
]

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

const SurroundContext = React.createContext("")

function QRScannerSurround({ color }: PhosphorIconProps) {
  const path = React.useContext(SurroundContext)
  return (
    <Svg width="100%" height="100%">
      <Path d={path} fill={color} fillRule="evenodd" />
    </Svg>
  )
}

function wrapText(children: React.ReactNode, className: string) {
  if (typeof children === "string" || typeof children === "number") {
    return <Text className={className}>{children}</Text>
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
  className,
  children,
  ...props
}: React.ComponentProps<typeof View> & {
  state?: QRScannerState
  title?: React.ReactNode
  description?: React.ReactNode
  scanLine?: boolean
  torch?: boolean
  onTorchToggle?: (torch: boolean) => void
  torchLabel?: string
  frameSize?: number
}) {
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
      className={cn(
        "relative overflow-hidden",
        children == null && "bg-media",
        className
      )}
      {...props}
    >
      <View className="absolute inset-0">{children}</View>
      {frameSize > 0 ? (
        <View
          pointerEvents="box-none"
          className="absolute inset-0"
          accessibilityLiveRegion="polite"
        >
          <View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="absolute inset-0"
          >
            <SurroundContext.Provider
              value={surroundPath(
                layout.width,
                layout.height,
                frameLeft,
                frameTop,
                frameSize,
                FRAME_RADIUS
              )}
            >
              <Icon as={QRScannerSurround} className="text-scrim" />
            </SurroundContext.Provider>
          </View>
          <AnimatedView
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="absolute"
            style={[
              {
                top: frameTop,
                left: frameLeft,
                width: frameSize,
                height: frameSize,
              },
              frameStyle,
            ]}
          >
            {CORNERS.map((corner) => (
              <View
                key={corner.position}
                className={cn(
                  "absolute",
                  corner.position,
                  corner.border,
                  BRACKET_COLOR[state]
                )}
                style={{ width: BRACKET, height: BRACKET }}
              />
            ))}
            {scanning ? (
              <AnimatedView
                className="absolute inset-x-4 top-3 h-0.5 rounded-full bg-accent"
                style={lineStyle}
              />
            ) : null}
          </AnimatedView>
          {title !== undefined ? (
            <View
              pointerEvents="none"
              className="absolute inset-x-6 items-center"
              style={{ bottom: layout.height - frameTop + 24 }}
            >
              {wrapText(
                title,
                "text-center text-lg font-semibold text-on-media"
              )}
            </View>
          ) : null}
          <View
            pointerEvents="box-none"
            className="absolute inset-x-6 items-center gap-6"
            style={{ top: frameTop + frameSize + 24 }}
          >
            {description !== undefined
              ? wrapText(description, "text-center text-sm text-on-media")
              : null}
            {onTorchToggle ? (
              <Pressable
                role="button"
                accessibilityLabel={torchLabel}
                accessibilityState={{ selected: torch }}
                hitSlop={8}
                onPress={() => onTorchToggle(!torch)}
                className={cn(
                  "size-14 items-center justify-center rounded-full",
                  "active:opacity-70",
                  torch ? "bg-on-media" : "bg-scrim"
                )}
              >
                <Icon
                  as={FlashlightIcon}
                  weight={torch ? "fill" : "regular"}
                  className={cn(
                    "size-6",
                    torch ? "text-media" : "text-on-media"
                  )}
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
