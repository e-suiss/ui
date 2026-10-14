"use client"

import * as React from "react"

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useIsMobile } from "@/hooks/use-mobile"

type SegmentPickerContextProps = {
  isMobile: boolean
}

const SegmentPickerContext =
  React.createContext<SegmentPickerContextProps | null>(null)

function useSegmentPicker() {
  const context = React.useContext(SegmentPickerContext)

  if (!context) {
    throw new Error("useSegmentPicker must be used within a <SegmentPicker />")
  }

  return context
}

function SegmentPicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  variant = "default",
  size = "default",
  spacing = 0,
  id,
  name,
  disabled,
  className,
  children,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  variant?: "default" | "outline"
  size?: "sm" | "default" | "lg"
  spacing?: number
  id?: string
  name?: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  "aria-label"?: string
  "aria-describedby"?: string
}) {
  const isMobile = useIsMobile()
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolledValue

  const select = (next: string) => {
    if (next === value) return
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  return (
    <SegmentPickerContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <NativeSelect
          data-slot="segment-picker"
          id={id}
          name={name}
          size={size === "sm" ? "sm" : "default"}
          disabled={disabled}
          className={className}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          value={value ?? ""}
          onChange={(event) => select(event.target.value)}
        >
          {value === undefined && <NativeSelectOption value="" disabled />}
          {children}
        </NativeSelect>
      ) : (
        <>
          {name && <input type="hidden" name={name} value={value ?? ""} />}
          <ToggleGroup
            data-slot="segment-picker"
            id={id}
            variant={variant}
            size={size}
            spacing={spacing}
            disabled={disabled}
            className={className}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            value={value === undefined ? [] : [value]}
            onValueChange={(next) => {
              const [selected] = next
              if (selected !== undefined) select(selected)
            }}
          >
            {children}
          </ToggleGroup>
        </>
      )}
    </SegmentPickerContext.Provider>
  )
}

function SegmentPickerItem({
  value,
  label,
  disabled,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  value: string
  label?: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  "aria-label"?: string
}) {
  const { isMobile } = useSegmentPicker()

  if (isMobile) {
    return (
      <NativeSelectOption
        data-slot="segment-picker-item"
        value={value}
        disabled={disabled}
      >
        {label ??
          ariaLabel ??
          (typeof children === "string" || typeof children === "number"
            ? children
            : value)}
      </NativeSelectOption>
    )
  }

  return (
    <ToggleGroupItem
      data-slot="segment-picker-item"
      value={value}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
    >
      {children ?? label}
    </ToggleGroupItem>
  )
}

export { SegmentPicker, SegmentPickerItem }
