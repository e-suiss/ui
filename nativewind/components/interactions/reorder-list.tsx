import { cn } from "cn"
import { DotsSixVerticalIcon } from "phosphor-react-native"
import * as React from "react"
import { View, type ViewProps } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import {
  Easing,
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useHaptics } from "@/components/primitives/haptics"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"

type ReorderListContextProps = {
  order: SharedValue<string[]>
  heights: SharedValue<Record<string, number>>
  active: SharedValue<string | null>
  start: SharedValue<number>
  target: SharedValue<number>
  dragY: SharedValue<number>
  activeKey: string | null
  setActiveKey: (key: string | null) => void
  commit: (next: string[]) => void
  move: (key: string, delta: number) => void
  setHeight: (key: string, height: number) => void
  value: string[]
  moveUpLabel: string
  moveDownLabel: string
}

const ReorderListContext = React.createContext<ReorderListContextProps | null>(
  null
)

const ReorderListItemContext = React.createContext<string | null>(null)

function useReorderListItemKey(): string {
  const key = React.useContext(ReorderListItemContext)
  if (key === null) {
    throw new Error(
      "ReorderListHandle must be used within a <ReorderListItem />"
    )
  }
  return key
}

function useReorderList() {
  const context = React.useContext(ReorderListContext)
  if (!context) {
    throw new Error("useReorderList must be used within a <ReorderList />")
  }
  return context
}

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

const DURATION = 200

function moveItem(list: string[], from: number, to: number) {
  "worklet"
  const next = list.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function targetIndex(
  order: string[],
  heights: Record<string, number>,
  from: number,
  dy: number
) {
  "worklet"
  let target = from
  let travelled = 0
  if (dy > 0) {
    for (let index = from + 1; index < order.length; index += 1) {
      const height = heights[order[index]] ?? 0
      if (dy <= travelled + height / 2) break
      travelled += height
      target = index
    }
  } else {
    for (let index = from - 1; index >= 0; index -= 1) {
      const height = heights[order[index]] ?? 0
      if (-dy <= travelled + height / 2) break
      travelled += height
      target = index
    }
  }
  return target
}

function dropOffset(
  order: string[],
  heights: Record<string, number>,
  from: number,
  to: number
) {
  "worklet"
  let offset = 0
  if (to > from) {
    for (let index = from + 1; index <= to; index += 1) {
      offset += heights[order[index]] ?? 0
    }
  } else {
    for (let index = to; index < from; index += 1) {
      offset -= heights[order[index]] ?? 0
    }
  }
  return offset
}

function ReorderList({
  value,
  onValueChange,
  moveUpLabel = "Move up",
  moveDownLabel = "Move down",
  className,
  children,
  ...props
}: ViewProps & {
  value: string[]
  onValueChange: (value: string[]) => void
  moveUpLabel?: string
  moveDownLabel?: string
}) {
  const order = useSharedValue(value)
  const heights = useSharedValue<Record<string, number>>({})
  const active = useSharedValue<string | null>(null)
  const start = useSharedValue(-1)
  const target = useSharedValue(-1)
  const dragY = useSharedValue(0)
  const [activeKey, setActiveKey] = React.useState<string | null>(null)
  const pendingRef = React.useRef(false)

  const reset = React.useCallback(() => {
    pendingRef.current = false
    active.value = null
    dragY.value = 0
    setActiveKey(null)
  }, [active, dragY])

  React.useLayoutEffect(() => {
    order.value = value
    if (pendingRef.current) reset()
  }, [value, order, reset])

  const commit = React.useCallback(
    (next: string[]) => {
      pendingRef.current = true
      onValueChange(next)
      requestAnimationFrame(() => {
        if (pendingRef.current) reset()
      })
    },
    [onValueChange, reset]
  )

  const move = React.useCallback(
    (key: string, delta: number) => {
      const from = value.indexOf(key)
      const to = Math.min(Math.max(from + delta, 0), value.length - 1)
      if (from < 0 || from === to) return
      onValueChange(moveItem(value, from, to))
    },
    [value, onValueChange]
  )

  const setHeight = React.useCallback(
    (key: string, height: number) => {
      heights.modify((current) => {
        "worklet"
        current[key] = height
        return current
      })
    },
    [heights]
  )

  const items = new Map<string, React.ReactNode>()
  for (const child of React.Children.toArray(children)) {
    if (React.isValidElement<{ value?: string }>(child) && child.props.value) {
      items.set(child.props.value, child)
    }
  }

  const context = React.useMemo<ReorderListContextProps>(
    () => ({
      order,
      heights,
      active,
      start,
      target,
      dragY,
      activeKey,
      setActiveKey,
      commit,
      move,
      setHeight,
      value,
      moveUpLabel,
      moveDownLabel,
    }),
    [
      order,
      heights,
      active,
      start,
      target,
      dragY,
      activeKey,
      commit,
      move,
      setHeight,
      value,
      moveUpLabel,
      moveDownLabel,
    ]
  )

  return (
    <ReorderListContext.Provider value={context}>
      <View className={className} {...props}>
        {value.map((key) => items.get(key) ?? null)}
      </View>
    </ReorderListContext.Provider>
  )
}

function ReorderListItem({
  value,
  className,
  style,
  onLayout,
  ...props
}: ViewProps & {
  value: string
}) {
  const { order, heights, active, start, target, dragY, activeKey, setHeight } =
    useReorderList()

  const animatedStyle = useAnimatedStyle(() => {
    const current = active.value
    if (current === null) {
      return { zIndex: 0, transform: [{ translateY: 0 }] }
    }
    if (current === value) {
      return { zIndex: 10, transform: [{ translateY: dragY.value }] }
    }
    const index = order.value.indexOf(value)
    const from = start.value
    const to = target.value
    const height = heights.value[current] ?? 0
    let shift = 0
    if (from < index && index <= to) shift = -height
    else if (to <= index && index < from) shift = height
    return {
      zIndex: 0,
      transform: [
        {
          translateY: withTiming(shift, { duration: DURATION, easing: EASING }),
        },
      ],
    }
  })

  return (
    <ReorderListItemContext.Provider value={value}>
      <AnimatedView
        className={cn(
          "flex-row items-center gap-3 bg-surface",
          activeKey === value && "bg-surface-raised shadow-lg",
          className
        )}
        style={[animatedStyle, style]}
        onLayout={(event) => {
          setHeight(value, event.nativeEvent.layout.height)
          onLayout?.(event)
        }}
        {...props}
      />
    </ReorderListItemContext.Provider>
  )
}

function ReorderListHandle({
  className,
  accessibilityLabel = "Reorder",
  ...props
}: ViewProps) {
  const {
    order,
    heights,
    active,
    start,
    target,
    dragY,
    setActiveKey,
    commit,
    move,
    value,
    moveUpLabel,
    moveDownLabel,
  } = useReorderList()
  const key = useReorderListItemKey()
  const { impact, selection } = useHaptics()

  const gesture = React.useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .onStart(() => {
          const index = order.value.indexOf(key)
          start.value = index
          target.value = index
          dragY.value = 0
          active.value = key
          runOnJS(setActiveKey)(key)
          runOnJS(impact)("medium")
        })
        .onUpdate((event) => {
          dragY.value = event.translationY
          const next = targetIndex(
            order.value,
            heights.value,
            start.value,
            event.translationY
          )
          if (next !== target.value) {
            target.value = next
            runOnJS(selection)()
          }
        })
        .onEnd(() => {
          runOnJS(impact)("light")
          const from = start.value
          const to = target.value
          if (from === to || from < 0) {
            dragY.value = withTiming(
              0,
              { duration: DURATION, easing: EASING },
              () => {
                active.value = null
                runOnJS(setActiveKey)(null)
              }
            )
            return
          }
          const offset = dropOffset(order.value, heights.value, from, to)
          const next = moveItem(order.value, from, to)
          dragY.value = withTiming(
            offset,
            { duration: DURATION, easing: EASING },
            () => {
              runOnJS(commit)(next)
            }
          )
        }),
    [
      key,
      order,
      heights,
      active,
      start,
      target,
      dragY,
      setActiveKey,
      commit,
      impact,
      selection,
    ]
  )

  const index = value.indexOf(key)
  const actions = [
    ...(index > 0 ? [{ name: "moveUp", label: moveUpLabel }] : []),
    ...(index >= 0 && index < value.length - 1
      ? [{ name: "moveDown", label: moveDownLabel }]
      : []),
  ]

  return (
    <GestureDetector gesture={gesture}>
      <View
        accessible
        role="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityActions={actions}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === "moveUp") move(key, -1)
          if (event.nativeEvent.actionName === "moveDown") move(key, 1)
        }}
        className={cn("size-11 items-center justify-center", className)}
        {...props}
      >
        <Icon
          as={DotsSixVerticalIcon}
          weight="bold"
          className="size-5 text-label-tertiary"
        />
      </View>
    </GestureDetector>
  )
}

export { ReorderList, ReorderListHandle, ReorderListItem }
