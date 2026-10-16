import { cn } from "cn"
import { CaretLeftIcon, CaretRightIcon } from "phosphor-react-native"
import * as React from "react"
import { I18nManager, ScrollView, View } from "react-native"
import * as CalendarPrimitive from "@/components/primitives/calendar"
import { resolveClassName } from "@/components/primitives/use-render"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Text, TextClassContext } from "@/components/ui/text"

type CalendarSize = "sm" | "default" | "lg"

type CaptionLayout = "label" | "dropdown" | "dropdown-months" | "dropdown-years"

const CELL: Record<CalendarSize, string> = {
  sm: "size-6",
  default: "size-8",
  lg: "size-10",
}

const CELL_WIDTH: Record<CalendarSize, string> = {
  sm: "w-6",
  default: "w-8",
  lg: "w-10",
}

const CELL_HEIGHT: Record<CalendarSize, string> = {
  sm: "h-6",
  default: "h-8",
  lg: "h-10",
}

const PADDING: Record<CalendarSize, string> = {
  sm: "p-2",
  default: "p-3",
  lg: "p-4",
}

const CAPTION_TEXT: Record<CalendarSize, string> = {
  sm: "text-xs",
  default: "text-sm",
  lg: "text-base",
}

const DAY_TEXT: Record<CalendarSize, string> = {
  sm: "text-xs",
  default: "text-sm",
  lg: "text-lg",
}

const WEEKDAY_TEXT: Record<CalendarSize, string> = {
  sm: "text-xs",
  default: "text-xs uppercase",
  lg: "text-xs uppercase",
}

const WEEKDAY_FORMAT: Record<CalendarSize, "narrow" | "short"> = {
  sm: "narrow",
  default: "short",
  lg: "short",
}

const CalendarContext = React.createContext<{ size: CalendarSize }>({
  size: "default",
})

type DropdownOption = {
  value: string
  label: string
  disabled?: boolean
}

function CalendarDropdown({
  value,
  options,
  label,
  onChange,
}: {
  value: string
  options: DropdownOption[]
  label: string
  onChange: (value: string) => void
}) {
  const { size } = React.useContext(CalendarContext)
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(next) => {
        if (typeof next === "string") onChange(next)
      }}
    >
      <SelectTrigger
        size="sm"
        accessibilityLabel={label}
        className="h-auto gap-1 rounded-full bg-transparent px-1.5 py-0.5"
      >
        <SelectValue
          className={cn("flex-none font-semibold", CAPTION_TEXT[size])}
        />
      </SelectTrigger>
      <SelectContent>
        <ScrollView className="max-h-72">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              label={option.label}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </ScrollView>
      </SelectContent>
    </Select>
  )
}

function CalendarCaption({
  month,
  captionLayout,
}: {
  month: Date
  captionLayout: CaptionLayout
}) {
  const { size } = React.useContext(CalendarContext)
  const calendar = CalendarPrimitive.useRootContext()
  const year = month.getFullYear()

  if (captionLayout === "label") {
    return (
      <Text className={cn("font-semibold text-foreground", CAPTION_TEXT[size])}>
        {calendar.formatCaption(month)}
      </Text>
    )
  }

  const firstYear = calendar.startMonth?.getFullYear() ?? year
  const lastYear = calendar.endMonth?.getFullYear() ?? year
  const outOfRange = (target: Date) =>
    (calendar.startMonth !== undefined &&
      target.getTime() < calendar.startMonth.getTime()) ||
    (calendar.endMonth !== undefined &&
      target.getTime() > calendar.endMonth.getTime())

  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(year, index, 1)
    return {
      value: String(index),
      label: calendar.formatMonth(date, "short"),
      disabled: outOfRange(date),
    }
  })
  const years = Array.from(
    { length: Math.max(lastYear - firstYear + 1, 1) },
    (_, index) => ({
      value: String(firstYear + index),
      label: String(firstYear + index),
    })
  )
  const captionText = cn("font-semibold text-foreground", CAPTION_TEXT[size])

  return (
    <View className="flex-row items-center gap-1.5">
      {captionLayout === "dropdown-years" ? (
        <Text className={captionText}>
          {calendar.formatMonth(month, "long")}
        </Text>
      ) : (
        <CalendarDropdown
          label="Choose the Month"
          value={String(month.getMonth())}
          options={months}
          onChange={(next) =>
            calendar.goToMonth(
              new Date(year, Number(next), 1),
              CalendarPrimitive.CALENDAR_REASONS.monthSelect
            )
          }
        />
      )}
      {captionLayout === "dropdown-months" ? (
        <Text className={captionText}>{year}</Text>
      ) : (
        <CalendarDropdown
          label="Choose the Year"
          value={String(year)}
          options={years}
          onChange={(next) =>
            calendar.goToMonth(
              new Date(Number(next), month.getMonth(), 1),
              CalendarPrimitive.CALENDAR_REASONS.yearSelect
            )
          }
        />
      )}
    </View>
  )
}

function CalendarNav({
  buttonVariant,
}: {
  buttonVariant: ButtonProps["variant"]
}) {
  const { size } = React.useContext(CalendarContext)
  const calendar = CalendarPrimitive.useRootContext()
  const rtl = I18nManager.isRTL
  return (
    <View className="flex-row items-center gap-0.5">
      <CalendarPrimitive.Previous
        render={
          <Button
            variant={buttonVariant}
            size="icon"
            className={cn("p-0", CELL[size])}
          />
        }
      >
        <Icon
          as={rtl ? CaretRightIcon : CaretLeftIcon}
          className={cn("size-4", !calendar.previousMonth && "opacity-50")}
        />
      </CalendarPrimitive.Previous>
      <CalendarPrimitive.Next
        render={
          <Button
            variant={buttonVariant}
            size="icon"
            className={cn("p-0", CELL[size])}
          />
        }
      >
        <Icon
          as={rtl ? CaretLeftIcon : CaretRightIcon}
          className={cn("size-4", !calendar.nextMonth && "opacity-50")}
        />
      </CalendarPrimitive.Next>
    </View>
  )
}

function CalendarDayButton({
  className,
  day,
  children,
  ...props
}: React.ComponentProps<typeof CalendarPrimitive.DayButton>) {
  const { size } = React.useContext(CalendarContext)
  const modifiers = day.modifiers
  const single =
    modifiers.selected &&
    !modifiers.rangeStart &&
    !modifiers.rangeEnd &&
    !modifiers.rangeMiddle
  const filled =
    (single && modifiers.today) || modifiers.rangeStart || modifiers.rangeEnd
  return (
    <TextClassContext.Provider
      value={cn(
        "text-foreground",
        DAY_TEXT[size],
        modifiers.outside && "text-muted-foreground",
        (modifiers.today || single) && "font-semibold text-primary",
        modifiers.rangeMiddle && "text-foreground",
        filled && "text-primary-foreground",
        modifiers.disabled && "opacity-50"
      )}
    >
      <CalendarPrimitive.DayButton
        day={day}
        className={(state) =>
          cn(
            "items-center justify-center rounded-full active:opacity-80",
            CELL[size],
            single && "bg-primary-10 dark:bg-primary-20 active:opacity-80",
            filled && "bg-primary active:opacity-80",
            modifiers.rangeMiddle && "rounded-none",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        {children ?? <Text>{day.date.getDate()}</Text>}
      </CalendarPrimitive.DayButton>
    </TextClassContext.Provider>
  )
}

function CalendarMonth({
  month,
  index,
  buttonVariant,
  captionLayout,
  showWeekNumber,
}: {
  month: Date
  index: number
  buttonVariant: ButtonProps["variant"]
  captionLayout: CaptionLayout
  showWeekNumber: boolean
}) {
  const { size } = React.useContext(CalendarContext)
  const calendar = CalendarPrimitive.useRootContext()
  return (
    <View className="gap-4">
      <View className={cn("flex-row items-center", CELL_HEIGHT[size])}>
        <View className="flex-1 flex-row items-center ps-1.5">
          <CalendarCaption month={month} captionLayout={captionLayout} />
        </View>
        {index === 0 ? <CalendarNav buttonVariant={buttonVariant} /> : null}
      </View>
      <View role="grid" accessibilityLabel={calendar.formatCaption(month)}>
        <View className="flex-row">
          {showWeekNumber ? <View className={CELL_WIDTH[size]} /> : null}
          {calendar.weekdays.map((weekday) => (
            <View
              key={weekday.getDay()}
              accessibilityLabel={calendar.formatWeekday(weekday, "long")}
              className={cn("items-center", CELL_WIDTH[size])}
            >
              <Text
                numberOfLines={1}
                className={cn(
                  "font-semibold text-muted-foreground",
                  WEEKDAY_TEXT[size]
                )}
              >
                {calendar.formatWeekday(weekday, WEEKDAY_FORMAT[size])}
              </Text>
            </View>
          ))}
        </View>
        {calendar.getWeeks(month).map((week) => (
          <View key={week.days[0]?.date.getTime()} className="mt-2 flex-row">
            {showWeekNumber ? (
              <View className={cn("items-center justify-center", CELL[size])}>
                <Text className="text-xs text-muted-foreground">
                  {week.number}
                </Text>
              </View>
            ) : null}
            {week.days.map((day, dayIndex) => {
              const modifiers = day.modifiers
              const shaded =
                modifiers.rangeMiddle ||
                modifiers.rangeStart !== modifiers.rangeEnd
              return (
                <View
                  key={day.date.getTime()}
                  className={cn(
                    CELL[size],
                    !day.hidden && shaded && "bg-muted",
                    modifiers.rangeStart && "rounded-l-full",
                    modifiers.rangeEnd && "rounded-r-full",
                    modifiers.rangeMiddle && dayIndex === 0 && "rounded-l-full",
                    modifiers.rangeMiddle && dayIndex === 6 && "rounded-r-full"
                  )}
                >
                  {day.hidden ? null : <CalendarDayButton day={day} />}
                </View>
              )
            })}
          </View>
        ))}
      </View>
    </View>
  )
}

function CalendarMonths({
  buttonVariant,
  captionLayout,
  showWeekNumber,
}: {
  buttonVariant: ButtonProps["variant"]
  captionLayout: CaptionLayout
  showWeekNumber: boolean
}) {
  const calendar = CalendarPrimitive.useRootContext()
  return (
    <View className="gap-4">
      {calendar.months.map((month, index) => (
        <CalendarMonth
          key={month.getTime()}
          month={month}
          index={index}
          buttonVariant={buttonVariant}
          captionLayout={captionLayout}
          showWeekNumber={showWeekNumber}
        />
      ))}
    </View>
  )
}

function Calendar({
  className,
  size = "default",
  buttonVariant = "plain",
  captionLayout = "label",
  showWeekNumber = false,
  startMonth,
  endMonth,
  ...props
}: React.ComponentProps<typeof CalendarPrimitive.Root> & {
  buttonVariant?: ButtonProps["variant"]
  size?: CalendarSize
  captionLayout?: CaptionLayout
  showWeekNumber?: boolean
}) {
  const yearDropdown =
    captionLayout === "dropdown" || captionLayout === "dropdown-years"
  const thisYear = new Date().getFullYear()
  const context = React.useMemo(() => ({ size }), [size])
  return (
    <CalendarContext.Provider value={context}>
      <CalendarPrimitive.Root
        startMonth={
          startMonth ?? (yearDropdown ? new Date(thisYear - 100, 0) : undefined)
        }
        endMonth={
          endMonth ?? (yearDropdown ? new Date(thisYear, 11) : undefined)
        }
        className={(state) =>
          cn(
            "self-start bg-background",
            PADDING[size],
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        <CalendarMonths
          buttonVariant={buttonVariant}
          captionLayout={captionLayout}
          showWeekNumber={showWeekNumber}
        />
      </CalendarPrimitive.Root>
    </CalendarContext.Provider>
  )
}

export { Calendar, CalendarDayButton }
