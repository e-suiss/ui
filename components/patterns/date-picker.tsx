"use client"

import { CalendarBlankIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  WheelPicker,
  WheelPickerColumn,
  WheelPickerItem,
} from "@/components/ui/wheel-picker"
import { useIsMobile } from "@/hooks/use-mobile"

type DatePart = "day" | "month" | "year"

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function partOrder(locale: string | undefined): DatePart[] {
  const order = new Intl.DateTimeFormat(locale, { dateStyle: "short" })
    .formatToParts(new Date(2000, 11, 31))
    .map((part) => part.type)
    .filter(
      (type): type is DatePart =>
        type === "day" || type === "month" || type === "year"
    )
  return order.length === 3 ? order : ["month", "day", "year"]
}

type LocaleWithWeekInfo = Intl.Locale & {
  getWeekInfo?: () => { firstDay: number }
  weekInfo?: { firstDay: number }
}

function weekStart(locale: string | undefined) {
  const resolved = new Intl.DateTimeFormat(locale).resolvedOptions().locale
  const info = new Intl.Locale(resolved) as LocaleWithWeekInfo
  const firstDay = (info.getWeekInfo?.() ?? info.weekInfo)?.firstDay
  return firstDay === undefined
    ? undefined
    : ((firstDay % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6)
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
  id,
  className,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
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
  id?: string
  className?: string
  "aria-invalid"?: boolean
  "aria-label"?: string
  "aria-describedby"?: string
}) {
  const isMobile = useIsMobile()
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? null
  )
  const value = valueProp === undefined ? uncontrolledValue : valueProp
  const [open, setOpen] = React.useState(false)

  const select = (next: Date | null) => {
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  const calendarLocale = React.useMemo(() => {
    const caption = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    })
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" })
    const weekdayName = new Intl.DateTimeFormat(locale, { weekday: "long" })
    const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: "full" })
    const today = new Intl.RelativeTimeFormat(locale, {
      numeric: "auto",
    }).format(0, "day")
    return {
      weekStartsOn: weekStart(locale),
      formatters: {
        formatCaption: (date: Date) => caption.format(date),
        formatWeekdayName: (date: Date) => weekday.format(date),
      },
      labels: {
        labelGrid: (date: Date) => caption.format(date),
        labelWeekday: (date: Date) => weekdayName.format(date),
        labelDayButton: (date: Date, modifiers: { today?: boolean }) =>
          modifiers.today
            ? `${today}, ${fullDate.format(date)}`
            : fullDate.format(date),
      },
    }
  }, [locale])

  const label = value
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(value)
    : placeholder

  const trigger = (
    <button
      type="button"
      data-slot="date-picker-trigger"
      disabled={disabled}
      aria-invalid={ariaInvalid}
      id={id}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      data-placeholder={value ? undefined : ""}
      className={cn(
        "flex h-11 w-full items-center gap-2 rounded-lg border border-transparent bg-control px-3 text-start text-base outline-none focus-visible:focus-ring disabled:cursor-not-allowed disabled:bg-control-disabled disabled:text-label-quaternary aria-invalid:border-danger aria-invalid:bg-danger/5 data-placeholder:text-label-secondary dark:aria-invalid:bg-danger/10",
        className
      )}
    />
  )
  const triggerContent = (
    <>
      <CalendarBlankIcon className="size-4 shrink-0 text-label-secondary" />
      <span className="truncate">{label}</span>
    </>
  )

  if (isMobile) {
    return (
      <Drawer
        data-slot="date-picker"
        open={open}
        onOpenChange={setOpen}
        floating={floating}
      >
        <DrawerTrigger render={trigger}>{triggerContent}</DrawerTrigger>
        <DrawerContent
          data-slot="date-picker-content"
          showCloseButton={showCloseButton}
          closeLabel={closeLabel}
          className={cn(!floating && "rounded-t-none")}
        >
          <DrawerHeader className={cn(!title && "sr-only")}>
            <DrawerTitle>{title ?? ariaLabel ?? placeholder}</DrawerTitle>
          </DrawerHeader>
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

  return (
    <Popover data-slot="date-picker" open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger}>{triggerContent}</PopoverTrigger>
      <PopoverContent
        data-slot="date-picker-content"
        align="start"
        className="w-auto p-0"
      >
        <Calendar
          mode="single"
          selected={value ?? undefined}
          defaultMonth={value ?? undefined}
          weekStartsOn={calendarLocale.weekStartsOn}
          formatters={calendarLocale.formatters}
          labels={calendarLocale.labels}
          className="bg-transparent"
          startMonth={new Date(fromYear, 0)}
          endMonth={new Date(toYear, 11)}
          onSelect={(next) => {
            select(next ?? null)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
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
  className?: string
  value: Date
  onValueChange: (value: Date) => void
  locale?: string
  fromYear: number
  toYear: number
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
        aria-label="Day"
        value={String(day)}
        onValueChange={(next) => update({ day: Number(next) })}
        className="w-12 *:justify-end *:px-0"
      >
        {days.map((item) => (
          <WheelPickerItem key={item} value={String(item)}>
            {item}
          </WheelPickerItem>
        ))}
      </WheelPickerColumn>
    ),
    month: (
      <WheelPickerColumn
        key="month"
        aria-label="Month"
        value={String(month)}
        onValueChange={(next) => update({ month: Number(next) })}
        className="w-24 *:justify-start *:px-0"
      >
        {monthNames.map((name, index) => (
          <WheelPickerItem key={name} value={String(index)}>
            {name}
          </WheelPickerItem>
        ))}
      </WheelPickerColumn>
    ),
    year: (
      <WheelPickerColumn
        key="year"
        aria-label="Year"
        value={String(year)}
        onValueChange={(next) => update({ year: Number(next) })}
        className="w-16 *:justify-start *:px-0"
      >
        {years.map((item) => (
          <WheelPickerItem key={item} value={String(item)}>
            {item}
          </WheelPickerItem>
        ))}
      </WheelPickerColumn>
    ),
  }

  return (
    <WheelPicker
      data-slot="date-picker-wheels"
      className={cn(
        "mx-4 my-4 gap-6 pb-[env(safe-area-inset-bottom)]",
        className
      )}
    >
      {order.map((part) => columns[part])}
    </WheelPicker>
  )
}

export { DatePicker }
