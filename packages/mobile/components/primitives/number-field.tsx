import * as React from "react"
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  Platform,
  Pressable,
  TextInput,
  type TextInputFocusEvent,
  View,
} from "react-native"
import {
  createChangeEventDetails,
  createGenericEventDetails,
} from "./event-details"
import { fontFamily } from "./font"
import { useHaptics } from "./haptics"
import { useEffectEvent } from "./hooks"
import type {
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  BaseUIGenericEventDetails,
  ChangeEvent,
} from "./types"
import { useRender } from "./use-render"

const NUMBER_FIELD_REASONS = {
  inputChange: "input-change",
  inputClear: "input-clear",
  inputBlur: "input-blur",
  incrementPress: "increment-press",
  decrementPress: "decrement-press",
  accessibilityAction: "accessibility-action",
  none: "none",
} as const

type ChangeEventReason =
  (typeof NUMBER_FIELD_REASONS)[keyof typeof NUMBER_FIELD_REASONS]

type CommitEventReason = Exclude<ChangeEventReason, "input-change">

type Direction = -1 | 1

interface ChangeEventCustomProperties {
  direction?: Direction | undefined
}

type ChangeEventDetails = BaseUIChangeEventDetails<
  ChangeEventReason,
  ChangeEventCustomProperties
>

type CommitEventDetails = BaseUIGenericEventDetails<CommitEventReason>

interface RootState {
  value: number | null
  inputValue: string
  required: boolean
  disabled: boolean
  readOnly: boolean
  focused: boolean
}

type GroupState = RootState

type InputState = RootState

type IncrementState = RootState

type DecrementState = RootState

type RootProps = Omit<
  BaseUIComponentProps<typeof View, RootState>,
  "children"
> & {
  children?: React.ReactNode
  min?: number | undefined
  max?: number | undefined
  allowOutOfRange?: boolean | undefined
  step?: number | undefined
  required?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  value?: number | null | undefined
  defaultValue?: number | null | undefined
  snapOnStep?: boolean | undefined
  format?: Intl.NumberFormatOptions | undefined
  locale?: Intl.LocalesArgument | undefined
  onValueChange?:
    | ((value: number | null, eventDetails: ChangeEventDetails) => void)
    | undefined
  onValueCommitted?:
    | ((value: number | null, eventDetails: CommitEventDetails) => void)
    | undefined
  inputRef?: React.Ref<React.ComponentRef<typeof TextInput>> | undefined
}

type GroupProps = BaseUIComponentProps<typeof View, GroupState>

type InputProps = BaseUIComponentProps<typeof TextInput, InputState>

type IncrementProps = Omit<
  BaseUIComponentProps<typeof Pressable, IncrementState>,
  "children"
> & {
  children?: React.ReactNode
}

type DecrementProps = Omit<
  BaseUIComponentProps<typeof Pressable, DecrementState>,
  "children"
> & {
  children?: React.ReactNode
}

interface RootContextValue {
  state: RootState
  value: number | null
  inputValue: string
  min: number | undefined
  max: number | undefined
  step: number
  disabled: boolean
  readOnly: boolean
  canIncrement: boolean
  canDecrement: boolean
  keyboardType:
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "numbers-and-punctuation"
  inputRef: React.Ref<React.ComponentRef<typeof TextInput>> | undefined
  formatValue: (value: number | null) => string
  setFocused: (focused: boolean) => void
  handleInputChange: (text: string, event?: ChangeEvent) => void
  handleInputBlur: (event?: ChangeEvent) => void
  stepBy: (
    direction: Direction,
    reason: ChangeEventReason,
    event?: ChangeEvent
  ) => void
  commit: (reason: CommitEventReason, event?: ChangeEvent) => void
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "NumberField parts must be rendered inside NumberField.Root"
    )
  }
  return context
}

function clamp(
  value: number,
  min: number | undefined,
  max: number | undefined
) {
  let result = value
  if (min !== undefined) result = Math.max(result, min)
  if (max !== undefined) result = Math.min(result, max)
  return result
}

function getPrecision(value: number) {
  const text = value.toString()
  const exponent = text.split("e-")[1]
  if (exponent) return Number.parseInt(exponent, 10)
  return text.split(".")[1]?.length ?? 0
}

function toPrecision(value: number, step: number) {
  return Number(value.toFixed(Math.min(getPrecision(step) + 2, 20)))
}

function getSeparators(locale: Intl.LocalesArgument | undefined) {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
  return {
    group: parts.find((part) => part.type === "group")?.value ?? ",",
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function parseNumber(
  text: string,
  locale: Intl.LocalesArgument | undefined,
  format: Intl.NumberFormatOptions | undefined
) {
  const { group, decimal } = getSeparators(locale)
  let normalized = text
    .replace(new RegExp(escapeRegExp(group), "g"), "")
    .replace(/\s/g, "")
    .replace(new RegExp(escapeRegExp(decimal), "g"), ".")
    .replace(/[−–]/g, "-")
    .replace(/[^0-9.-]/g, "")
  if (normalized === "" || normalized === "-" || normalized === ".") return null
  normalized = normalized.replace(/(?!^)-/g, "")
  const parsed = Number.parseFloat(normalized)
  if (!Number.isFinite(parsed)) return null
  return format?.style === "percent" ? parsed / 100 : parsed
}

function Root({
  children,
  min,
  max,
  allowOutOfRange = false,
  step = 1,
  required = false,
  disabled = false,
  readOnly = false,
  value: valueProp,
  defaultValue = null,
  snapOnStep = false,
  format,
  locale,
  onValueChange,
  onValueCommitted,
  inputRef,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const formatter = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, { maximumFractionDigits: 20, ...format }),
    [locale, format]
  )
  const formatValue = React.useCallback(
    (value: number | null) => (value === null ? "" : formatter.format(value)),
    [formatter]
  )

  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = React.useState<number | null>(
    defaultValue
  )
  const value = isControlled ? valueProp : uncontrolled
  const valueRef = React.useRef(value)
  valueRef.current = value
  const haptics = useHaptics()

  const [inputValue, setInputValue] = React.useState(() => formatValue(value))
  const [focused, setFocused] = React.useState(false)

  React.useEffect(() => {
    if (focused) return
    setInputValue(formatValue(value))
  }, [value, focused, formatValue])

  const setValue = useEffectEvent(
    (
      next: number | null,
      reason: ChangeEventReason,
      event?: ChangeEvent,
      direction?: Direction
    ) => {
      if (Object.is(next, valueRef.current)) return false
      const details = createChangeEventDetails(reason, event, undefined, {
        direction,
      })
      onValueChange?.(next, details)
      if (details.isCanceled) return false
      valueRef.current = next
      if (!isControlled) setUncontrolled(next)
      return true
    }
  )

  const commit = useEffectEvent(
    (reason: CommitEventReason, event?: ChangeEvent) => {
      onValueCommitted?.(
        valueRef.current,
        createGenericEventDetails(reason, event)
      )
    }
  )

  const handleInputChange = useEffectEvent(
    (text: string, event?: ChangeEvent) => {
      setInputValue(text)
      const parsed = parseNumber(text, locale, format)
      if (text.trim() === "") {
        setValue(null, NUMBER_FIELD_REASONS.inputClear, event)
        return
      }
      if (parsed === null) return
      setValue(parsed, NUMBER_FIELD_REASONS.inputChange, event)
    }
  )

  const handleInputBlur = useEffectEvent((event?: ChangeEvent) => {
    setFocused(false)
    const current = valueRef.current
    if (current !== null) {
      let next = allowOutOfRange ? current : clamp(current, min, max)
      if (snapOnStep) {
        const base = min ?? 0
        next = toPrecision(Math.round((next - base) / step) * step + base, step)
      }
      setValue(next, NUMBER_FIELD_REASONS.inputBlur, event)
    }
    setInputValue(formatValue(valueRef.current))
    commit(
      current === null
        ? NUMBER_FIELD_REASONS.inputClear
        : NUMBER_FIELD_REASONS.inputBlur,
      event
    )
  })

  const stepBy = useEffectEvent(
    (direction: Direction, reason: ChangeEventReason, event?: ChangeEvent) => {
      if (disabled || readOnly) return
      const current = valueRef.current
      let next: number
      if (current === null) {
        next = direction > 0 ? (min ?? 0) : (max ?? 0)
        if (min === undefined && max === undefined) next = 0
      } else if (snapOnStep) {
        const base = min ?? 0
        const position = (current - base) / step
        const snapped =
          direction > 0
            ? Math.floor(position + 1e-9)
            : Math.ceil(position - 1e-9)
        next = base + (snapped + direction) * step
      } else {
        next = current + direction * step
      }
      next = toPrecision(clamp(next, min, max), step)
      if (setValue(next, reason, event, direction)) {
        setInputValue(formatValue(next))
        haptics.selection()
      }
    }
  )

  const canIncrement =
    !disabled &&
    !readOnly &&
    (max === undefined || value === null || value < max)
  const canDecrement =
    !disabled &&
    !readOnly &&
    (min === undefined || value === null || value > min)

  const allowsDecimal =
    !Number.isInteger(step) ||
    (format?.maximumFractionDigits ?? 0) > 0 ||
    format?.style === "percent"
  let keyboardType: RootContextValue["keyboardType"] = allowsDecimal
    ? "decimal-pad"
    : "number-pad"
  if (min === undefined || min < 0) {
    keyboardType = Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"
  }

  const state = React.useMemo<RootState>(
    () => ({ value, inputValue, required, disabled, readOnly, focused }),
    [value, inputValue, required, disabled, readOnly, focused]
  )

  const context = React.useMemo<RootContextValue>(
    () => ({
      state,
      value,
      inputValue,
      min,
      max,
      step,
      disabled,
      readOnly,
      canIncrement,
      canDecrement,
      keyboardType,
      inputRef,
      formatValue,
      setFocused,
      handleInputChange,
      handleInputBlur,
      stepBy,
      commit,
    }),
    [
      state,
      value,
      inputValue,
      min,
      max,
      step,
      disabled,
      readOnly,
      canIncrement,
      canDecrement,
      keyboardType,
      inputRef,
      formatValue,
      handleInputChange,
      handleInputBlur,
      stepBy,
      commit,
    ]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ children }, elementProps],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "NumberFieldRoot"

function Group({ render, className, style, ref, ...elementProps }: GroupProps) {
  const { state } = useRootContext()
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ accessibilityRole: "none" }, elementProps],
  })
}

Group.displayName = "NumberFieldGroup"

function Input({ render, className, style, ref, ...elementProps }: InputProps) {
  const context = useRootContext()
  const { state } = context

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    const name = event.nativeEvent.actionName
    if (name !== "increment" && name !== "decrement") return
    context.stepBy(
      name === "increment" ? 1 : -1,
      NUMBER_FIELD_REASONS.accessibilityAction,
      event
    )
    context.commit(NUMBER_FIELD_REASONS.accessibilityAction, event)
  }

  return useRender({
    defaultComponent: TextInput,
    render,
    className,
    style,
    state,
    ref: [ref, context.inputRef],
    props: [
      {
        style: fontFamily(),
        value: context.inputValue,
        editable: !context.disabled && !context.readOnly,
        keyboardType: context.keyboardType,
        autoCorrect: false,
        autoCapitalize: "none",
        spellCheck: false,
        accessibilityState: { disabled: context.disabled },
        accessibilityValue:
          context.value === null
            ? undefined
            : {
                min: context.min,
                max: context.max,
                now: context.value,
                text: context.formatValue(context.value),
              },
        accessibilityActions: [{ name: "increment" }, { name: "decrement" }],
        onAccessibilityAction,
        onChangeText: (text: string) => context.handleInputChange(text),
        onFocus: () => context.setFocused(true),
        onBlur: (event: TextInputFocusEvent) => context.handleInputBlur(event),
      },
      elementProps,
    ],
  })
}

Input.displayName = "NumberFieldInput"

const REPEAT_DELAY = 400
const REPEAT_INTERVAL = 60

function useStepButton(direction: Direction) {
  const context = useRootContext()
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const pressingRef = React.useRef(false)
  const reason =
    direction > 0
      ? NUMBER_FIELD_REASONS.incrementPress
      : NUMBER_FIELD_REASONS.decrementPress
  const enabled = direction > 0 ? context.canIncrement : context.canDecrement

  const stop = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
    timeoutRef.current = null
    intervalRef.current = null
  }, [])

  React.useEffect(() => stop, [stop])

  React.useEffect(() => {
    if (!enabled) stop()
  }, [enabled, stop])

  const onPressIn = (event: GestureResponderEvent) => {
    if (!enabled) return
    pressingRef.current = true
    context.stepBy(direction, reason, event)
    stop()
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        context.stepBy(direction, reason)
      }, REPEAT_INTERVAL)
    }, REPEAT_DELAY)
  }

  const onPressOut = (event: GestureResponderEvent) => {
    const wasActive = pressingRef.current
    pressingRef.current = false
    stop()
    if (wasActive) context.commit(reason, event)
  }

  return { context, enabled, onPressIn, onPressOut }
}

function Increment({
  render,
  className,
  style,
  ref,
  ...elementProps
}: IncrementProps) {
  const { context, enabled, onPressIn, onPressOut } = useStepButton(1)
  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state: context.state,
    ref,
    props: [
      {
        accessibilityRole: "button",
        accessibilityLabel: "Increase",
        accessibilityState: { disabled: !enabled },
        disabled: !enabled,
        onPressIn,
        onPressOut,
      },
      elementProps,
    ],
  })
}

Increment.displayName = "NumberFieldIncrement"

function Decrement({
  render,
  className,
  style,
  ref,
  ...elementProps
}: DecrementProps) {
  const { context, enabled, onPressIn, onPressOut } = useStepButton(-1)
  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state: context.state,
    ref,
    props: [
      {
        accessibilityRole: "button",
        accessibilityLabel: "Decrease",
        accessibilityState: { disabled: !enabled },
        disabled: !enabled,
        onPressIn,
        onPressOut,
      },
      elementProps,
    ],
  })
}

Decrement.displayName = "NumberFieldDecrement"

export type {
  ChangeEventDetails,
  ChangeEventReason,
  CommitEventDetails,
  CommitEventReason,
  DecrementProps,
  DecrementState,
  Direction,
  GroupProps,
  GroupState,
  IncrementProps,
  IncrementState,
  InputProps,
  InputState,
  RootContextValue,
  RootProps,
  RootState,
}
export {
  Decrement,
  Group,
  Increment,
  Input,
  NUMBER_FIELD_REASONS,
  Root,
  useRootContext,
}
