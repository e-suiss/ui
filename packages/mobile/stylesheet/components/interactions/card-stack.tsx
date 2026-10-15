import {
  ArrowCounterClockwiseIcon,
  HeartIcon,
  XIcon,
} from "phosphor-react-native"
import * as React from "react"
import {
  type AccessibilityActionEvent,
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
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { useHaptics } from "@/components/primitives/haptics"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type CardStackDirection = "left" | "right"

type CardStackContextProps = {
  index: number
  count: number
  remaining: number
  canUndo: boolean
  disabled: boolean
  swipe: (direction: CardStackDirection) => void
  undo: () => void
}

type CardStackInternalContextProps = {
  swipeWithFeedback: (direction: CardStackDirection) => void
}

const CardStackContext = React.createContext<CardStackContextProps | null>(null)

const CardStackInternalContext =
  React.createContext<CardStackInternalContextProps | null>(null)

function useCardStack() {
  const context = React.useContext(CardStackContext)
  if (!context) {
    throw new Error("useCardStack must be used within a <CardStack />")
  }
  return context
}

const EASING = Easing.bezier(0.32, 0.72, 0, 1)
const ROTATION = 12
const VELOCITY = 800
const SCALE_STEP = 0.05
const OFFSET_STEP = 12
const FLY_DURATION = 260
const SPRING = {
  damping: 20,
  stiffness: 220,
  reduceMotion: ReduceMotion.System,
}

const styles = StyleSheet.create({
  root: { width: "100%", gap: 24 },
  deck: { width: "100%", height: 384 },
  empty: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 24,
  },
  emptyText: { ...fontSize.sm, textAlign: "center" },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  swipeButton: { width: 56, height: 56, borderRadius: radius.full },
})

function wrapText(children: React.ReactNode, style: TextStyle) {
  if (typeof children === "string" || typeof children === "number") {
    return <Text style={style}>{children}</Text>
  }
  return children
}

function StackCard({
  depth,
  visibleCount,
  translateX,
  threshold,
  children,
}: {
  depth: number
  visibleCount: number
  translateX: SharedValue<number>
  threshold: number
  children: React.ReactNode
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(translateX.value) / threshold, 1)
    const level = depth - progress
    return {
      opacity: depth >= visibleCount ? progress : 1,
      transform: [
        { translateY: level * OFFSET_STEP },
        { scale: 1 - level * SCALE_STEP },
      ],
    }
  })

  return (
    <AnimatedView
      style={[
        StyleSheet.absoluteFill,
        { zIndex: visibleCount + 1 - depth },
        animatedStyle,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
    >
      {children}
    </AnimatedView>
  )
}

function TopCard({
  translateX,
  translateY,
  width,
  zIndex,
  gesture,
  accessibilityLabel,
  onAccessibilityAction,
  children,
}: {
  translateX: SharedValue<number>
  translateY: SharedValue<number>
  width: SharedValue<number>
  zIndex: number
  gesture: ReturnType<typeof Gesture.Pan>
  accessibilityLabel?: string
  onAccessibilityAction: (event: AccessibilityActionEvent) => void
  children: React.ReactNode
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const base = width.value > 0 ? width.value : 1
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${(translateX.value / base) * ROTATION}deg` },
      ],
    }
  })

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedView
        style={[StyleSheet.absoluteFill, { zIndex }, animatedStyle]}
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityActions={[
          { name: "swipeLeft", label: "Swipe left" },
          { name: "swipeRight", label: "Swipe right" },
        ]}
        onAccessibilityAction={onAccessibilityAction}
      >
        {children}
      </AnimatedView>
    </GestureDetector>
  )
}

function CardStack<T>({
  data,
  renderItem,
  keyExtractor,
  onSwipe,
  onUndo,
  threshold = 120,
  visibleCount = 3,
  disabled = false,
  itemAccessibilityLabel,
  style,
  deckStyle,
  children,
  ...props
}: ViewProps & {
  data: readonly T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor?: (item: T, index: number) => string
  onSwipe?: (direction: CardStackDirection, item: T, index: number) => void
  onUndo?: (item: T, index: number) => void
  threshold?: number
  visibleCount?: number
  disabled?: boolean
  itemAccessibilityLabel?: (item: T, index: number) => string
  deckStyle?: StyleProp<ViewStyle>
}) {
  const [index, setIndex] = React.useState(0)
  const [history, setHistory] = React.useState<CardStackDirection[]>([])
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const width = useSharedValue(0)
  const flyingRef = React.useRef(false)
  const pendingRef = React.useRef<{ index: number; from: number } | null>(null)
  const { impact } = useHaptics()

  const indexRef = React.useRef(index)
  indexRef.current = index
  const dataRef = React.useRef(data)
  dataRef.current = data
  const onSwipeRef = React.useRef(onSwipe)
  onSwipeRef.current = onSwipe

  const commit = React.useCallback(
    (direction: CardStackDirection, feedback: boolean) => {
      flyingRef.current = false
      const current = indexRef.current
      const item = dataRef.current[current]
      if (item === undefined) return
      if (feedback) impact("medium")
      pendingRef.current = { index: current + 1, from: 0 }
      setHistory((entries) => [...entries, direction])
      setIndex(current + 1)
      onSwipeRef.current?.(direction, item, current)
    },
    [impact]
  )

  React.useLayoutEffect(() => {
    const pending = pendingRef.current
    if (!pending || pending.index !== index) return
    const from = pending.from
    pendingRef.current = null
    translateY.value = 0
    if (from === 0) {
      translateX.value = 0
      return
    }
    translateX.value = from
    translateX.value = withSpring(0, SPRING)
  }, [index, translateX, translateY])

  const fly = React.useCallback(
    (direction: CardStackDirection, feedback: boolean) => {
      if (flyingRef.current || disabled) return
      if (indexRef.current >= dataRef.current.length) return
      flyingRef.current = true
      const sign = direction === "left" ? -1 : 1
      const distance = Math.max(width.value, 320) * 1.5
      translateX.value = withTiming(
        sign * distance,
        {
          duration: FLY_DURATION,
          easing: EASING,
          reduceMotion: ReduceMotion.System,
        },
        () => {
          runOnJS(commit)(direction, feedback)
        }
      )
    },
    [disabled, translateX, width, commit]
  )

  const swipe = React.useCallback(
    (direction: CardStackDirection) => fly(direction, false),
    [fly]
  )

  const swipeWithFeedback = React.useCallback(
    (direction: CardStackDirection) => fly(direction, true),
    [fly]
  )

  const undo = React.useCallback(() => {
    if (flyingRef.current) return
    const direction = history.at(-1)
    if (!direction || index === 0) return
    const previous = index - 1
    const item = data[previous]
    const sign = direction === "left" ? -1 : 1
    pendingRef.current = {
      index: previous,
      from: sign * Math.max(width.value, 320) * 1.5,
    }
    setHistory((entries) => entries.slice(0, -1))
    setIndex(previous)
    if (item !== undefined) onUndo?.(item, previous)
  }, [history, index, data, width, onUndo])

  const gesture = React.useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .activeOffsetX([-10, 10])
        .onUpdate((event) => {
          translateX.value = event.translationX
          translateY.value = event.translationY * 0.4
        })
        .onEnd((event) => {
          const passed =
            Math.abs(event.translationX) > threshold ||
            Math.abs(event.velocityX) > VELOCITY
          const sign =
            Math.abs(event.velocityX) > VELOCITY
              ? Math.sign(event.velocityX)
              : Math.sign(event.translationX)
          if (passed && sign !== 0) {
            runOnJS(swipeWithFeedback)(sign < 0 ? "left" : "right")
            return
          }
          translateX.value = withSpring(0, SPRING)
          translateY.value = withSpring(0, SPRING)
        }),
    [disabled, threshold, translateX, translateY, swipeWithFeedback]
  )

  const remaining = Math.max(data.length - index, 0)
  const contextValue = React.useMemo<CardStackContextProps>(
    () => ({
      index,
      count: data.length,
      remaining,
      canUndo: history.length > 0 && index > 0,
      disabled,
      swipe,
      undo,
    }),
    [index, data.length, remaining, history.length, disabled, swipe, undo]
  )
  const internalValue = React.useMemo(
    () => ({ swipeWithFeedback }),
    [swipeWithFeedback]
  )

  const nodes = React.Children.toArray(children)
  const empty = nodes.filter(
    (node) => React.isValidElement(node) && node.type === CardStackEmpty
  )
  const rest = nodes.filter((node) => !empty.includes(node))
  const visible = data
    .slice(index, index + visibleCount + 1)
    .map((item, offset) => ({ item, position: index + offset, depth: offset }))
    .reverse()

  return (
    <CardStackContext.Provider value={contextValue}>
      <CardStackInternalContext.Provider value={internalValue}>
        <View style={[styles.root, style]} {...props}>
          <View
            style={[styles.deck, deckStyle]}
            onLayout={(event) => {
              width.value = event.nativeEvent.layout.width
            }}
          >
            {remaining === 0 ? empty : null}
            {visible.map(({ item, position, depth }) => {
              const key = keyExtractor
                ? keyExtractor(item, position)
                : String(position)
              if (depth === 0) {
                return (
                  <TopCard
                    key={key}
                    translateX={translateX}
                    translateY={translateY}
                    width={width}
                    zIndex={visibleCount + 1}
                    gesture={gesture}
                    accessibilityLabel={itemAccessibilityLabel?.(
                      item,
                      position
                    )}
                    onAccessibilityAction={(event) => {
                      if (event.nativeEvent.actionName === "swipeLeft") {
                        swipeWithFeedback("left")
                      } else if (
                        event.nativeEvent.actionName === "swipeRight"
                      ) {
                        swipeWithFeedback("right")
                      }
                    }}
                  >
                    {renderItem(item, position)}
                  </TopCard>
                )
              }
              return (
                <StackCard
                  key={key}
                  depth={depth}
                  visibleCount={visibleCount}
                  translateX={translateX}
                  threshold={threshold}
                >
                  {renderItem(item, position)}
                </StackCard>
              )
            })}
          </View>
          {rest}
        </View>
      </CardStackInternalContext.Provider>
    </CardStackContext.Provider>
  )
}

function CardStackEmpty({
  style,
  children,
  ...props
}: ViewProps & React.RefAttributes<View>) {
  const { colors } = useTheme()
  return (
    <View
      style={[styles.empty, { borderColor: colors.separator }, style]}
      {...props}
    >
      {wrapText(children, {
        ...styles.emptyText,
        color: colors.labelSecondary,
      })}
    </View>
  )
}

function CardStackActions({
  style,
  ...props
}: ViewProps & React.RefAttributes<View>) {
  return <View style={[styles.actions, style]} {...props} />
}

function CardStackSwipeButton({
  direction,
  children,
  style,
  accessibilityLabel,
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onPress"> & {
  direction: CardStackDirection
}) {
  const { colors } = useTheme()
  const stack = useCardStack()
  const internal = React.useContext(CardStackInternalContext)
  return (
    <Button
      variant="outline"
      size="icon-lg"
      style={(state) => [
        styles.swipeButton,
        typeof style === "function" ? style(state) : style,
      ]}
      accessibilityLabel={
        accessibilityLabel ??
        (direction === "left" ? "Swipe left" : "Swipe right")
      }
      disabled={disabled || stack.disabled || stack.remaining === 0}
      onPress={() => internal?.swipeWithFeedback(direction)}
      {...props}
    >
      {children ?? (
        <Icon
          as={direction === "left" ? XIcon : HeartIcon}
          size={24}
          color={direction === "left" ? colors.danger : colors.accent}
        />
      )}
    </Button>
  )
}

function CardStackUndo({
  children,
  accessibilityLabel = "Undo",
  disabled,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onPress">) {
  const stack = useCardStack()
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled || !stack.canUndo}
      onPress={stack.undo}
      {...props}
    >
      {children ?? <Icon as={ArrowCounterClockwiseIcon} />}
    </Button>
  )
}

export type { CardStackDirection }
export {
  CardStack,
  CardStackActions,
  CardStackEmpty,
  CardStackSwipeButton,
  CardStackUndo,
  useCardStack,
}
