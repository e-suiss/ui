import * as React from "react"
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
  disabled,
  invalid,
  className,
  accessibilityLabel,
  accessibilityLabelledBy,
  children,
}: {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  items?: PickerItemData[]
  size?: "sm" | "default"
  disabled?: boolean
  invalid?: boolean
  className?: string
  accessibilityLabel?: string
  accessibilityLabelledBy?: string
  children?: React.ReactNode
}) {
  const items = React.useMemo(
    () => itemsProp ?? collectItems(children),
    [itemsProp, children]
  )

  return (
    <Select
      items={items}
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => {
        if (typeof next === "string") onValueChange?.(next)
      }}
    >
      <SelectTrigger
        size={size}
        invalid={invalid}
        className={className}
        accessibilityLabel={accessibilityLabel}
        accessibilityLabelledBy={accessibilityLabelledBy}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}

function PickerGroup({
  label,
  children,
}: {
  label?: string
  children?: React.ReactNode
}) {
  return (
    <>
      {label ? <SelectLabel>{label}</SelectLabel> : null}
      {children}
    </>
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
  return (
    <SelectItem
      value={value}
      disabled={disabled}
      label={typeof children === "string" ? children : undefined}
    >
      {children}
    </SelectItem>
  )
}

function PickerSeparator() {
  return <SelectSeparator />
}

export { Picker, PickerGroup, PickerItem, PickerSeparator }
