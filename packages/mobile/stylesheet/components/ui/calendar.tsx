import { CaretLeftIcon, CaretRightIcon } from "phosphor-react-native"
import * as React from "react"
import {
  I18nManager,
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native"
import * as CalendarPrimitive from "@/components/primitives/calendar"
import { resolveStyle } from "@/components/primitives/use-render"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Text, TextStyleContext } from "@/components/ui/text"
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

type CalendarSize = "sm" | "default" | "lg"

type CaptionLayout = "label" | "dropdown" | "dropdown-months" | "dropdown-years"

const CELL: Record<CalendarSize, number> = { sm: 24, default: 32, lg: 40 }

const PADDING: Record<CalendarSize, number> = { sm: 8, default: 12, lg: 16 }

const CAPTION_TEXT: Record<CalendarSize, TextStyle> = {
  sm: fontSize.xs,
  default: fontSize.sm,
  lg: fontSize.base,
}

const DAY_TEXT: Record<CalendarSize, TextStyle> = {
  sm: fontSize["3xs"],
  default: fontSize.sm,
  lg: fontSize.lg,
}

const WEEKDAY_TEXT: Record<CalendarSize, TextStyle> = {
  sm: fontSize["3xs"],
  default: { ...fontSize["3xs"], textTransform: "uppercase" },
  lg: { ...fontSize.xs, textTransform: "uppercase" },
}

const styles = StyleSheet.create({
  root: { alignSelf: "flex-start" },
  months: { gap: 16 },
  month: { gap: 16 },
  header: { flexDirection: "row", alignItems: "center" },
  caption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingStart: 6,
  },
  dropdowns: { flexDirection: "row", alignItems: "center", gap: 6 },
  dropdownTrigger: {
    height: "auto",
    gap: 4,
    borderRadius: radius.full,
    backgroundColor: "transparent",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dropdownValue: { flex: 0, fontWeight: "600" },
  dropdownList: { maxHeight: 288 },
  captionText: { fontWeight: "600" },
  nav: { flexDirection: "row", alignItems: "center", gap: 2 },
  navButton: { padding: 0 },
  row: { flexDirection: "row" },
  week: { marginTop: 8, flexDirection: "row" },
  weekday: { alignItems: "center" },
  weekdayText: { fontWeight: "600" },
  center: { alignItems: "center", justifyContent: "center" },
  day: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
})

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
        style={styles.dropdownTrigger}
      >
        <SelectValue style={[styles.dropdownValue, CAPTION_TEXT[size]]} />
      </SelectTrigger>
      <SelectContent>
        <ScrollView style={styles.dropdownList}>
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
  const { colors } = useTheme()
  const calendar = CalendarPrimitive.useRootContext()
  const year = month.getFullYear()
  const captionText = [
    styles.captionText,
    CAPTION_TEXT[size],
    { color: colors.foreground },
  ]

  if (captionLayout === "label") {
    return <Text style={captionText}>{calendar.formatCaption(month)}</Text>
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

  return (
    <View style={styles.dropdowns}>
      {captionLayout === "dropdown-years" ? (
        <Text style={captionText}>{calendar.formatMonth(month, "long")}</Text>
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
        <Text style={captionText}>{year}</Text>
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
  const rtl = I18nManager.isRTL
  const buttonStyle = [
    styles.navButton,
    { width: CELL[size], height: CELL[size] },
  ]
  return (
    <View style={styles.nav}>
      <CalendarPrimitive.Previous
        render={
          <Button variant={buttonVariant} size="icon" style={buttonStyle} />
        }
      >
        <Icon as={rtl ? CaretRightIcon : CaretLeftIcon} size={16} />
      </CalendarPrimitive.Previous>
      <CalendarPrimitive.Next
        render={
          <Button variant={buttonVariant} size="icon" style={buttonStyle} />
        }
      >
        <Icon as={rtl ? CaretLeftIcon : CaretRightIcon} size={16} />
      </CalendarPrimitive.Next>
    </View>
  )
}

function dayColors(
  modifiers: CalendarPrimitive.DayModifiers,
  colors: ThemeColors,
  isDark: boolean
) {
  const single =
    modifiers.selected &&
    !modifiers.rangeStart &&
    !modifiers.rangeEnd &&
    !modifiers.rangeMiddle
  const filled =
    (single && modifiers.today) || modifiers.rangeStart || modifiers.rangeEnd
  let text = colors.foreground
  if (modifiers.outside) text = colors.mutedForeground
  if (modifiers.today || single) text = colors.primary
  if (modifiers.rangeMiddle) text = colors.foreground
  if (filled) text = colors.primaryForeground
  let background = "transparent"
  if (single) background = withAlpha(colors.primary, isDark ? 0.2 : 0.1)
  if (filled) background = colors.primary
  return {
    text,
    background,
    bold: modifiers.today || single,
  }
}

function CalendarDayButton({
  style,
  day,
  children,
  ...props
}: React.ComponentProps<typeof CalendarPrimitive.DayButton>) {
  const { size } = React.useContext(CalendarContext)
  const { colors, isDark } = useTheme()
  const modifiers = day.modifiers
  const idle = dayColors(modifiers, colors, isDark)
  return (
    <TextStyleContext.Provider
      value={{
        ...DAY_TEXT[size],
        color: idle.text,
        fontWeight: idle.bold ? "600" : "400",
      }}
    >
      <CalendarPrimitive.DayButton
        day={day}
        render={(renderProps, state) => (
          <Pressable
            {...renderProps}
            style={({ pressed }) => [
              styles.day,
              { width: CELL[size], height: CELL[size] },
              { backgroundColor: idle.background },
              modifiers.rangeMiddle && { borderRadius: 0 },
              pressed && { opacity: 0.8 },
              modifiers.disabled && { opacity: 0.5 },
              resolveStyle(style, state) as StyleProp<ViewStyle>,
            ]}
          />
        )}
        {...props}
      >
        {children ?? <Text>{day.date.getDate()}</Text>}
      </CalendarPrimitive.DayButton>
    </TextStyleContext.Provider>
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
  const { colors } = useTheme()
  const calendar = CalendarPrimitive.useRootContext()
  const cell = CELL[size]
  return (
    <View style={styles.month}>
      <View style={[styles.header, { height: cell }]}>
        <View style={styles.caption}>
          <CalendarCaption month={month} captionLayout={captionLayout} />
        </View>
        {index === 0 ? <CalendarNav buttonVariant={buttonVariant} /> : null}
      </View>
      <View role="grid" accessibilityLabel={calendar.formatCaption(month)}>
        <View style={styles.row}>
          {showWeekNumber ? <View style={{ width: cell }} /> : null}
          {calendar.weekdays.map((weekday) => (
            <View
              key={weekday.getDay()}
              accessibilityLabel={calendar.formatWeekday(weekday, "long")}
              style={[styles.weekday, { width: cell }]}
            >
              <Text
                style={[
                  styles.weekdayText,
                  WEEKDAY_TEXT[size],
                  { color: colors.mutedForeground },
                ]}
              >
                {calendar.formatWeekday(weekday, "short")}
              </Text>
            </View>
          ))}
        </View>
        {calendar.getWeeks(month).map((week) => (
          <View key={week.days[0]?.date.getTime()} style={styles.week}>
            {showWeekNumber ? (
              <View style={[styles.center, { width: cell, height: cell }]}>
                <Text style={[fontSize.xs, { color: colors.mutedForeground }]}>
                  {week.number}
                </Text>
              </View>
            ) : null}
            {week.days.map((day, dayIndex) => {
              const modifiers = day.modifiers
              const shaded =
                modifiers.rangeMiddle ||
                modifiers.rangeStart !== modifiers.rangeEnd
              const rounded = radius.full
              return (
                <View
                  key={day.date.getTime()}
                  style={[
                    { width: cell, height: cell },
                    !day.hidden && shaded && { backgroundColor: colors.muted },
                    (modifiers.rangeStart ||
                      (modifiers.rangeMiddle && dayIndex === 0)) && {
                      borderTopLeftRadius: rounded,
                      borderBottomLeftRadius: rounded,
                    },
                    (modifiers.rangeEnd ||
                      (modifiers.rangeMiddle && dayIndex === 6)) && {
                      borderTopRightRadius: rounded,
                      borderBottomRightRadius: rounded,
                    },
                  ]}
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
    <View style={styles.months}>
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
  style,
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
  const { colors } = useTheme()
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
        style={(state) => [
          styles.root,
          { backgroundColor: colors.background, padding: PADDING[size] },
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
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
