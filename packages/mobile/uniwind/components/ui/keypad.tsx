import { cn } from "cn"
import {
  BackspaceIcon,
  FingerprintIcon,
  type Icon as PhosphorIcon,
} from "phosphor-react-native"
import type * as React from "react"
import { Pressable, View } from "react-native"
import { Icon, IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

type KeypadDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

type KeypadKeyValue = KeypadDigit | "decimal" | "delete" | "biometric"

type KeypadAccessoryKey = "decimal" | "biometric"

const ROWS: readonly (readonly KeypadDigit[])[] = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
]

function KeypadKey({
  variant = "default",
  disabled,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children"> & {
  variant?: "default" | "plain"
  className?: string
  children?: React.ReactNode
}) {
  const contentClassName = disabled ? "text-label-quaternary" : "text-label"
  return (
    <Pressable
      role="button"
      disabled={disabled}
      accessibilityState={{ disabled: !!disabled }}
      className={cn(
        "size-18 items-center justify-center rounded-full",
        variant === "default" &&
          (disabled ? "bg-control-disabled" : "bg-control"),
        !disabled && "active:bg-control-pressed",
        className
      )}
      {...props}
    >
      <TextClassContext.Provider
        value={cn("text-2xl tabular-nums", contentClassName)}
      >
        <IconClassContext.Provider value={cn("size-7", contentClassName)}>
          {children}
        </IconClassContext.Provider>
      </TextClassContext.Provider>
    </Pressable>
  )
}

function Keypad({
  onKeyPress,
  accessoryKey,
  decimalSeparator = ".",
  biometricIcon = FingerprintIcon,
  biometricLabel = "Use biometrics",
  decimalLabel = "Decimal separator",
  deleteLabel = "Delete",
  disabled = false,
  deleteDisabled = false,
  className,
  keyClassName,
  ...props
}: React.ComponentProps<typeof View> & {
  onKeyPress?: (key: KeypadKeyValue) => void
  accessoryKey?: KeypadAccessoryKey
  decimalSeparator?: string
  biometricIcon?: PhosphorIcon
  biometricLabel?: string
  decimalLabel?: string
  deleteLabel?: string
  disabled?: boolean
  deleteDisabled?: boolean
  keyClassName?: string
}) {
  const digit = (value: KeypadDigit) => (
    <KeypadKey
      key={value}
      accessibilityLabel={value}
      disabled={disabled}
      className={keyClassName}
      onPress={() => onKeyPress?.(value)}
    >
      <Text>{value}</Text>
    </KeypadKey>
  )

  const accessory = () => {
    if (accessoryKey === "decimal") {
      return (
        <KeypadKey
          variant="plain"
          accessibilityLabel={decimalLabel}
          disabled={disabled}
          className={keyClassName}
          onPress={() => onKeyPress?.("decimal")}
        >
          <Text>{decimalSeparator}</Text>
        </KeypadKey>
      )
    }
    if (accessoryKey === "biometric") {
      return (
        <KeypadKey
          variant="plain"
          accessibilityLabel={biometricLabel}
          disabled={disabled}
          className={keyClassName}
          onPress={() => onKeyPress?.("biometric")}
        >
          <Icon as={biometricIcon} />
        </KeypadKey>
      )
    }
    return <View className="size-18" />
  }

  return (
    <View className={cn("items-center gap-4", className)} {...props}>
      {ROWS.map((row) => (
        <View key={row.join("")} className="flex-row gap-6">
          {row.map(digit)}
        </View>
      ))}
      <View className="flex-row gap-6">
        {accessory()}
        {digit("0")}
        <KeypadKey
          variant="plain"
          accessibilityLabel={deleteLabel}
          disabled={disabled || deleteDisabled}
          className={keyClassName}
          onPress={() => onKeyPress?.("delete")}
        >
          <Icon as={BackspaceIcon} />
        </KeypadKey>
      </View>
    </View>
  )
}

export type { KeypadAccessoryKey, KeypadDigit, KeypadKeyValue }
export { Keypad, KeypadKey }
