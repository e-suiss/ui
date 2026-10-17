import { CaretRightIcon } from "phosphor-react-native"
import * as React from "react"
import {
  type GestureResponderEvent,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native"
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import * as CollapsiblePrimitive from "@/components/primitives/collapsible"
import { Icon, IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, useTheme } from "@/components/ui/theme"

type TraceStatus = "running" | "error" | "pending"

const TraceStatusContext = React.createContext<TraceStatus | undefined>(
  undefined
)

const styles = StyleSheet.create({
  root: { width: "100%", minWidth: 0, flexDirection: "column", gap: 8 },
  line: {
    maxWidth: "100%",
    minWidth: 0,
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pending: { opacity: 0.6 },
  icon: {
    width: 16,
    height: 16,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBox: { minWidth: 0, flexShrink: 1 },
  title: { minWidth: 0 },
  description: { flexShrink: 0, fontVariant: ["tabular-nums"] },
  collapsible: { width: "100%", minWidth: 0, flexDirection: "column" },
  trigger: {
    maxWidth: "100%",
    minWidth: 0,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
  },
  pressed: { opacity: 0.7 },
  content: {
    marginTop: 8,
    marginBottom: 4,
    marginStart: 7,
    minWidth: 0,
    borderStartWidth: 1,
    paddingStart: 16,
    paddingEnd: 4,
  },
})

function Trace({ style, ...props }: ViewProps) {
  return <View style={[styles.root, style]} {...props} />
}

function TraceLine({
  style,
  status,
  ...props
}: ViewProps & { status?: TraceStatus }) {
  const { colors } = useTheme()
  const color = status === "error" ? colors.destructive : colors.mutedForeground
  return (
    <TraceStatusContext.Provider value={status}>
      <TextStyleContext.Provider value={{ ...fontSize.sm, color }}>
        <IconSizeContext.Provider value={16}>
          <View
            style={[styles.line, status === "pending" && styles.pending, style]}
            {...props}
          />
        </IconSizeContext.Provider>
      </TextStyleContext.Provider>
    </TraceStatusContext.Provider>
  )
}

function TraceIcon({ style, ...props }: ViewProps) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.icon, style]}
      {...props}
    />
  )
}

function TraceTitle({ style, ...props }: React.ComponentProps<typeof Text>) {
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
    <Animated.View style={[styles.titleBox, animatedStyle]}>
      <Text numberOfLines={1} style={[styles.title, style]} {...props} />
    </Animated.View>
  )
}

function TraceDescription({
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      style={[
        styles.description,
        { color: colors.mutedForeground, opacity: 0.7 },
        style,
      ]}
      {...props}
    />
  )
}

function TraceCollapsible({
  style,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      style={(state) => [
        styles.collapsible,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function TraceCollapsibleTrigger({
  style,
  children,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
  const { colors } = useTheme()
  const [pressed, setPressed] = React.useState(false)
  const { open } = CollapsiblePrimitive.useRootContext()
  const progress = useDerivedValue(() =>
    withTiming(open ? 1 : 0, { duration: 200 })
  )
  const caretStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 90}deg` }],
  }))

  return (
    <CollapsiblePrimitive.Trigger
      style={(state) => [
        styles.trigger,
        pressed && styles.pressed,
        typeof style === "function" ? style(state) : style,
      ]}
      onPressIn={(event: GestureResponderEvent) => {
        setPressed(true)
        onPressIn?.(event)
      }}
      onPressOut={(event: GestureResponderEvent) => {
        setPressed(false)
        onPressOut?.(event)
      }}
      {...props}
    >
      {children}
      <Animated.View
        style={caretStyle}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <Icon as={CaretRightIcon} size={16} color={colors.mutedForeground} />
      </Animated.View>
    </CollapsiblePrimitive.Trigger>
  )
}

function TraceCollapsibleContent({
  style,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Panel>) {
  const { colors } = useTheme()
  return (
    <CollapsiblePrimitive.Panel
      style={(state) => [
        styles.content,
        { borderColor: colors.border },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <TextStyleContext.Provider
        value={{
          ...fontSize.sm,
          lineHeight: 22,
          color: colors.mutedForeground,
        }}
      >
        {children}
      </TextStyleContext.Provider>
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
