import { cn } from "cn"
import * as React from "react"
import { View } from "react-native"
import {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useHaptics } from "@/components/primitives/haptics"
import { AnimatedView } from "@/components/ui/animated-view"
import { Keypad, type KeypadKeyValue } from "@/components/ui/keypad"
import { Text } from "@/components/ui/text"

type AmountPart = { type: string; value: string }

const MAX_DIGITS = 15
const AMOUNT_PATTERN = /^(\D*?)(\d[\d\s.,'\u2019\u00a0\u202f]*\d|\d)(\D*)$/
const DECIMAL_PATTERN = /1(\D+)5/
const NON_NUMERIC_PATTERN = /[^\d.]/g
const LEADING_ZEROS_PATTERN = /^0+(?=\d)/

const SHAKE_STEP = 400 / 6

function createFormatter(
  locale: string | undefined,
  currency: string | undefined,
  fractionDigits: number
) {
  const digits = {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }
  try {
    return new Intl.NumberFormat(
      locale,
      currency ? { ...digits, style: "currency", currency } : digits
    )
  } catch {
    return new Intl.NumberFormat(undefined, digits)
  }
}

function toParts(formatter: Intl.NumberFormat, amount: number): AmountPart[] {
  if (typeof formatter.formatToParts === "function") {
    return formatter.formatToParts(amount)
  }
  const text = formatter.format(amount)
  const match = text.match(AMOUNT_PATTERN)
  if (!match) return [{ type: "integer", value: text }]
  const [, prefix = "", number = "", suffix = ""] = match
  const parts: AmountPart[] = []
  if (prefix.trim()) parts.push({ type: "currency", value: prefix.trim() })
  if (prefix !== prefix.trimEnd()) parts.push({ type: "literal", value: " " })
  parts.push({ type: "integer", value: number })
  if (suffix !== suffix.trimStart()) parts.push({ type: "literal", value: " " })
  if (suffix.trim()) parts.push({ type: "currency", value: suffix.trim() })
  return parts
}

function currencyFractionDigits(
  locale: string | undefined,
  currency: string | undefined
) {
  if (!currency) return 2
  try {
    return (
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).resolvedOptions().maximumFractionDigits ?? 2
    )
  } catch {
    return 2
  }
}

function decimalSeparatorOf(locale: string | undefined) {
  const formatter = createFormatter(locale, undefined, 1)
  const parts = toParts(formatter, 1.5)
  const decimal = parts.find((part) => part.type === "decimal")?.value
  if (decimal) return decimal
  return formatter.format(1.5).match(DECIMAL_PATTERN)?.[1] ?? "."
}

function toAmount(value: string) {
  if (!value || value === ".") return 0
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

function sanitize(value: string, fractionDigits: number) {
  const [integer = "", ...rest] = value
    .replace(NON_NUMERIC_PATTERN, "")
    .split(".")
  const fraction = rest.join("").slice(0, fractionDigits)
  const trimmed = integer.replace(LEADING_ZEROS_PATTERN, "")
  if (fractionDigits === 0 || rest.length === 0) return trimmed
  return `${trimmed || "0"}.${fraction}`
}

function nextValue(
  current: string,
  key: KeypadKeyValue,
  fractionDigits: number,
  max: number | undefined
) {
  if (key === "biometric") return current
  if (key === "delete") return current.slice(0, -1)
  const [integer = "", fraction] = current.split(".")
  if (key === "decimal") {
    if (fractionDigits === 0 || fraction !== undefined) return current
    return `${integer || "0"}.`
  }
  if (fraction !== undefined && fraction.length >= fractionDigits) {
    return current
  }
  if (integer.length + (fraction?.length ?? 0) >= MAX_DIGITS) return current
  const next =
    fraction === undefined && integer === "0" ? key : `${current}${key}`
  if (max !== undefined && toAmount(next) > max) return current
  return next
}

function formatParts(
  value: string,
  locale: string | undefined,
  currency: string | undefined,
  decimalSeparator: string
) {
  const fraction = value.split(".")[1]
  const fractionDigits = fraction?.length ?? 0
  const parts = toParts(
    createFormatter(locale, currency, fractionDigits),
    toAmount(value)
  )
  if (fraction === undefined || fractionDigits > 0) return parts
  let last = -1
  parts.forEach((part, index) => {
    if (part.type === "integer" || part.type === "group") last = index
  })
  const decimal = { type: "decimal", value: decimalSeparator }
  if (last === -1) return [...parts, decimal]
  return [...parts.slice(0, last + 1), decimal, ...parts.slice(last + 1)]
}

function amountSizeClassName(characters: number) {
  if (characters > 11) return { amount: "text-4xl", symbol: "text-2xl" }
  if (characters > 8) return { amount: "text-5xl", symbol: "text-3xl" }
  return { amount: "text-6xl", symbol: "text-4xl" }
}

function AmountInput({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  currency,
  locale,
  maxFractionDigits: maxFractionDigitsProp,
  max,
  placeholder = "0",
  disabled = false,
  deleteLabel,
  decimalLabel,
  className,
  amountClassName,
  keypadClassName,
  accessibilityLabel,
  ...props
}: React.ComponentProps<typeof View> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, amount: number) => void
  currency?: string
  locale?: string
  maxFractionDigits?: number
  max?: number
  placeholder?: string
  disabled?: boolean
  deleteLabel?: string
  decimalLabel?: string
  amountClassName?: string
  keypadClassName?: string
}) {
  const haptics = useHaptics()
  const maxFractionDigits = Math.max(
    0,
    maxFractionDigitsProp ?? currencyFractionDigits(locale, currency)
  )
  const decimalSeparator = React.useMemo(
    () => decimalSeparatorOf(locale),
    [locale]
  )
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    sanitize(defaultValue, maxFractionDigits)
  )
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolled
  const valueRef = React.useRef(value)
  valueRef.current = value

  const offset = useSharedValue(0)

  const reject = () => {
    haptics.notification("error")
    const step = { duration: SHAKE_STEP, reduceMotion: ReduceMotion.System }
    offset.value = withSequence(
      withTiming(-12, step),
      withTiming(10, step),
      withTiming(-8, step),
      withTiming(6, step),
      withTiming(-3, step),
      withTiming(0, step)
    )
  }

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  const press = (key: KeypadKeyValue) => {
    const current = valueRef.current
    const next = nextValue(current, key, maxFractionDigits, max)
    if (next === current) {
      if (key !== "delete" && key !== "biometric" && current !== "0") {
        reject()
      }
      return
    }
    valueRef.current = next
    if (!isControlled) setUncontrolled(next)
    onValueChange?.(next, toAmount(next))
    haptics.selection()
  }

  const empty = value === ""
  const parts = empty
    ? formatParts("0", locale, currency, decimalSeparator).map((part) =>
        part.type === "integer" ? { ...part, value: placeholder } : part
      )
    : formatParts(value, locale, currency, decimalSeparator)
  const text = parts.map((part) => part.value).join("")
  const size = amountSizeClassName(text.length)
  const color = empty || disabled ? "text-label-tertiary" : "text-label"

  return (
    <View className={cn("items-center gap-8", className)} {...props}>
      <AnimatedView
        className="h-18 w-full items-center justify-center px-4"
        style={shakeStyle}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
          accessibilityLabel={
            accessibilityLabel ? `${accessibilityLabel}, ${text}` : text
          }
          accessibilityLiveRegion="polite"
          className={cn(
            "font-semibold tabular-nums tracking-tight",
            size.amount,
            color,
            amountClassName
          )}
        >
          {parts.map((part) =>
            part.type === "currency" ? (
              <Text
                key="currency"
                className={cn("font-semibold", size.symbol, color)}
              >
                {part.value}
              </Text>
            ) : (
              part.value
            )
          )}
        </Text>
      </AnimatedView>
      <Keypad
        accessoryKey={maxFractionDigits > 0 ? "decimal" : undefined}
        decimalSeparator={decimalSeparator}
        decimalLabel={decimalLabel}
        deleteLabel={deleteLabel}
        disabled={disabled}
        deleteDisabled={empty}
        onKeyPress={press}
        className={keypadClassName}
      />
    </View>
  )
}

export { AmountInput }
