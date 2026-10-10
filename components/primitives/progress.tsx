import type * as React from "react"
import { View } from "react-native"
import { Slot } from "./slot"
import type { SlottableViewProps, ViewRef } from "./types"

const DEFAULT_MAX = 100

type RootProps = SlottableViewProps & {
  value?: number | null | undefined
  max?: number
  getValueLabel?: (value: number, max: number) => string
}

type IndicatorProps = SlottableViewProps

type RootRef = ViewRef
type IndicatorRef = ViewRef

function defaultGetValueLabel(value: number, max: number) {
  return `${Math.round((value / max) * 100)}%`
}

function resolveMax(max: number | undefined) {
  return typeof max === "number" && Number.isFinite(max) && max > 0
    ? max
    : DEFAULT_MAX
}

function resolveValue(value: number | null | undefined, max: number) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= max
    ? value
    : 0
}

function Root({
  asChild,
  value: valueProp,
  max: maxProp,
  getValueLabel = defaultGetValueLabel,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const max = resolveMax(maxProp)
  const value = resolveValue(valueProp, max)
  const label = getValueLabel(value, max)
  const Component = asChild ? Slot : View
  return (
    <Component
      ref={ref}
      role="progressbar"
      accessible
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={label}
      accessibilityValue={{ min: 0, max, now: value, text: label }}
      {...props}
    />
  )
}

Root.displayName = "ProgressRoot"

function Indicator({
  asChild,
  ref,
  ...props
}: IndicatorProps & React.RefAttributes<IndicatorRef>) {
  const Component = asChild ? Slot : View
  return <Component ref={ref} role="presentation" {...props} />
}

Indicator.displayName = "ProgressIndicator"

export type { IndicatorProps, IndicatorRef, RootProps, RootRef }
export { Indicator, Root }
