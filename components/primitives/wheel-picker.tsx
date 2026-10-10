import * as React from "react"
import {
  type AccessibilityActionEvent,
  Animated,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  type ScrollView,
  View,
  type ViewStyle,
} from "react-native"
import { createChangeEventDetails } from "./event-details"
import { useEffectEvent } from "./hooks"
import type {
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  ChangeEvent,
} from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

const WHEEL_PICKER_REASONS = {
  scroll: "scroll",
  itemPress: "item-press",
  accessibilityAction: "accessibility-action",
  none: "none",
} as const

type ChangeEventReason =
  (typeof WHEEL_PICKER_REASONS)[keyof typeof WHEEL_PICKER_REASONS]

type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>

const DEFAULT_ITEM_HEIGHT = 32
const VISIBLE_HEIGHT = 6.75
const ROW_ANGLE = Math.PI / 10.5
const MAX_ANGLE = Math.PI / 2
const PERSPECTIVE = 1200
const FADE_ANGLE = 0.35
const VISIBLE_ROWS = MAX_ANGLE / ROW_ANGLE
const CURVE_STEPS = 42
const SETTLE_DELAY = 120

function curve(distance: number, height: number) {
  const radius = height / ROW_ANGLE
  const angle = Math.min(Math.max(distance * ROW_ANGLE, -MAX_ANGLE), MAX_ANGLE)
  const offset = Math.abs(distance)
  const tone = offset < 1 ? 1 - offset * 0.45 : 0.55 - (offset - 1) * 0.06
  const fade = Math.min(1, (MAX_ANGLE - Math.abs(angle)) / FADE_ANGLE)
  const depth = PERSPECTIVE / (PERSPECTIVE + radius - radius * Math.cos(angle))
  return {
    translateY: radius * Math.sin(angle) - distance * height,
    scaleX: depth,
    scaleY: Math.max(depth * Math.cos(angle), 0.001),
    opacity: Math.max(0, tone * fade),
  }
}

function itemAnimatedStyle(
  scrollY: Animated.Value,
  index: number,
  height: number
) {
  const inputRange: number[] = []
  const translateY: number[] = []
  const scaleX: number[] = []
  const scaleY: number[] = []
  const opacity: number[] = []
  for (let step = 0; step <= CURVE_STEPS; step++) {
    const distance = VISIBLE_ROWS * (1 - (2 * step) / CURVE_STEPS)
    const point = curve(distance, height)
    inputRange.push((index - distance) * height)
    translateY.push(point.translateY)
    scaleX.push(point.scaleX)
    scaleY.push(point.scaleY)
    opacity.push(point.opacity)
  }
  const interpolate = (outputRange: number[]) =>
    scrollY.interpolate({ inputRange, outputRange, extrapolate: "clamp" })
  return {
    opacity: interpolate(opacity),
    transform: [
      { translateY: interpolate(translateY) },
      { scaleX: interpolate(scaleX) },
      { scaleY: interpolate(scaleY) },
    ],
  }
}

interface RootState {
  itemHeight: number
}

type IndicatorState = RootState

interface ColumnState {
  value: string | undefined
  itemHeight: number
}

interface ItemState {
  value: string
  index: number
  selected: boolean
  disabled: boolean
}

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  itemHeight?: number | undefined
}

type IndicatorProps = BaseUIComponentProps<typeof View, IndicatorState>

type ColumnProps = Omit<
  BaseUIComponentProps<typeof ScrollView, ColumnState>,
  "children" | "onScroll"
> & {
  children?: React.ReactNode
  value?: string | undefined
  defaultValue?: string | undefined
  onValueChange?:
    | ((value: string, eventDetails: ChangeEventDetails) => void)
    | undefined
}

type ItemProps = Omit<
  BaseUIComponentProps<typeof Pressable, ItemState>,
  "children"
> & {
  children?: React.ReactNode
  value: string
  disabled?: boolean | undefined
}

interface RootContextValue {
  itemHeight: number
}

interface ColumnContextValue {
  value: string | undefined
  itemHeight: number
  getItemStyle: (index: number) => Animated.WithAnimatedObject<ViewStyle>
  pressItem: (index: number, event: GestureResponderEvent) => void
}

const RootContext = React.createContext<RootContextValue>({
  itemHeight: DEFAULT_ITEM_HEIGHT,
})

const ColumnContext = React.createContext<ColumnContextValue | null>(null)

const ItemIndexContext = React.createContext(0)

function useRootContext() {
  return React.useContext(RootContext)
}

function useColumnContext() {
  const context = React.useContext(ColumnContext)
  if (!context) {
    throw new Error(
      "WheelPicker.Item must be rendered inside WheelPicker.Column"
    )
  }
  return context
}

function Root({
  itemHeight = DEFAULT_ITEM_HEIGHT,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const state = React.useMemo<RootState>(() => ({ itemHeight }), [itemHeight])
  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [elementProps],
  })
  return <RootContext.Provider value={state}>{element}</RootContext.Provider>
}

Root.displayName = "WheelPickerRoot"

function Indicator({
  render,
  className,
  style,
  ref,
  ...elementProps
}: IndicatorProps) {
  const { itemHeight } = useRootContext()
  const state = React.useMemo<IndicatorState>(
    () => ({ itemHeight }),
    [itemHeight]
  )
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        accessible: false,
        importantForAccessibility: "no-hide-descendants",
        style: {
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: itemHeight,
          marginTop: -itemHeight / 2,
          pointerEvents: "none",
        },
      },
      elementProps,
    ],
  })
}

Indicator.displayName = "WheelPickerIndicator"

type ItemEntry = {
  value: string
  disabled: boolean
  label: string
}

function textOf(node: React.ReactNode): string | undefined {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) {
    const parts = node.map(textOf).filter((part) => part !== undefined)
    return parts.length > 0 ? parts.join("") : undefined
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return textOf(node.props.children)
  }
  return undefined
}

function nearestEnabled(items: readonly ItemEntry[], from: number) {
  for (let distance = 0; distance < items.length; distance++) {
    if (items[from - distance] && !items[from - distance]?.disabled) {
      return from - distance
    }
    if (items[from + distance] && !items[from + distance]?.disabled) {
      return from + distance
    }
  }
  return -1
}

function enabledFrom(items: readonly ItemEntry[], from: number, step: 1 | -1) {
  for (let index = from; index >= 0 && index < items.length; index += step) {
    if (!items[index]?.disabled) return index
  }
  return -1
}

function Column({
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ColumnProps) {
  const { itemHeight } = useRootContext()
  const [value, setValue] = useControllableState<
    string | undefined,
    ChangeEventDetails
  >({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as
      | ((value: string | undefined, details: ChangeEventDetails) => void)
      | undefined,
  })

  const elements = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<ItemProps> =>
      React.isValidElement<ItemProps>(child)
  )
  const items: ItemEntry[] = elements.map((child) => ({
    value: child.props.value,
    disabled: !!child.props.disabled,
    label: textOf(child.props.children) ?? child.props.value,
  }))
  const itemsRef = React.useRef(items)
  itemsRef.current = items

  const indexOf = (target: string | undefined) =>
    target === undefined
      ? -1
      : itemsRef.current.findIndex((item) => item.value === target)

  const initialIndex = Math.max(indexOf(value), 0)
  const scrollY = React.useRef(
    new Animated.Value(initialIndex * itemHeight)
  ).current
  const scrollRef = React.useRef<ScrollView | null>(null)
  const offsetRef = React.useRef(initialIndex * itemHeight)
  const settleRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const interactingRef = React.useRef(false)
  const [height, setHeight] = React.useState(itemHeight * VISIBLE_HEIGHT)
  const padding = Math.max(0, (height - itemHeight) / 2)

  const styleCache = React.useRef(
    new Map<number, Animated.WithAnimatedObject<ViewStyle>>()
  )
  const cachedHeight = React.useRef(itemHeight)
  if (cachedHeight.current !== itemHeight) {
    cachedHeight.current = itemHeight
    styleCache.current.clear()
  }

  const getItemStyle = React.useCallback(
    (index: number) => {
      let cached = styleCache.current.get(index)
      if (!cached) {
        cached = itemAnimatedStyle(scrollY, index, itemHeight)
        styleCache.current.set(index, cached)
      }
      return cached
    },
    [scrollY, itemHeight]
  )

  const scrollToIndex = React.useCallback(
    (index: number, animated: boolean) => {
      scrollRef.current?.scrollTo({ y: index * itemHeight, animated })
    },
    [itemHeight]
  )

  const select = useEffectEvent(
    (index: number, reason: ChangeEventReason, event?: ChangeEvent) => {
      const item = itemsRef.current[index]
      if (!item || item.disabled) return
      setValue(item.value, createChangeEventDetails(reason, event))
    }
  )

  const clearSettle = React.useCallback(() => {
    if (settleRef.current) clearTimeout(settleRef.current)
    settleRef.current = null
  }, [])

  React.useEffect(() => clearSettle, [clearSettle])

  const settle = useEffectEvent((event?: ChangeEvent) => {
    clearSettle()
    interactingRef.current = false
    const list = itemsRef.current
    if (list.length === 0) return
    const centered = Math.min(
      Math.max(Math.round(offsetRef.current / itemHeight), 0),
      list.length - 1
    )
    const index = nearestEnabled(list, centered)
    if (index === -1) return
    if (index !== centered) scrollToIndex(index, true)
    select(index, WHEEL_PICKER_REASONS.scroll, event)
  })

  const onScroll = React.useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
        listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          offsetRef.current = event.nativeEvent.contentOffset.y
        },
      }),
    [scrollY]
  )

  const pressItem = useEffectEvent(
    (index: number, event: GestureResponderEvent) => {
      if (itemsRef.current[index]?.disabled) return
      scrollToIndex(index, true)
      select(index, WHEEL_PICKER_REASONS.itemPress, event)
    }
  )

  const measuredRef = React.useRef(false)

  const onLayout = (event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height)
    if (!measuredRef.current) {
      measuredRef.current = true
      requestAnimationFrame(() =>
        scrollToIndex(Math.max(indexOf(value), 0), false)
      )
    }
  }

  const valueIndex = indexOf(value)

  React.useEffect(() => {
    if (valueIndex === -1 || interactingRef.current) return
    if (Math.round(offsetRef.current / itemHeight) === valueIndex) return
    scrollToIndex(valueIndex, true)
  }, [valueIndex, itemHeight, scrollToIndex])

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    const name = event.nativeEvent.actionName
    if (name !== "increment" && name !== "decrement") return
    const list = itemsRef.current
    const current = Math.max(indexOf(value), 0)
    const target =
      name === "increment"
        ? enabledFrom(list, current + 1, 1)
        : enabledFrom(list, current - 1, -1)
    if (target === -1) return
    scrollToIndex(target, true)
    select(target, WHEEL_PICKER_REASONS.accessibilityAction, event)
  }

  const selectedLabel = items.find((item) => item.value === value)?.label

  const state = React.useMemo<ColumnState>(
    () => ({ value, itemHeight }),
    [value, itemHeight]
  )

  const context = React.useMemo<ColumnContextValue>(
    () => ({ value, itemHeight, getItemStyle, pressItem }),
    [value, itemHeight, getItemStyle, pressItem]
  )

  const element = useRender({
    defaultComponent: Animated.ScrollView,
    render,
    className,
    style,
    state,
    ref: [ref, scrollRef],
    props: [
      {
        style: { height: itemHeight * VISIBLE_HEIGHT },
        contentContainerStyle: { paddingVertical: padding },
        contentOffset: { x: 0, y: initialIndex * itemHeight },
        snapToInterval: itemHeight,
        decelerationRate: "fast",
        showsVerticalScrollIndicator: false,
        scrollEventThrottle: 16,
        onScroll,
        onLayout,
        onScrollBeginDrag: () => {
          clearSettle()
          interactingRef.current = true
        },
        onMomentumScrollBegin: clearSettle,
        onScrollEndDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          clearSettle()
          settleRef.current = setTimeout(() => settle(event), SETTLE_DELAY)
        },
        onMomentumScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) =>
          settle(event),
        accessible: true,
        accessibilityRole: "adjustable",
        accessibilityValue:
          selectedLabel === undefined ? undefined : { text: selectedLabel },
        accessibilityActions: [{ name: "increment" }, { name: "decrement" }],
        onAccessibilityAction,
        children: elements.map((child, index) => (
          <ItemIndexContext.Provider key={child.key ?? index} value={index}>
            {child}
          </ItemIndexContext.Provider>
        )),
      },
      elementProps,
    ],
  })

  return (
    <ColumnContext.Provider value={context}>{element}</ColumnContext.Provider>
  )
}

Column.displayName = "WheelPickerColumn"

function Item({
  value,
  disabled = false,
  children,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ItemProps) {
  const column = useColumnContext()
  const index = React.useContext(ItemIndexContext)
  const selected = column.value === value
  const state = React.useMemo<ItemState>(
    () => ({ value, index, selected, disabled }),
    [value, index, selected, disabled]
  )
  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        disabled,
        style: { height: column.itemHeight },
        onPress: (event: GestureResponderEvent) =>
          column.pressItem(index, event),
        children: (
          <Animated.View style={column.getItemStyle(index)}>
            {children}
          </Animated.View>
        ),
      },
      elementProps,
    ],
  })
}

Item.displayName = "WheelPickerItem"

export type {
  ChangeEventDetails,
  ChangeEventReason,
  ColumnProps,
  ColumnState,
  IndicatorProps,
  IndicatorState,
  ItemProps,
  ItemState,
  RootProps,
  RootState,
}
export {
  Column,
  Indicator,
  Item,
  Root,
  useColumnContext,
  useRootContext,
  WHEEL_PICKER_REASONS,
}
