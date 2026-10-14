"use client"

import * as React from "react"

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"

type PickerContextProps = {
  isMobile: boolean
}

const PickerContext = React.createContext<PickerContextProps | null>(null)

function usePicker() {
  const context = React.useContext(PickerContext)

  if (!context) {
    throw new Error("usePicker must be used within a <Picker />")
  }

  return context
}

type PickerItemData = {
  value: string
  label: React.ReactNode
}

function collectItems(children: React.ReactNode): PickerItemData[] {
  const items: PickerItemData[] = []

  React.Children.forEach(children, (child) => {
    if (
      !React.isValidElement<{ value?: string; children?: React.ReactNode }>(
        child
      )
    ) {
      return
    }
    if (child.type === PickerItem && child.props.value !== undefined) {
      items.push({ value: child.props.value, label: child.props.children })
    } else if (child.props.children) {
      items.push(...collectItems(child.props.children))
    }
  })

  return items
}

function Picker({
  value,
  defaultValue,
  onValueChange,
  placeholder,
  items: itemsProp,
  size = "default",
  id,
  name,
  disabled,
  required,
  className,
  children,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  items?: PickerItemData[]
  size?: "sm" | "default"
  id?: string
  name?: string
  disabled?: boolean
  required?: boolean
  className?: string
  children?: React.ReactNode
  "aria-invalid"?: boolean
  "aria-label"?: string
  "aria-describedby"?: string
}) {
  const isMobile = useIsMobile()
  const items = React.useMemo(
    () => itemsProp ?? collectItems(children),
    [itemsProp, children]
  )

  return (
    <PickerContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <NativeSelect
          data-slot="picker"
          id={id}
          name={name}
          size={size}
          disabled={disabled}
          required={required}
          className={className}
          aria-invalid={ariaInvalid}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          value={value}
          defaultValue={value === undefined ? (defaultValue ?? "") : undefined}
          onChange={(event) => onValueChange?.(event.target.value)}
        >
          {placeholder && (
            <NativeSelectOption value="" disabled>
              {placeholder}
            </NativeSelectOption>
          )}
          {children}
        </NativeSelect>
      ) : (
        <Select
          data-slot="picker"
          items={items}
          name={name}
          disabled={disabled}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onValueChange={(next) => {
            if (typeof next === "string") onValueChange?.(next)
          }}
        >
          <SelectTrigger
            id={id}
            size={size}
            className={className}
            aria-invalid={ariaInvalid}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </PickerContext.Provider>
  )
}

function PickerGroup({
  label,
  children,
}: {
  label?: string
  children?: React.ReactNode
}) {
  const { isMobile } = usePicker()

  if (isMobile) {
    return (
      <NativeSelectOptGroup data-slot="picker-group" label={label}>
        {children}
      </NativeSelectOptGroup>
    )
  }

  return (
    <SelectGroup data-slot="picker-group">
      {label && <SelectLabel>{label}</SelectLabel>}
      {children}
    </SelectGroup>
  )
}

function PickerItem({
  value,
  disabled,
  children,
}: {
  value: string
  disabled?: boolean
  children?: React.ReactNode
}) {
  const { isMobile } = usePicker()

  if (isMobile) {
    return (
      <NativeSelectOption
        data-slot="picker-item"
        value={value}
        disabled={disabled}
      >
        {children}
      </NativeSelectOption>
    )
  }

  return (
    <SelectItem data-slot="picker-item" value={value} disabled={disabled}>
      {children}
    </SelectItem>
  )
}

function PickerSeparator() {
  const { isMobile } = usePicker()

  if (isMobile) return null

  return <SelectSeparator data-slot="picker-separator" />
}

export { Picker, PickerGroup, PickerItem, PickerSeparator }
