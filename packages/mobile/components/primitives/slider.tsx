import * as React from "react"
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  I18nManager,
  type LayoutChangeEvent,
  PanResponder,
  Text,
  View,
  type ViewStyle,
} from "react-native"
import {
  createChangeEventDetails,
  createGenericEventDetails,
} from "./event-details"
import { useHaptics } from "./haptics"
import { useEffectEvent } from "./hooks"
import type {
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  BaseUIGenericEventDetails,
  ChangeEvent,
  Orientation,
} from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

const SLIDER_REASONS = {
  trackPress: "track-press",
  drag: "drag",
  accessibilityAction: "accessibility-action",
  none: "none",
} as const

type ChangeEventReason = (typeof SLIDER_REASONS)[keyof typeof SLIDER_REASONS]

type CommitEventReason = ChangeEventReason

interface ChangeEventCustomProperties {
  activeThumbIndex: number
}

type ChangeEventDetails = BaseUIChangeEventDetails<
  ChangeEventReason,
  ChangeEventCustomProperties
>

type CommitEventDetails = BaseUIGenericEventDetails<CommitEventReason>

type SliderValue = number | readonly number[]

type ThumbAlignment = "center" | "edge"

type ThumbCollisionBehavior = "push" | "swap" | "none"

interface RootState {
  activeThumbIndex: number
  disabled: boolean
  dragging: boolean
  max: number
  min: number
  minStepsBetweenValues: number
  orientation: Orientation
  step: number
  values: readonly number[]
}

type LabelState = RootState

type ValueState = RootState

type ControlState = RootState

type TrackState = RootState

type IndicatorState = RootState

interface ThumbState extends RootState {
  index: number
  active: boolean
}

type ResolvedValue<Value extends SliderValue> = Value extends number
  ? number
  : Value

type RootProps<Value extends SliderValue = SliderValue> = Omit<
  BaseUIComponentProps<typeof View, RootState>,
  "children"
> & {
  children?: React.ReactNode
  defaultValue?: Value | undefined
  value?: Value | undefined
  onValueChange?:
    | ((value: ResolvedValue<Value>, eventDetails: ChangeEventDetails) => void)
    | undefined
  onValueCommitted?:
    | ((value: ResolvedValue<Value>, eventDetails: CommitEventDetails) => void)
    | undefined
  disabled?: boolean | undefined
  format?: Intl.NumberFormatOptions | undefined
  locale?: Intl.LocalesArgument | undefined
  max?: number | undefined
  min?: number | undefined
  minStepsBetweenValues?: number | undefined
  orientation?: Orientation | undefined
  step?: number | undefined
  largeStep?: number | undefined
  thumbAlignment?: ThumbAlignment | undefined
  thumbCollisionBehavior?: ThumbCollisionBehavior | undefined
}

type LabelProps = BaseUIComponentProps<typeof Text, LabelState>

type ValueProps = Omit<
  BaseUIComponentProps<typeof Text, ValueState>,
  "children"
> & {
  children?:
    | null
    | ((
        formattedValues: readonly string[],
        values: readonly number[]
      ) => React.ReactNode)
    | undefined
}

type ControlProps = BaseUIComponentProps<typeof View, ControlState>

type TrackProps = BaseUIComponentProps<typeof View, TrackState>

type IndicatorProps = BaseUIComponentProps<typeof View, IndicatorState>

type ThumbProps = BaseUIComponentProps<typeof View, ThumbState> & {
  index?: number | undefined
  disabled?: boolean | undefined
  getAccessibilityLabel?: ((index: number) => string) | null | undefined
  getAccessibilityValueText?:
    | ((formattedValue: string, value: number, index: number) => string)
    | null
    | undefined
}

interface Size {
  width: number
  height: number
}

interface RootContextValue {
  state: RootState
  values: readonly number[]
  min: number
  max: number
  step: number
  largeStep: number
  orientation: Orientation
  disabled: boolean
  thumbAlignment: ThumbAlignment
  thumbSize: Size
  labelId: string
  hasLabel: boolean
  setHasLabel: (hasLabel: boolean) => void
  formatValue: (value: number) => string
  getRatio: (value: number) => number
  setThumbSize: (size: Size) => void
  setThumbValue: (
    index: number,
    value: number,
    reason: ChangeEventReason,
    event?: ChangeEvent
  ) => readonly number[] | null
  commitValues: (
    values: readonly number[],
    reason: CommitEventReason,
    event?: ChangeEvent
  ) => void
  setDragging: (dragging: boolean) => void
  setActiveThumbIndex: (index: number) => void
  activeThumbIndexRef: React.RefObject<number>
}

const RootContext = React.createContext<RootContextValue | null>(null)

function accessibilityStep(event: AccessibilityActionEvent) {
  if (event.nativeEvent.actionName === "increment") return 1
  if (event.nativeEvent.actionName === "decrement") return -1
  return 0
}

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error("Slider parts must be rendered inside Slider.Root")
  }
  return context
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getDecimalPrecision(value: number) {
  if (Math.abs(value) < 1) {
    const parts = value.toExponential().split("e-")
    const fraction = parts[0]?.split(".")[1]
    return (
      (fraction ? fraction.length : 0) + Number.parseInt(parts[1] ?? "0", 10)
    )
  }
  const fraction = value.toString().split(".")[1]
  return fraction ? fraction.length : 0
}

function roundToStep(value: number, step: number, min: number) {
  const rounded = Math.round((value - min) / step) * step + min
  return Number(rounded.toFixed(getDecimalPrecision(step)))
}

function toArray(value: SliderValue | undefined, fallback: number) {
  if (value === undefined) return [fallback]
  return typeof value === "number" ? [value] : [...value]
}

function areEqual(a: readonly number[], b: readonly number[]) {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

function findClosestIndex(values: readonly number[], target: number) {
  let closest = 0
  let distance = Number.POSITIVE_INFINITY
  values.forEach((value, index) => {
    const current = Math.abs(value - target)
    if (current < distance || (current === distance && target > value)) {
      closest = index
      distance = current
    }
  })
  return closest
}

function resolveCollisions(
  values: readonly number[],
  index: number,
  next: number,
  behavior: ThumbCollisionBehavior,
  gap: number,
  min: number,
  max: number
): readonly [number[], number] {
  const result = [...values]
  const last = values.length - 1
  if (behavior === "swap") {
    result[index] = next
    const sorted = [...result].sort((a, b) => a - b)
    const previous = values[index] ?? next
    const nextIndex =
      next > previous ? sorted.lastIndexOf(next) : sorted.indexOf(next)
    return [sorted, nextIndex]
  }
  if (behavior === "none") {
    const lower = index > 0 ? (values[index - 1] ?? min) + gap : min
    const upper = index < last ? (values[index + 1] ?? max) - gap : max
    result[index] = clamp(next, lower, upper)
    return [result, index]
  }
  result[index] = clamp(next, min + index * gap, max - (last - index) * gap)
  for (let cursor = index + 1; cursor <= last; cursor += 1) {
    result[cursor] = Math.max(
      result[cursor] ?? max,
      (result[cursor - 1] ?? min) + gap
    )
  }
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    result[cursor] = Math.min(
      result[cursor] ?? min,
      (result[cursor + 1] ?? max) - gap
    )
  }
  return [result, index]
}

function Root<Value extends SliderValue = SliderValue>({
  children,
  defaultValue,
  value: valueProp,
  onValueChange,
  onValueCommitted,
  disabled = false,
  format,
  locale,
  max = 100,
  min = 0,
  minStepsBetweenValues = 0,
  orientation = "horizontal",
  step = 1,
  largeStep = 10,
  thumbAlignment = "center",
  thumbCollisionBehavior = "push",
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps<Value>) {
  const isRange = Array.isArray(valueProp ?? defaultValue)
  const controlledValues = React.useMemo(
    () => (valueProp === undefined ? undefined : toArray(valueProp, min)),
    [valueProp, min]
  )
  const [initialValues] = React.useState(() => toArray(defaultValue, min))

  const emitChange = useEffectEvent(
    (next: readonly number[], details: ChangeEventDetails) => {
      const output = (isRange ? next : next[0]) as ResolvedValue<Value>
      onValueChange?.(output, details)
    }
  )

  const [values, setValues] = useControllableState<
    readonly number[],
    ChangeEventDetails
  >({
    value: controlledValues,
    defaultValue: initialValues,
    onChange: emitChange,
  })

  const [dragging, setDragging] = React.useState(false)
  const [activeThumbIndex, setActiveThumbIndexState] = React.useState(-1)
  const activeThumbIndexRef = React.useRef(-1)
  const [thumbSize, setThumbSizeState] = React.useState<Size>({
    width: 0,
    height: 0,
  })
  const labelId = React.useId()
  const [hasLabel, setHasLabel] = React.useState(false)

  const setActiveThumbIndex = React.useCallback((index: number) => {
    activeThumbIndexRef.current = index
    setActiveThumbIndexState(index)
  }, [])

  const setThumbSize = React.useCallback((size: Size) => {
    setThumbSizeState((previous) =>
      previous.width === size.width && previous.height === size.height
        ? previous
        : size
    )
  }, [])

  const formatter = React.useMemo(
    () => new Intl.NumberFormat(locale, format),
    [locale, format]
  )

  const formatValue = React.useCallback(
    (value: number) => formatter.format(value),
    [formatter]
  )

  const getRatio = React.useCallback(
    (value: number) => (max === min ? 0 : (value - min) / (max - min)),
    [min, max]
  )

  const valuesRef = React.useRef(values)
  valuesRef.current = values
  const haptics = useHaptics()

  const setThumbValue = React.useCallback(
    (
      index: number,
      raw: number,
      reason: ChangeEventReason,
      event?: ChangeEvent
    ) => {
      const current = valuesRef.current
      const next = clamp(roundToStep(raw, step, min), min, max)
      const [nextValues, nextIndex] = resolveCollisions(
        current,
        index,
        next,
        thumbCollisionBehavior,
        minStepsBetweenValues * step,
        min,
        max
      )
      if (nextIndex !== activeThumbIndexRef.current) {
        setActiveThumbIndex(nextIndex)
      }
      if (areEqual(current, nextValues)) return null
      const details = createChangeEventDetails(reason, event, undefined, {
        activeThumbIndex: nextIndex,
      })
      const applied = setValues(nextValues, details)
      if (!applied) return null
      valuesRef.current = nextValues
      haptics.selection()
      return nextValues
    },
    [
      step,
      min,
      max,
      thumbCollisionBehavior,
      minStepsBetweenValues,
      setValues,
      setActiveThumbIndex,
      haptics,
    ]
  )

  const commitValues = useEffectEvent(
    (
      committed: readonly number[],
      reason: CommitEventReason,
      event?: ChangeEvent
    ) => {
      const output = (
        isRange ? committed : committed[0]
      ) as ResolvedValue<Value>
      onValueCommitted?.(output, createGenericEventDetails(reason, event))
    }
  )

  const state = React.useMemo<RootState>(
    () => ({
      activeThumbIndex,
      disabled,
      dragging,
      max,
      min,
      minStepsBetweenValues,
      orientation,
      step,
      values,
    }),
    [
      activeThumbIndex,
      disabled,
      dragging,
      max,
      min,
      minStepsBetweenValues,
      orientation,
      step,
      values,
    ]
  )

  const context = React.useMemo<RootContextValue>(
    () => ({
      state,
      values,
      min,
      max,
      step,
      largeStep,
      orientation,
      disabled,
      thumbAlignment,
      thumbSize,
      labelId,
      hasLabel,
      setHasLabel,
      formatValue,
      getRatio,
      setThumbSize,
      setThumbValue,
      commitValues,
      setDragging,
      setActiveThumbIndex,
      activeThumbIndexRef,
    }),
    [
      state,
      values,
      min,
      max,
      step,
      largeStep,
      orientation,
      disabled,
      thumbAlignment,
      thumbSize,
      labelId,
      hasLabel,
      formatValue,
      getRatio,
      setThumbSize,
      setThumbValue,
      commitValues,
      setActiveThumbIndex,
    ]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ accessibilityState: { disabled }, children }, elementProps],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "SliderRoot"

function Label({ render, className, style, ref, ...elementProps }: LabelProps) {
  const { state, labelId, setHasLabel } = useRootContext()
  React.useEffect(() => {
    setHasLabel(true)
    return () => setHasLabel(false)
  }, [setHasLabel])
  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state,
    ref,
    props: [{ nativeID: labelId }, elementProps],
  })
}

Label.displayName = "SliderLabel"

function Value({
  children,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ValueProps) {
  const { state, values, formatValue } = useRootContext()
  const formattedValues = values.map(formatValue)
  const content =
    typeof children === "function"
      ? children(formattedValues, values)
      : formattedValues.join(" – ")
  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state,
    ref,
    props: [
      { importantForAccessibility: "no", children: content },
      elementProps,
    ],
  })
}

Value.displayName = "SliderValue"

function Control({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ControlProps) {
  const context = useRootContext()
  const controlRef = React.useRef<React.ComponentRef<typeof View>>(null)
  const rectRef = React.useRef({ x: 0, y: 0, width: 0, height: 0 })
  const latestRef = React.useRef<readonly number[] | null>(null)
  const movedRef = React.useRef(false)

  const getValueFromPoint = useEffectEvent((pageX: number, pageY: number) => {
    const { x, y, width, height } = rectRef.current
    const horizontal = context.orientation === "horizontal"
    const thumbLength = horizontal
      ? context.thumbSize.width
      : context.thumbSize.height
    const inset = context.thumbAlignment === "edge" ? thumbLength / 2 : 0
    const length = (horizontal ? width : height) - inset * 2
    if (length <= 0) return context.min
    let ratio = horizontal
      ? (pageX - x - inset) / length
      : 1 - (pageY - y - inset) / length
    if (horizontal && I18nManager.isRTL) ratio = 1 - ratio
    ratio = clamp(ratio, 0, 1)
    return context.min + ratio * (context.max - context.min)
  })

  const onGrant = useEffectEvent((event: GestureResponderEvent) => {
    const node = controlRef.current
    if (node) {
      const rect = node.getBoundingClientRect()
      rectRef.current = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      }
    }
    const target = getValueFromPoint(
      event.nativeEvent.pageX,
      event.nativeEvent.pageY
    )
    const index = findClosestIndex(context.values, target)
    movedRef.current = false
    context.setActiveThumbIndex(index)
    context.setDragging(true)
    latestRef.current =
      context.setThumbValue(index, target, SLIDER_REASONS.trackPress, event) ??
      context.values
  })

  const onMove = useEffectEvent((event: GestureResponderEvent) => {
    movedRef.current = true
    const target = getValueFromPoint(
      event.nativeEvent.pageX,
      event.nativeEvent.pageY
    )
    const next = context.setThumbValue(
      context.activeThumbIndexRef.current,
      target,
      SLIDER_REASONS.drag,
      event
    )
    if (next) latestRef.current = next
  })

  const onEnd = useEffectEvent((event: GestureResponderEvent) => {
    context.setDragging(false)
    context.commitValues(
      latestRef.current ?? context.values,
      movedRef.current ? SLIDER_REASONS.drag : SLIDER_REASONS.trackPress,
      event
    )
    latestRef.current = null
  })

  const isDisabled = useEffectEvent(() => context.disabled)

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isDisabled(),
        onMoveShouldSetPanResponder: () => !isDisabled(),
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: (event) => onGrant(event),
        onPanResponderMove: (event) => onMove(event),
        onPanResponderRelease: (event) => onEnd(event),
        onPanResponderTerminate: (event) => onEnd(event),
      }),
    [isDisabled, onGrant, onMove, onEnd]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state: context.state,
    ref: [ref, controlRef],
    props: [panResponder.panHandlers, elementProps],
  })
}

Control.displayName = "SliderControl"

function Track({ render, className, style, ref, ...elementProps }: TrackProps) {
  const { state } = useRootContext()
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ pointerEvents: "none" }, elementProps],
  })
}

Track.displayName = "SliderTrack"

function getEdgeOffset(
  context: RootContextValue,
  ratio: number,
  horizontal: boolean
) {
  if (context.thumbAlignment !== "edge") return 0
  const length = horizontal ? context.thumbSize.width : context.thumbSize.height
  return length * (0.5 - ratio)
}

function Indicator({
  render,
  className,
  style,
  ref,
  ...elementProps
}: IndicatorProps) {
  const context = useRootContext()
  const { values, orientation, state } = context
  const horizontal = orientation === "horizontal"
  const isRange = values.length > 1
  const startRatio = isRange ? context.getRatio(values[0] ?? context.min) : 0
  const endRatio = context.getRatio(values.at(-1) ?? context.min)
  const startOffset = isRange
    ? getEdgeOffset(context, startRatio, horizontal)
    : 0
  const endOffset = getEdgeOffset(context, endRatio, horizontal)

  const positionStyle: ViewStyle = horizontal
    ? {
        position: "absolute",
        top: 0,
        bottom: 0,
        start: `${startRatio * 100}%`,
        end: `${(1 - endRatio) * 100}%`,
        marginStart: startOffset,
        marginEnd: -endOffset,
      }
    : {
        position: "absolute",
        start: 0,
        end: 0,
        bottom: `${startRatio * 100}%`,
        top: `${(1 - endRatio) * 100}%`,
        marginBottom: startOffset,
        marginTop: -endOffset,
      }

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ pointerEvents: "none", style: positionStyle }, elementProps],
  })
}

Indicator.displayName = "SliderIndicator"

function Thumb({
  index = 0,
  disabled: disabledProp = false,
  getAccessibilityLabel,
  getAccessibilityValueText,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ThumbProps) {
  const context = useRootContext()
  const { values, orientation, thumbSize, min, max, step } = context
  const value = values[index] ?? min
  const ratio = context.getRatio(value)
  const horizontal = orientation === "horizontal"
  const disabled = context.disabled || disabledProp
  const formattedValue = context.formatValue(value)

  const state = React.useMemo<ThumbState>(
    () => ({
      ...context.state,
      disabled,
      index,
      active: context.state.activeThumbIndex === index,
    }),
    [context.state, disabled, index]
  )

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    context.setThumbSize({ width, height })
  }

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (disabled) return
    const direction = accessibilityStep(event)
    if (direction === 0) return
    context.setActiveThumbIndex(index)
    const next = context.setThumbValue(
      index,
      value + direction * step,
      SLIDER_REASONS.accessibilityAction,
      event
    )
    if (next) {
      context.commitValues(next, SLIDER_REASONS.accessibilityAction, event)
    }
  }

  const alignment = context.thumbAlignment === "edge"
  const positionStyle: ViewStyle = horizontal
    ? {
        position: "absolute",
        start: `${ratio * 100}%`,
        marginStart: alignment
          ? -thumbSize.width * ratio
          : -thumbSize.width / 2,
        top: "50%",
        marginTop: -thumbSize.height / 2,
      }
    : {
        position: "absolute",
        bottom: `${ratio * 100}%`,
        marginBottom: alignment
          ? -thumbSize.height * ratio
          : -thumbSize.height / 2,
        start: "50%",
        marginStart: -thumbSize.width / 2,
      }

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        accessible: true,
        accessibilityRole: "adjustable",
        accessibilityLabel: getAccessibilityLabel?.(index),
        accessibilityLabelledBy: context.hasLabel ? context.labelId : undefined,
        accessibilityState: { disabled },
        accessibilityValue: {
          min,
          max,
          now: value,
          text: getAccessibilityValueText
            ? getAccessibilityValueText(formattedValue, value, index)
            : formattedValue,
        },
        accessibilityActions: [{ name: "increment" }, { name: "decrement" }],
        onAccessibilityAction,
        onLayout,
        style: [positionStyle, { zIndex: state.active ? 2 : 1 }],
      },
      elementProps,
    ],
  })
}

Thumb.displayName = "SliderThumb"

export type {
  ChangeEventDetails,
  ChangeEventReason,
  CommitEventDetails,
  CommitEventReason,
  ControlProps,
  ControlState,
  IndicatorProps,
  IndicatorState,
  LabelProps,
  LabelState,
  RootContextValue,
  RootProps,
  RootState,
  SliderValue,
  ThumbAlignment,
  ThumbCollisionBehavior,
  ThumbProps,
  ThumbState,
  TrackProps,
  TrackState,
  ValueProps,
  ValueState,
}
export {
  Control,
  Indicator,
  Label,
  Root,
  SLIDER_REASONS,
  Thumb,
  Track,
  useRootContext,
  Value,
}
