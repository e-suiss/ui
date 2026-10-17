import { cn } from "cn"
import { CaretRightIcon } from "phosphor-react-native"
import * as React from "react"
import { View, type ViewProps } from "react-native"
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import * as CollapsiblePrimitive from "@/components/primitives/collapsible"
import { resolveClassName } from "@/components/primitives/use-render"
import { Icon, IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

type TraceStatus = "running" | "error" | "pending"

const TraceStatusContext = React.createContext<TraceStatus | undefined>(
  undefined
)

function Trace({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("w-full min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

function TraceLine({
  className,
  status,
  ...props
}: ViewProps & { status?: TraceStatus }) {
  const tone = status === "error" ? "text-destructive" : "text-muted-foreground"
  return (
    <TraceStatusContext.Provider value={status}>
      <TextClassContext.Provider value={cn("text-sm", tone)}>
        <IconClassContext.Provider value={cn("size-4", tone)}>
          <View
            className={cn(
              "max-w-full min-w-0 shrink flex-row items-center gap-2",
              status === "pending" && "opacity-60",
              className
            )}
            {...props}
          />
        </IconClassContext.Provider>
      </TextClassContext.Provider>
    </TraceStatusContext.Provider>
  )
}

function TraceIcon({ className, ...props }: ViewProps) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      className={cn("size-4 shrink-0 items-center justify-center", className)}
      {...props}
    />
  )
}

function TraceTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  const status = React.useContext(TraceStatusContext)
  const reduceMotion = useReducedMotion()
  const running = status === "running" && !reduceMotion
  const opacity = useSharedValue(1)

  React.useEffect(() => {
    opacity.value = running
      ? withRepeat(withTiming(0.45, { duration: 900 }), -1, true)
      : withTiming(1, { duration: 150 })
  }, [opacity, running])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View className="min-w-0 shrink" style={animatedStyle}>
      <Text numberOfLines={1} className={cn("min-w-0", className)} {...props} />
    </Animated.View>
  )
}

function TraceDescription({
  className,
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("shrink-0 text-muted-foreground-70", className)}
      style={[{ fontVariant: ["tabular-nums"] }, style]}
      {...props}
    />
  )
}

function TraceCollapsible({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      className={(state) =>
        cn("w-full min-w-0 flex-col", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

function TraceCollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  const { open } = CollapsiblePrimitive.useRootContext()
  const progress = useDerivedValue(() =>
    withTiming(open ? 1 : 0, { duration: 200 })
  )
  const caretStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 90}deg` }],
  }))

  return (
    <CollapsiblePrimitive.Trigger
      className={(state) =>
        cn(
          "max-w-full min-w-0 self-start flex-row items-center gap-1 rounded-lg active:opacity-70",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {children}
      <Animated.View
        style={caretStyle}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <Icon as={CaretRightIcon} className="size-4 text-muted-foreground" />
      </Animated.View>
    </CollapsiblePrimitive.Trigger>
  )
}

function TraceCollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Panel>) {
  return (
    <CollapsiblePrimitive.Panel
      className={(state) =>
        cn(
          "mt-2 mb-1 ms-[7px] min-w-0 border-s border-border ps-4 pe-1",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      <TextClassContext.Provider value="text-sm leading-relaxed text-muted-foreground">
        {children}
      </TextClassContext.Provider>
    </CollapsiblePrimitive.Panel>
  )
}

export {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
}
