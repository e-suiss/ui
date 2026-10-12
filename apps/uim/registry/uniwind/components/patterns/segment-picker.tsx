import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SegmentPickerItemData = {
  value: string
  label: string
}

function itemLabel({
  value,
  label,
  accessibilityLabel,
  children,
}: {
  value: string
  label?: string
  accessibilityLabel?: string
  children?: React.ReactNode
}) {
  return (
    label ??
    accessibilityLabel ??
    (typeof children === "string" || typeof children === "number"
      ? String(children)
      : value)
  )
}

function collectItems(children: React.ReactNode): SegmentPickerItemData[] {
  const items: SegmentPickerItemData[] = []

  React.Children.forEach(children, (child) => {
    if (
      !React.isValidElement<React.ComponentProps<typeof SegmentPickerItem>>(
        child
      )
    ) {
      return
    }
    if (child.type === SegmentPickerItem) {
      items.push({ value: child.props.value, label: itemLabel(child.props) })
    } else if (child.props.children) {
      items.push(...collectItems(child.props.children))
    }
  })

  return items
}

function SegmentPicker({
  value,
  defaultValue,
  onValueChange,
  size = "default",
  disabled,
  className,
  accessibilityLabel,
  accessibilityLabelledBy,
  children,
}: {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  size?: "sm" | "default"
  disabled?: boolean
  className?: string
  accessibilityLabel?: string
  accessibilityLabelledBy?: string
  children?: React.ReactNode
}) {
  const items = React.useMemo(() => collectItems(children), [children])

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
        className={className}
        accessibilityLabel={accessibilityLabel}
        accessibilityLabelledBy={accessibilityLabelledBy}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{children}</SelectGroup>
      </SelectContent>
    </Select>
  )
}

function SegmentPickerItem(props: {
  value: string
  label?: string
  disabled?: boolean
  accessibilityLabel?: string
  children?: React.ReactNode
}) {
  const label = itemLabel(props)
  return (
    <SelectItem value={props.value} disabled={props.disabled} label={label}>
      {label}
    </SelectItem>
  )
}

export { SegmentPicker, SegmentPickerItem }
