import * as React from "react"
import {
  type GestureResponderEvent,
  I18nManager,
  PanResponder,
  Pressable,
  View,
} from "react-native"
import { createChangeEventDetails } from "./event-details"
import { useEffectEvent } from "./hooks"
import type {
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  ChangeEvent,
} from "./types"
import { useRender } from "./use-render"

const CALENDAR_REASONS = {
  dayPress: "day-press",
  previousPress: "previous-press",
  nextPress: "next-press",
  monthSelect: "month-select",
  yearSelect: "year-select",
  swipe: "swipe",
  none: "none",
} as const

type ChangeEventReason =
  (typeof CALENDAR_REASONS)[keyof typeof CALENDAR_REASONS]

type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

interface DateRange {
  from: Date | undefined
  to?: Date | undefined
}

type Matcher =
  | boolean
  | Date
  | Date[]
  | DateRange
  | { before: Date; after?: Date }
  | { after: Date; before?: Date }
  | { dayOfWeek: number | number[] }
  | ((date: Date) => boolean)

interface DayModifiers {
  today: boolean
  selected: boolean
  disabled: boolean
  outside: boolean
  rangeStart: boolean
  rangeEnd: boolean
  rangeMiddle: boolean
}

interface CalendarDay {
  date: Date
  month: Date
  outside: boolean
  hidden: boolean
  modifiers: DayModifiers
}

interface CalendarWeek {
  number: number
  days: CalendarDay[]
}

type SelectEventDetails = BaseUIChangeEventDetails<
  ChangeEventReason,
  { date: Date; modifiers: DayModifiers }
>

type MonthChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>

type SingleProps = {
  mode: "single"
  selected?: Date | undefined
  onSelect?:
    | ((date: Date | undefined, details: SelectEventDetails) => void)
    | undefined
}

type MultipleProps = {
  mode: "multiple"
  selected?: Date[] | undefined
  onSelect?:
    | ((dates: Date[] | undefined, details: SelectEventDetails) => void)
    | undefined
}

type RangeProps = {
  mode: "range"
  selected?: DateRange | undefined
  onSelect?:
    | ((range: DateRange | undefined, details: SelectEventDetails) => void)
    | undefined
}

type NoSelectionProps = {
  mode?: undefined
  selected?: undefined
  onSelect?: undefined
}

type SelectionProps =
  | SingleProps
  | MultipleProps
  | RangeProps
  | NoSelectionProps

type Selected = Date | Date[] | DateRange | undefined

interface RootState {
  month: Date
  disabled: boolean
}

type RootProps = Omit<
  BaseUIComponentProps<typeof View, RootState>,
  "children"
> &
  SelectionProps & {
    children?: React.ReactNode
    required?: boolean | undefined
    month?: Date | undefined
    defaultMonth?: Date | undefined
    onMonthChange?:
      | ((month: Date, details: MonthChangeEventDetails) => void)
      | undefined
    startMonth?: Date | undefined
    endMonth?: Date | undefined
    numberOfMonths?: number | undefined
    disabled?: Matcher | Matcher[] | undefined
    weekStartsOn?: WeekDay | undefined
    locale?: string | undefined
    today?: Date | undefined
    showOutsideDays?: boolean | undefined
    fixedWeeks?: boolean | undefined
  }

interface NavState {
  disabled: boolean
}

type NavProps = Omit<
  BaseUIComponentProps<typeof Pressable, NavState>,
  "children"
> & {
  children?: React.ReactNode
}

type DayButtonState = DayModifiers

type DayButtonProps = Omit<
  BaseUIComponentProps<typeof Pressable, DayButtonState>,
  "children"
> & {
  children?: React.ReactNode
  day: CalendarDay
}

interface RootContextValue {
  locale: string | undefined
  today: Date
  months: Date[]
  weekdays: Date[]
  weekStartsOn: WeekDay
  startMonth: Date | undefined
  endMonth: Date | undefined
  previousMonth: Date | undefined
  nextMonth: Date | undefined
  getWeeks: (month: Date) => CalendarWeek[]
  goToMonth: (
    month: Date,
    reason: ChangeEventReason,
    event?: ChangeEvent
  ) => void
  selectDay: (day: CalendarDay, event?: ChangeEvent) => void
  formatCaption: (month: Date) => string
  formatWeekday: (date: Date, width: "narrow" | "short" | "long") => string
  formatMonth: (month: Date, width: "short" | "long") => string
  labelDay: (day: CalendarDay) => string
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error("Calendar parts must be rendered inside Calendar.Root")
  }
  return context
}

const DAY = 86400000

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

function isSameDay(a: Date | undefined, b: Date | undefined) {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function dayDiff(a: Date, b: Date) {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / DAY)
}

function monthDiff(a: Date, b: Date) {
  return (
    (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth())
  )
}

function startOfWeek(date: Date, weekStartsOn: WeekDay) {
  const day = date.getDay()
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn
  return addDays(date, -diff)
}

function startOfWeekYear(
  date: Date,
  weekStartsOn: WeekDay,
  firstWeekContainsDate: number
) {
  const year = date.getFullYear()
  const next = startOfWeek(
    new Date(year + 1, 0, firstWeekContainsDate),
    weekStartsOn
  )
  if (date.getTime() >= next.getTime()) return next
  const current = startOfWeek(
    new Date(year, 0, firstWeekContainsDate),
    weekStartsOn
  )
  if (date.getTime() >= current.getTime()) return current
  return startOfWeek(new Date(year - 1, 0, firstWeekContainsDate), weekStartsOn)
}

function weekNumber(date: Date, weekStartsOn: WeekDay) {
  const firstWeekContainsDate = weekStartsOn === 1 ? 4 : 1
  const start = startOfWeek(date, weekStartsOn)
  const yearStart = startOfWeekYear(date, weekStartsOn, firstWeekContainsDate)
  return Math.round(dayDiff(start, yearStart) / 7) + 1
}

function isDateRange(value: unknown): value is DateRange {
  return (
    typeof value === "object" &&
    value !== null &&
    !(value instanceof Date) &&
    !Array.isArray(value) &&
    "from" in value
  )
}

function rangeIncludes(range: DateRange, date: Date) {
  const { from, to } = range
  if (from && to) {
    const [start, end] = dayDiff(to, from) < 0 ? [to, from] : [from, to]
    return dayDiff(date, start) >= 0 && dayDiff(end, date) >= 0
  }
  return isSameDay(from, date) || isSameDay(to, date)
}

function matches(date: Date, matcher: Matcher): boolean {
  if (typeof matcher === "boolean") return matcher
  if (typeof matcher === "function") return matcher(date)
  if (matcher instanceof Date) return isSameDay(matcher, date)
  if (Array.isArray(matcher)) return matcher.some((day) => isSameDay(day, date))
  if (isDateRange(matcher)) return rangeIncludes(matcher, date)
  if ("dayOfWeek" in matcher) {
    const days = Array.isArray(matcher.dayOfWeek)
      ? matcher.dayOfWeek
      : [matcher.dayOfWeek]
    return days.includes(date.getDay())
  }
  const before = "before" in matcher ? matcher.before : undefined
  const after = "after" in matcher ? matcher.after : undefined
  if (before && after) {
    return dayDiff(after, before) < 0
      ? dayDiff(date, after) > 0 && dayDiff(before, date) > 0
      : dayDiff(before, date) > 0 || dayDiff(date, after) > 0
  }
  if (before) return dayDiff(before, date) > 0
  if (after) return dayDiff(date, after) > 0
  return false
}

function matchesAny(date: Date, matcher: Matcher | Matcher[] | undefined) {
  if (matcher === undefined) return false
  if (
    Array.isArray(matcher) &&
    !matcher.every((item) => item instanceof Date)
  ) {
    return (matcher as Matcher[]).some((item) => matches(date, item))
  }
  return matches(date, matcher as Matcher)
}

function addToRange(
  date: Date,
  range: DateRange | undefined,
  required: boolean
): DateRange | undefined {
  const { from, to } = range ?? { from: undefined, to: undefined }
  if (!from && !to) return { from: date, to: date }
  if (from && !to) {
    if (isSameDay(from, date)) {
      return { from, to: date }
    }
    return dayDiff(date, from) < 0
      ? { from: date, to: from }
      : { from, to: date }
  }
  if (from && to) {
    if (isSameDay(from, date) && isSameDay(to, date)) {
      return required ? { from, to } : undefined
    }
    if (isSameDay(from, date)) return { from, to: date }
    if (isSameDay(to, date)) return { from: date, to: date }
    if (dayDiff(date, from) < 0) return { from: date, to }
    return { from, to: date }
  }
  return { from: date, to: date }
}

type LocaleWithWeekInfo = Intl.Locale & {
  getWeekInfo?: () => { firstDay: number }
  weekInfo?: { firstDay: number }
}

function localeWeekStart(locale: string | undefined): WeekDay | undefined {
  try {
    if (typeof Intl.Locale !== "function") return undefined
    const resolved = new Intl.DateTimeFormat(locale).resolvedOptions().locale
    const info = new Intl.Locale(resolved) as LocaleWithWeekInfo
    const firstDay = (info.getWeekInfo?.() ?? info.weekInfo)?.firstDay
    return firstDay === undefined ? undefined : ((firstDay % 7) as WeekDay)
  } catch {
    return undefined
  }
}

function relativeToday(locale: string | undefined) {
  if (typeof Intl.RelativeTimeFormat !== "function") return undefined
  const text = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  }).format(0, "day")
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function todayLabel(locale: string | undefined) {
  try {
    return relativeToday(locale) ?? "Today"
  } catch {
    return "Today"
  }
}

function selectionAnchor(selected: Selected) {
  if (selected instanceof Date) return selected
  if (Array.isArray(selected)) return selected[0]
  if (isDateRange(selected)) return selected.from
  return undefined
}

function Root({
  children,
  mode,
  selected: selectedProp,
  onSelect,
  required = false,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  startMonth: startMonthProp,
  endMonth: endMonthProp,
  numberOfMonths = 1,
  disabled,
  weekStartsOn: weekStartsOnProp,
  locale,
  today: todayProp,
  showOutsideDays = false,
  fixedWeeks = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const today = startOfDay(todayProp ?? new Date())
  const weekStartsOn = weekStartsOnProp ?? localeWeekStart(locale) ?? 0
  const startMonth = startMonthProp ? startOfMonth(startMonthProp) : undefined
  const endMonth = endMonthProp ? startOfMonth(endMonthProp) : undefined

  const [internalSelected, setInternalSelected] =
    React.useState<Selected>(selectedProp)
  const selected: Selected = onSelect ? selectedProp : internalSelected

  const initialMonth = () => {
    const anchor = defaultMonth ?? selectionAnchor(selectedProp) ?? today
    return startOfMonth(anchor)
  }
  const [internalMonth, setInternalMonth] = React.useState(initialMonth)
  const month = monthProp ? startOfMonth(monthProp) : internalMonth

  const clampMonth = (target: Date) => {
    let next = startOfMonth(target)
    if (endMonth) {
      const last = addMonths(endMonth, -(numberOfMonths - 1))
      if (monthDiff(next, last) > 0) next = last
    }
    if (startMonth && monthDiff(next, startMonth) < 0) next = startMonth
    return next
  }

  const months = Array.from({ length: numberOfMonths }, (_, index) =>
    addMonths(month, index)
  )

  const previousMonth =
    startMonth && monthDiff(month, startMonth) <= 0
      ? undefined
      : addMonths(month, -1)
  const lastShown = addMonths(month, numberOfMonths - 1)
  const nextMonth =
    endMonth && monthDiff(endMonth, lastShown) <= 0
      ? undefined
      : addMonths(month, 1)

  const goToMonth = useEffectEvent(
    (target: Date, reason: ChangeEventReason, event?: ChangeEvent) => {
      const next = clampMonth(target)
      if (isSameMonth(next, month)) return
      const details = createChangeEventDetails(reason, event)
      onMonthChange?.(next, details)
      if (details.isCanceled) return
      if (!monthProp) setInternalMonth(next)
    }
  )

  const getModifiers = (date: Date, outside: boolean): DayModifiers => {
    let isSelected = false
    let rangeStart = false
    let rangeEnd = false
    let rangeMiddle = false
    if (mode === "single" && selected instanceof Date) {
      isSelected = isSameDay(selected, date)
    } else if (mode === "multiple" && Array.isArray(selected)) {
      isSelected = selected.some((day) => isSameDay(day, date))
    } else if (mode === "range" && isDateRange(selected)) {
      isSelected = rangeIncludes(selected, date)
      if (isSelected) {
        rangeStart = isSameDay(selected.from, date)
        rangeEnd = isSameDay(selected.to ?? selected.from, date)
        rangeMiddle = !rangeStart && !rangeEnd
      }
    }
    const outOfBounds =
      (startMonth !== undefined && monthDiff(date, startMonth) < 0) ||
      (endMonth !== undefined && monthDiff(date, endMonth) > 0)
    return {
      today: isSameDay(date, today),
      selected: isSelected,
      disabled: outOfBounds || matchesAny(date, disabled),
      outside,
      rangeStart,
      rangeEnd,
      rangeMiddle,
    }
  }

  const getWeeks = (target: Date): CalendarWeek[] => {
    const first = startOfMonth(target)
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0)
    const start = startOfWeek(first, weekStartsOn)
    const count = fixedWeeks ? 6 : Math.ceil((dayDiff(last, start) + 1) / 7)
    return Array.from({ length: count }, (_, weekIndex) => {
      const days = Array.from({ length: 7 }, (_, dayIndex) => {
        const date = addDays(start, weekIndex * 7 + dayIndex)
        const outside = !isSameMonth(date, first)
        return {
          date,
          month: first,
          outside,
          hidden: outside && !showOutsideDays,
          modifiers: getModifiers(date, outside),
        }
      })
      return {
        number: weekNumber(days[0]?.date ?? start, weekStartsOn),
        days,
      }
    })
  }

  const selectDay = useEffectEvent((day: CalendarDay, event?: ChangeEvent) => {
    if (!mode || day.modifiers.disabled) return
    const { date } = day
    let next: Selected
    if (mode === "single") {
      next =
        selected instanceof Date && isSameDay(selected, date) && !required
          ? undefined
          : date
    } else if (mode === "multiple") {
      const list = Array.isArray(selected) ? selected : []
      const exists = list.some((item) => isSameDay(item, date))
      if (exists) {
        const remaining = list.filter((item) => !isSameDay(item, date))
        if (remaining.length > 0) next = remaining
        else next = required ? list : undefined
      } else {
        next = [...list, date]
      }
    } else {
      next = addToRange(
        date,
        isDateRange(selected) ? selected : undefined,
        required
      )
    }
    const details = createChangeEventDetails(
      CALENDAR_REASONS.dayPress,
      event,
      undefined,
      { date, modifiers: day.modifiers }
    )
    const handleSelect = onSelect as
      | ((value: Selected, eventDetails: SelectEventDetails) => void)
      | undefined
    handleSelect?.(next, details)
    if (details.isCanceled) return
    if (!onSelect) setInternalSelected(next)
    if (day.outside) goToMonth(date, CALENDAR_REASONS.dayPress, event)
  })

  const captionFormat = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale]
  )
  const fullFormat = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
    [locale]
  )
  const todayText = React.useMemo(() => todayLabel(locale), [locale])

  const formatCaption = React.useCallback(
    (target: Date) => captionFormat.format(target),
    [captionFormat]
  )
  const formatWeekday = React.useCallback(
    (date: Date, width: "narrow" | "short" | "long") =>
      new Intl.DateTimeFormat(locale, { weekday: width }).format(date),
    [locale]
  )
  const formatMonth = React.useCallback(
    (target: Date, width: "short" | "long") =>
      new Intl.DateTimeFormat(locale, { month: width }).format(target),
    [locale]
  )
  const labelDay = React.useCallback(
    (day: CalendarDay) =>
      day.modifiers.today
        ? `${todayText}, ${fullFormat.format(day.date)}`
        : fullFormat.format(day.date),
    [todayText, fullFormat]
  )

  const weekStart = startOfWeek(today, weekStartsOn)
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index)
  )

  const swipeTo = useEffectEvent(
    (direction: 1 | -1, event: GestureResponderEvent) => {
      const target = direction > 0 ? nextMonth : previousMonth
      if (target) goToMonth(target, CALENDAR_REASONS.swipe, event)
    }
  )

  const swipe = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 24 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy) * 2,
        onPanResponderRelease: (event, gesture) => {
          if (Math.abs(gesture.dx) < 48) return
          const forward = I18nManager.isRTL ? gesture.dx > 0 : gesture.dx < 0
          swipeTo(forward ? 1 : -1, event)
        },
      }),
    [swipeTo]
  )

  const disabledAll = disabled === true
  const state = React.useMemo<RootState>(
    () => ({ month, disabled: disabledAll }),
    [month, disabledAll]
  )

  const context: RootContextValue = {
    locale,
    today,
    months,
    weekdays,
    weekStartsOn,
    startMonth,
    endMonth,
    previousMonth,
    nextMonth,
    getWeeks,
    goToMonth,
    selectDay,
    formatCaption,
    formatWeekday,
    formatMonth,
    labelDay,
  }

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ ...swipe.panHandlers, children }, elementProps],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "CalendarRoot"

function useNavButton(direction: 1 | -1) {
  const context = useRootContext()
  const target = direction > 0 ? context.nextMonth : context.previousMonth
  const disabled = target === undefined
  const state = React.useMemo<NavState>(() => ({ disabled }), [disabled])
  const onPress = (event: GestureResponderEvent) => {
    if (!target) return
    context.goToMonth(
      target,
      direction > 0
        ? CALENDAR_REASONS.nextPress
        : CALENDAR_REASONS.previousPress,
      event
    )
  }
  return { state, disabled, onPress }
}

function Previous({
  render,
  className,
  style,
  ref,
  ...elementProps
}: NavProps) {
  const { state, disabled, onPress } = useNavButton(-1)
  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        accessibilityRole: "button",
        accessibilityLabel: "Go to the Previous Month",
        accessibilityState: { disabled },
        disabled,
        onPress,
      },
      elementProps,
    ],
  })
}

Previous.displayName = "CalendarPrevious"

function Next({ render, className, style, ref, ...elementProps }: NavProps) {
  const { state, disabled, onPress } = useNavButton(1)
  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        accessibilityRole: "button",
        accessibilityLabel: "Go to the Next Month",
        accessibilityState: { disabled },
        disabled,
        onPress,
      },
      elementProps,
    ],
  })
}

Next.displayName = "CalendarNext"

function DayButton({
  day,
  render,
  className,
  style,
  ref,
  ...elementProps
}: DayButtonProps) {
  const context = useRootContext()
  const { modifiers } = day
  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state: modifiers,
    ref,
    props: [
      {
        accessibilityRole: "button",
        accessibilityLabel: context.labelDay(day),
        accessibilityState: {
          selected: modifiers.selected,
          disabled: modifiers.disabled,
        },
        disabled: modifiers.disabled,
        onPress: (event: GestureResponderEvent) =>
          context.selectDay(day, event),
      },
      elementProps,
    ],
  })
}

DayButton.displayName = "CalendarDayButton"

export type {
  CalendarDay,
  CalendarWeek,
  ChangeEventReason,
  DateRange,
  DayButtonProps,
  DayButtonState,
  DayModifiers,
  Matcher,
  MonthChangeEventDetails,
  NavProps,
  NavState,
  RootContextValue,
  RootProps,
  RootState,
  SelectEventDetails,
  WeekDay,
}
export { CALENDAR_REASONS, DayButton, Next, Previous, Root, useRootContext }
