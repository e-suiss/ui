import { CalendarBlankIcon } from "phosphor-react-native"
import * as React from "react"
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"
import {
  WheelPicker,
  WheelPickerColumn,
  WheelPickerItem,
} from "@/components/ui/wheel-picker"

const styles = StyleSheet.create({
  trigger: {
    height: 44,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 8,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
  },
  icon: { flexShrink: 0 },
  label: { flexShrink: 1, ...fontSize.base },
  docked: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  wheels: { margin: 16, gap: 24 },
  spaced: { marginTop: 48 },
  day: { width: 48 },
  month: { width: 96 },
  year: { width: 64 },
  end: { justifyContent: "flex-end", paddingHorizontal: 0 },
  start: { justifyContent: "flex-start", paddingHorizontal: 0 },
})

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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
  style,
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
  style?: StyleProp<ViewStyle>
  accessibilityLabel?: string
  accessibilityLabelledBy?: string
}) {
  const { colors, isDark } = useTheme()
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
        style={[
          styles.trigger,
          { backgroundColor: colors.control },
          invalid && {
            borderColor: colors.danger,
            backgroundColor: withAlpha(colors.danger, isDark ? 0.1 : 0.05),
          },
          disabled && { backgroundColor: colors.controlDisabled },
          style,
        ]}
      >
        <Icon
          as={CalendarBlankIcon}
          size={16}
          color={disabled ? colors.labelQuaternary : colors.labelSecondary}
          style={styles.icon}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.label,
            {
              color: disabled
                ? colors.labelQuaternary
                : value
                  ? colors.label
                  : colors.labelSecondary,
            },
          ]}
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
        style={floating ? undefined : styles.docked}
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
          style={showCloseButton && !title ? styles.spaced : undefined}
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
  style,
}: {
  value: Date
  onValueChange: (value: Date) => void
  locale?: string
  fromYear: number
  toYear: number
  style?: StyleProp<ViewStyle>
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
        style={styles.day}
      >
        {days.map((item) => (
          <WheelPickerItem key={item} value={String(item)} style={styles.end}>
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
        style={styles.month}
      >
        {monthNames.map((name, index) => (
          <WheelPickerItem
            key={name}
            value={String(index)}
            style={styles.start}
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
        style={styles.year}
      >
        {years.map((item) => (
          <WheelPickerItem key={item} value={String(item)} style={styles.start}>
            {item}
          </WheelPickerItem>
        ))}
      </WheelPickerColumn>
    ),
  }

  return (
    <WheelPicker style={[styles.wheels, style]}>
      {order.map((part) => columns[part])}
    </WheelPicker>
  )
}

export { DatePicker }
