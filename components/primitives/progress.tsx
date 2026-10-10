import * as React from "react"
import { Text, View } from "react-native"
import type { BaseUIComponentProps } from "./types"
import { useRender } from "./use-render"

type ProgressStatus = "indeterminate" | "progressing" | "complete"

interface RootState {
  status: ProgressStatus
}

type TrackState = RootState

type IndicatorState = RootState

type LabelState = RootState

type ValueState = RootState

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  value: number | null
  min?: number | undefined
  max?: number | undefined
  format?: Intl.NumberFormatOptions | undefined
  locale?: Intl.LocalesArgument | undefined
  getAccessibilityValueText?:
    | ((formattedValue: string, value: number | null) => string)
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
    | ((formattedValue: string | null, value: number | null) => React.ReactNode)
    | undefined
}

interface RootContextValue {
  value: number | null
  min: number
  max: number
  percentage: number | null
  formattedValue: string | null
  status: ProgressStatus
  state: RootState
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error("Progress parts must be rendered inside Progress.Root")
  }
  return context
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function formatValue(
  value: number | null,
  min: number,
  max: number,
  format: Intl.NumberFormatOptions | undefined,
  locale: Intl.LocalesArgument | undefined
) {
  if (value === null) return null
  if (format) return new Intl.NumberFormat(locale, format).format(value)
  const ratio = max === min ? 0 : (value - min) / (max - min)
  return new Intl.NumberFormat(locale, { style: "percent" }).format(ratio)
}

function getStatus(value: number | null, max: number): ProgressStatus {
  if (value === null) return "indeterminate"
  return value >= max ? "complete" : "progressing"
}

function defaultGetAccessibilityValueText(
  formattedValue: string,
  value: number | null
) {
  return value === null ? "indeterminate progress" : formattedValue
}

function Root({
  value: valueProp,
  min = 0,
  max = 100,
  format,
  locale,
  getAccessibilityValueText = defaultGetAccessibilityValueText,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const value =
    typeof valueProp === "number" && Number.isFinite(valueProp)
      ? clamp(valueProp, min, max)
      : null
  const status = getStatus(value, max)
  const formattedValue = formatValue(value, min, max, format, locale)
  const percentage =
    value === null || max === min ? null : ((value - min) / (max - min)) * 100

  const state = React.useMemo<RootState>(() => ({ status }), [status])

  const context = React.useMemo<RootContextValue>(
    () => ({ value, min, max, percentage, formattedValue, status, state }),
    [value, min, max, percentage, formattedValue, status, state]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        accessible: true,
        accessibilityRole: "progressbar",
        accessibilityValue: {
          min,
          max,
          now: value ?? undefined,
          text: getAccessibilityValueText(formattedValue ?? "", value),
        },
      },
      elementProps,
    ],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "ProgressRoot"

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

Track.displayName = "ProgressTrack"

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
    props: [
      percentage === null ? null : { style: { width: `${percentage}%` } },
      elementProps,
    ],
  })
}

Indicator.displayName = "ProgressIndicator"

function Label({ render, className, style, ref, ...elementProps }: LabelProps) {
  const { state } = useRootContext()
  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state,
    ref,
    props: [{ importantForAccessibility: "no" }, elementProps],
  })
}

Label.displayName = "ProgressLabel"

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

Value.displayName = "ProgressValue"

export type {
  IndicatorProps,
  IndicatorState,
  LabelProps,
  LabelState,
  ProgressStatus,
  ProgressStatus as Status,
  RootContextValue,
  RootProps,
  RootState,
  TrackProps,
  TrackState,
  ValueProps,
  ValueState,
}
export { Indicator, Label, Root, Track, useRootContext, Value }
