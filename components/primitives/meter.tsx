import * as React from "react"
import { Text, View } from "react-native"
import type { BaseUIComponentProps } from "./types"
import { useRender } from "./use-render"

type RootState = Record<string, never>

type TrackState = RootState

type IndicatorState = RootState

type LabelState = RootState

type ValueState = RootState

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  value: number
  min?: number | undefined
  max?: number | undefined
  format?: Intl.NumberFormatOptions | undefined
  locale?: Intl.LocalesArgument | undefined
  getAccessibilityValueText?:
    | ((formattedValue: string, value: number) => string)
    | undefined
}

type TrackProps = BaseUIComponentProps<typeof View, TrackState>

type IndicatorProps = BaseUIComponentProps<typeof View, IndicatorState>

type LabelProps = BaseUIComponentProps<typeof Text, LabelState>

type ValueProps = Omit<
  BaseUIComponentProps<typeof Text, ValueState>,
  "children"
> & {
  children?:
    | null
    | ((formattedValue: string, value: number) => React.ReactNode)
    | undefined
}

interface RootContextValue {
  value: number
  min: number
  max: number
  percentage: number
  formattedValue: string
  labelId: string
  setHasLabel: (hasLabel: boolean) => void
  state: RootState
}

const RootContext = React.createContext<RootContextValue | null>(null)

const EMPTY_STATE: RootState = {}

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error("Meter parts must be rendered inside Meter.Root")
  }
  return context
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function formatValue(
  value: number,
  min: number,
  max: number,
  format: Intl.NumberFormatOptions | undefined,
  locale: Intl.LocalesArgument | undefined
) {
  if (format) return new Intl.NumberFormat(locale, format).format(value)
  const ratio = max === min ? 0 : (value - min) / (max - min)
  return new Intl.NumberFormat(locale, { style: "percent" }).format(ratio)
}

function Root({
  value: valueProp,
  min = 0,
  max = 100,
  format,
  locale,
  getAccessibilityValueText,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const value = Number.isFinite(valueProp) ? clamp(valueProp, min, max) : min
  const formattedValue = formatValue(value, min, max, format, locale)
  const percentage = max === min ? 0 : ((value - min) / (max - min)) * 100
  const labelId = React.useId()
  const [hasLabel, setHasLabel] = React.useState(false)

  const context = React.useMemo<RootContextValue>(
    () => ({
      value,
      min,
      max,
      percentage,
      formattedValue,
      labelId,
      setHasLabel,
      state: EMPTY_STATE,
    }),
    [value, min, max, percentage, formattedValue, labelId]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state: EMPTY_STATE,
    ref,
    props: [
      {
        accessible: true,
        accessibilityRole: "progressbar",
        accessibilityLabelledBy: hasLabel ? labelId : undefined,
        accessibilityValue: {
          min,
          max,
          now: value,
          text: getAccessibilityValueText
            ? getAccessibilityValueText(formattedValue, value)
            : formattedValue,
        },
      },
      elementProps,
    ],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "MeterRoot"

function Track({ render, className, style, ref, ...elementProps }: TrackProps) {
  const { state } = useRootContext()
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: elementProps,
  })
}

Track.displayName = "MeterTrack"

function Indicator({
  render,
  className,
  style,
  ref,
  ...elementProps
}: IndicatorProps) {
  const { state, percentage } = useRootContext()
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ style: { width: `${percentage}%` } }, elementProps],
  })
}

Indicator.displayName = "MeterIndicator"

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
    props: [
      { nativeID: labelId, importantForAccessibility: "no" },
      elementProps,
    ],
  })
}

Label.displayName = "MeterLabel"

function Value({
  children,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ValueProps) {
  const { state, value, formattedValue } = useRootContext()
  const content =
    typeof children === "function"
      ? children(formattedValue, value)
      : formattedValue
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

Value.displayName = "MeterValue"

export type {
  IndicatorProps,
  IndicatorState,
  LabelProps,
  LabelState,
  RootContextValue,
  RootProps,
  RootState,
  TrackProps,
  TrackState,
  ValueProps,
  ValueState,
}
export { Indicator, Label, Root, Track, useRootContext, Value }
