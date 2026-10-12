import { cn } from "cn"
import { CalendarBlankIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import {
  WheelPicker,
  WheelPickerColumn,
  WheelPickerItem,
} from "@/components/ui/wheel-picker"

type DatePart = "day" | "month" | "year"

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function partOrder(locale: string | undefined): DatePart[] {
  try {
    const order = new Intl.DateTimeFormat(locale, { dateStyle: "short" })
      .formatToParts(new Date(2000, 11, 31))
      .map((part) => part.type)
      .filter(
        (type): type is DatePart =>
          type === "day" || type === "month" || type === "year"
      )
    return order.length === 3 ? order : ["month", "day", "year"]
  } catch {
    return ["month", "day", "year"]
  }
}

function DatePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date",
  locale,
  fromYear = new Date().getFullYear() - 100,
  toYear = new Date().getFullYear() + 10,
  title,
  disabled,
  floating,
  showCloseButton = false,
  closeLabel,
  invalid,
  className,
  accessibilityLabel,
  accessibilityLabelledBy,
}: {
  value?: Date | null
  defaultValue?: Date | null
  onValueChange?: (value: Date | null) => void
  placeholder?: string
  locale?: string
  fromYear?: number
  toYear?: number
  title?: string
  disabled?: boolean
  floating?: boolean
  showCloseButton?: boolean
  closeLabel?: string
  invalid?: boolean
  className?: string
  accessibilityLabel?: string
  accessibilityLabelledBy?: string
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? null
  )
  const value = valueProp === undefined ? uncontrolledValue : valueProp
  const [open, setOpen] = React.useState(false)

  const select = (next: Date | null) => {
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  const label = value
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(value)
    : placeholder

  return (
    <Drawer open={open} onOpenChange={setOpen} floating={floating}>
      <DrawerTrigger
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityLabelledBy={accessibilityLabelledBy}
        className={cn(
          "h-11 w-full flex-row items-center gap-2 rounded-lg border border-transparent bg-control px-3",
          invalid && "border-danger bg-danger/5 dark:bg-danger/10",
          disabled && "bg-control-disabled",
          className
        )}
      >
        <Icon
          as={CalendarBlankIcon}
          className={cn(
            "size-4 shrink-0 text-label-secondary",
            disabled && "text-label-quaternary"
          )}
        />
        <Text
          numberOfLines={1}
          className={cn(
            "flex-1 text-base text-label",
            !value && "text-label-secondary",
            disabled && "text-label-quaternary"
          )}
        >
          {label}
        </Text>
      </DrawerTrigger>
      <DrawerContent
        showCloseButton={showCloseButton}
        closeLabel={closeLabel}
        accessibilityLabel={
          title ? undefined : (accessibilityLabel ?? placeholder)
        }
        className={cn(!floating && "rounded-t-none")}
      >
        {title ? (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
        ) : null}
        <DateWheels
          value={value ?? new Date()}
          onValueChange={select}
          locale={locale}
          fromYear={fromYear}
          toYear={toYear}
          className={cn(showCloseButton && !title && "mt-12")}
        />
      </DrawerContent>
    </Drawer>
  )
}

function DateWheels({
  value,
  onValueChange,
  locale,
  fromYear,
  toYear,
  className,
}: {
  value: Date
  onValueChange: (value: Date) => void
  locale?: string
  fromYear: number
  toYear: number
  className?: string
}) {
  const year = value.getFullYear()
  const month = value.getMonth()
  const day = value.getDate()

  const order = React.useMemo(() => partOrder(locale), [locale])
  const monthNames = React.useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { month: "long" })
    return Array.from({ length: 12 }, (_, index) =>
      format.format(new Date(2000, index, 1))
    )
  }, [locale])

  const days = Array.from(
    { length: daysInMonth(year, month) },
    (_, index) => index + 1
  )
  const years = React.useMemo(
    () =>
      Array.from(
        { length: toYear - fromYear + 1 },
        (_, index) => fromYear + index
      ),
    [fromYear, toYear]
  )

  const update = (next: Partial<Record<DatePart, number>>) => {
    const nextYear = next.year ?? year
    const nextMonth = next.month ?? month
    const nextDay = Math.min(next.day ?? day, daysInMonth(nextYear, nextMonth))
    onValueChange(new Date(nextYear, nextMonth, nextDay))
  }

  const columns: Record<DatePart, React.ReactNode> = {
    day: (
      <WheelPickerColumn
        key="day"
        accessibilityLabel="Day"
        value={String(day)}
        onValueChange={(next) => update({ day: Number(next) })}
        className="w-12"
      >
        {days.map((item) => (
          <WheelPickerItem
            key={item}
            value={String(item)}
            className="justify-end px-0"
          >
            {item}
          </WheelPickerItem>
        ))}
      </WheelPickerColumn>
    ),
    month: (
      <WheelPickerColumn
        key="month"
        accessibilityLabel="Month"
        value={String(month)}
        onValueChange={(next) => update({ month: Number(next) })}
        className="w-24"
      >
        {monthNames.map((name, index) => (
          <WheelPickerItem
            key={name}
            value={String(index)}
            className="justify-start px-0"
          >
            {name}
          </WheelPickerItem>
        ))}
      </WheelPickerColumn>
    ),
    year: (
      <WheelPickerColumn
        key="year"
        accessibilityLabel="Year"
        value={String(year)}
        onValueChange={(next) => update({ year: Number(next) })}
        className="w-16"
      >
        {years.map((item) => (
          <WheelPickerItem
            key={item}
            value={String(item)}
            className="justify-start px-0"
          >
            {item}
          </WheelPickerItem>
        ))}
      </WheelPickerColumn>
    ),
  }

  return (
    <WheelPicker className={cn("mx-4 my-4 gap-6", className)}>
      {order.map((part) => columns[part])}
    </WheelPicker>
  )
}

export { DatePicker }
