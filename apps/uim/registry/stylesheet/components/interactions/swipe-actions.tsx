import * as React from "react"
import {
  type AccessibilityActionEvent,
  I18nManager,
  Pressable,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native"
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable"
import {
  Easing,
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useHaptics } from "@/components/primitives/haptics"
import { AnimatedView } from "@/components/ui/animated-view"
import { IconSizeContext } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, type ThemeColors, useTheme } from "@/components/ui/theme"

type SwipeActionsSide = "leading" | "trailing"

type SwipeActionsContextProps = {
  close: () => void
  full: SwipeActionsSide | null
  offset: SharedValue<number>
  accessibilityActions: { name: string; label: string }[]
  onAccessibilityAction: (event: AccessibilityActionEvent) => void
}

const SwipeActionsContext =
  React.createContext<SwipeActionsContextProps | null>(null)

const SwipeActionsSideContext =
  React.createContext<SwipeActionsSide>("trailing")

function useSwipeActions() {
  const context = React.useContext(SwipeActionsContext)

  if (!context) {
    throw new Error("useSwipeActions must be used within a <SwipeActions />")
  }

  return context
}

const FULL_SWIPE_RATIO = 0.6
const EASING = Easing.bezier(0.32, 0.72, 0, 1)
const openRows = new Set<() => void>()

type SwipeActionElement = React.ReactElement<SwipeActionProps>

type SwipeActionsActionsElement = React.ReactElement<
  ViewProps & { side?: SwipeActionsSide; children?: React.ReactNode }
>

function textOf(node: unknown): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).filter(Boolean).join(" ")
  if (React.isValidElement<{ children?: unknown }>(node)) {
    return textOf(node.props.children)
  }
  return ""
}

function actionsOf(element: SwipeActionsActionsElement | undefined) {
  if (!element) return []
  return React.Children.toArray(element.props.children).filter(
    (child): child is SwipeActionElement =>
      React.isValidElement(child) && child.type === SwipeAction
  )
}

function ActionsLayer({
  physical,
  translation,
  offset,
  rowWidth,
  canFull,
  onFullChange,
  element,
}: {
  physical: "left" | "right"
  translation: SharedValue<number>
  offset: SharedValue<number>
  rowWidth: SharedValue<number>
  canFull: boolean
  onFullChange: (full: boolean) => void
  element: SwipeActionsActionsElement
}) {
  const { side = "trailing", style, ...props } = element.props
  const sign = physical === "left" ? 1 : -1

  useAnimatedReaction(
    () =>
      canFull &&
      rowWidth.value > 0 &&
      sign * (translation.value + offset.value) >
        rowWidth.value * FULL_SWIPE_RATIO,
    (next, previous) => {
      if (next !== previous) runOnJS(onFullChange)(next)
    }
  )

  const animatedStyle = useAnimatedStyle(() => ({
    minWidth: Math.max(0, sign * (translation.value + offset.value)),
  }))

  return (
    <SwipeActionsSideContext.Provider value={side}>
      <AnimatedView
        style={[
          styles.layer,
          { flexDirection: side === "leading" ? "row-reverse" : "row" },
          animatedStyle,
          style,
        ]}
        {...props}
      />
    </SwipeActionsSideContext.Provider>
  )
}

function SwipeActions({
  style,
  children,
  onOpenChange,
  ...props
}: ViewProps & {
  onOpenChange?: (side: SwipeActionsSide | null) => void
}) {
  const swipeableRef = React.useRef<SwipeableMethods>(null)
  const rowWidth = useSharedValue(0)
  const rowHeight = useSharedValue(0)
  const collapse = useSharedValue(-1)
  const offset = useSharedValue(0)
  const fullRef = React.useRef<SwipeActionsSide | null>(null)
  const committingRef = React.useRef(false)
  const mountedRef = React.useRef(true)
  const [full, setFull] = React.useState<SwipeActionsSide | null>(null)
  const [openSide, setOpenSide] = React.useState<SwipeActionsSide | null>(null)
  const haptics = useHaptics()

  const nodes = React.Children.toArray(children)
  const isActions = (node: React.ReactNode) =>
    React.isValidElement(node) && node.type === SwipeActionsActions
  const actionElements = nodes.filter(isActions) as SwipeActionsActionsElement[]
  const leading = actionElements.find((node) => node.props.side === "leading")
  const trailing = actionElements.find(
    (node) => (node.props.side ?? "trailing") === "trailing"
  )
  const content = nodes.filter((node) => !isActions(node))
  const leadingActions = actionsOf(leading)
  const trailingActions = actionsOf(trailing)
  const canFull = {
    leading: leadingActions.some((action) => action.props.fullSwipe),
    trailing: trailingActions.some((action) => action.props.fullSwipe),
  }
  const leftSide: SwipeActionsSide = I18nManager.isRTL ? "trailing" : "leading"
  const rightSide: SwipeActionsSide = I18nManager.isRTL ? "leading" : "trailing"
  const elements = { leading, trailing }

  const close = React.useCallback(() => {
    swipeableRef.current?.close()
  }, [])

  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      openRows.delete(close)
    }
  }, [close])

  const setFullSide = (side: SwipeActionsSide) => (next: boolean) => {
    if (committingRef.current) return
    if (next && fullRef.current !== side) haptics.impact("medium")
    const value = next
      ? side
      : fullRef.current === side
        ? null
        : fullRef.current
    fullRef.current = value
    setFull(value)
  }

  const commit = (side: SwipeActionsSide) => {
    const action = (side === "leading" ? leadingActions : trailingActions).find(
      (item) => item.props.fullSwipe
    )
    if (!action) return
    committingRef.current = true
    const sign = side === leftSide ? 1 : -1
    offset.value = withTiming(sign * rowWidth.value, {
      duration: 180,
      easing: EASING,
    })
    setTimeout(() => {
      collapse.value = rowHeight.value
      collapse.value = withTiming(0, { duration: 220, easing: EASING })
      setTimeout(() => {
        action.props.onPress?.()
        setTimeout(() => {
          if (!mountedRef.current) return
          swipeableRef.current?.reset()
          offset.value = 0
          collapse.value = -1
          committingRef.current = false
          fullRef.current = null
          setFull(null)
          setOpenSide(null)
          onOpenChange?.(null)
        }, 50)
      }, 220)
    }, 180)
  }

  const onWillOpen = (direction: "left" | "right") => {
    const side = direction === "right" ? leftSide : rightSide
    for (const closeRow of openRows) {
      if (closeRow !== close) closeRow()
    }
    openRows.add(close)
    if (fullRef.current === side) {
      commit(side)
      return
    }
    setOpenSide(side)
    onOpenChange?.(side)
  }

  const onClose = () => {
    openRows.delete(close)
    if (committingRef.current) return
    setOpenSide(null)
    onOpenChange?.(null)
  }

  const collapseStyle = useAnimatedStyle(() =>
    collapse.value < 0 ? {} : { height: collapse.value }
  )

  const allActions = [...leadingActions, ...trailingActions]
  const accessibilityActions = allActions.map((action, index) => ({
    name: `swipe-action-${index}`,
    label:
      action.props.accessibilityLabel ??
      (textOf(action.props.children) || "Action"),
  }))

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    const match = /^swipe-action-(\d+)$/.exec(event.nativeEvent.actionName)
    if (!match) return
    allActions[Number(match[1])]?.props.onPress?.()
  }

  const renderLayer =
    (physical: "left" | "right") =>
    (_progress: SharedValue<number>, translation: SharedValue<number>) => {
      const side = physical === "left" ? leftSide : rightSide
      const element = elements[side]
      if (!element) return null
      return (
        <View
          style={styles.fill}
          importantForAccessibility={
            openSide === side ? "auto" : "no-hide-descendants"
          }
          accessibilityElementsHidden={openSide !== side}
        >
          <ActionsLayer
            physical={physical}
            translation={translation}
            offset={offset}
            rowWidth={rowWidth}
            canFull={canFull[side]}
            onFullChange={setFullSide(side)}
            element={element}
          />
        </View>
      )
    }

  return (
    <SwipeActionsContext.Provider
      value={{
        close,
        full,
        offset,
        accessibilityActions,
        onAccessibilityAction,
      }}
    >
      <AnimatedView
        role="group"
        style={[styles.root, collapseStyle, style]}
        onLayout={(event) => {
          rowWidth.value = event.nativeEvent.layout.width
          if (collapse.value < 0) {
            rowHeight.value = event.nativeEvent.layout.height
          }
        }}
        {...props}
      >
        <ReanimatedSwipeable
          ref={swipeableRef}
          friction={1}
          overshootFriction={1}
          overshootLeft={canFull[leftSide]}
          overshootRight={canFull[rightSide]}
          renderLeftActions={
            elements[leftSide] ? renderLayer("left") : undefined
          }
          renderRightActions={
            elements[rightSide] ? renderLayer("right") : undefined
          }
          onSwipeableWillOpen={onWillOpen}
          onSwipeableClose={onClose}
        >
          {content}
        </ReanimatedSwipeable>
      </AnimatedView>
    </SwipeActionsContext.Provider>
  )
}

function SwipeActionsContent({
  style,
  accessibilityActions,
  onAccessibilityAction,
  ...props
}: ViewProps) {
  const context = useSwipeActions()
  const { colors } = useTheme()
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: context.offset.value }],
  }))

  return (
    <AnimatedView
      accessible
      accessibilityActions={[
        ...(accessibilityActions ?? []),
        ...context.accessibilityActions,
      ]}
      onAccessibilityAction={(event) => {
        context.onAccessibilityAction(event)
        onAccessibilityAction?.(event)
      }}
      style={[
        styles.content,
        { backgroundColor: colors.surface },
        animatedStyle,
        style,
      ]}
      {...props}
    />
  )
}

function SwipeActionsActions(
  _props: ViewProps & { side?: SwipeActionsSide; children?: React.ReactNode }
) {
  return null
}

type SwipeActionVariant = "default" | "destructive" | "archive" | "neutral"

function swipeActionColor(variant: SwipeActionVariant, colors: ThemeColors) {
  switch (variant) {
    case "destructive":
      return colors.danger
    case "archive":
      return colors.purple
    case "neutral":
      return colors.gray
    default:
      return colors.accent
  }
}

const styles = StyleSheet.create({
  root: { position: "relative", overflow: "hidden" },
  fill: { height: "100%" },
  layer: { height: "100%", overflow: "hidden" },
  content: { position: "relative", zIndex: 10 },
  action: {
    minWidth: 72,
    flex: 1,
    flexBasis: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    overflow: "hidden",
    paddingHorizontal: 12,
  },
  collapsed: {
    width: 0,
    minWidth: 0,
    flexGrow: 0,
    paddingHorizontal: 0,
    opacity: 0,
  },
})

type SwipeActionProps = Omit<
  React.ComponentProps<typeof Pressable>,
  "onPress"
> & {
  variant?: SwipeActionVariant
  fullSwipe?: boolean
  onPress?: () => void
}

function SwipeAction({
  variant = "default",
  fullSwipe = false,
  style,
  onPress,
  ...props
}: SwipeActionProps) {
  const { close, full } = useSwipeActions()
  const side = React.useContext(SwipeActionsSideContext)
  const { colors } = useTheme()
  const expanding = full === side
  return (
    <TextStyleContext.Provider
      value={{
        ...fontSize.xs,
        fontWeight: "500",
        textAlign: "center",
        color: colors.onAccent,
      }}
    >
      <IconSizeContext.Provider value={20}>
        <Pressable
          role="button"
          style={(state) => [
            styles.action,
            { backgroundColor: swipeActionColor(variant, colors) },
            state.pressed && { opacity: 0.8 },
            expanding && !fullSwipe && styles.collapsed,
            typeof style === "function" ? style(state) : style,
          ]}
          onPress={() => {
            onPress?.()
            close()
          }}
          {...props}
        />
      </IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

export {
  SwipeAction,
  SwipeActions,
  SwipeActionsActions,
  SwipeActionsContent,
  useSwipeActions,
}
