import {
  BackspaceIcon,
  FingerprintIcon,
  type Icon as PhosphorIcon,
} from "phosphor-react-native"
import type * as React from "react"
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native"
import { Icon, IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type KeypadDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

type KeypadKeyValue = KeypadDigit | "decimal" | "delete" | "biometric"

type KeypadAccessoryKey = "decimal" | "biometric"

const ROWS: readonly (readonly KeypadDigit[])[] = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
]

const KEY_SIZE = 72

const styles = StyleSheet.create({
  root: { alignItems: "center", gap: 16 },
  row: { flexDirection: "row", gap: 24 },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  text: { ...fontSize["2xl"], fontVariant: ["tabular-nums"] },
})

function KeypadKey({
  variant = "default",
  disabled,
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children" | "style"> & {
  variant?: "default" | "plain"
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  const color = disabled ? colors.labelQuaternary : colors.label
  return (
    <Pressable
      role="button"
      disabled={disabled}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.key,
        {
          backgroundColor:
            pressed && !disabled
              ? colors.controlPressed
              : variant === "plain"
                ? "transparent"
                : disabled
                  ? colors.controlDisabled
                  : colors.control,
        },
        style,
      ]}
      {...props}
    >
      <TextStyleContext.Provider value={{ ...styles.text, color }}>
        <IconSizeContext.Provider value={28}>
          {children}
        </IconSizeContext.Provider>
      </TextStyleContext.Provider>
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
  style,
  keyStyle,
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
  keyStyle?: StyleProp<ViewStyle>
}) {
  const digit = (value: KeypadDigit) => (
    <KeypadKey
      key={value}
      accessibilityLabel={value}
      disabled={disabled}
      style={keyStyle}
      onPress={() => onKeyPress?.(value)}
    >
      <Text>{value}</Text>
    </KeypadKey>
  )

  return (
    <View style={[styles.root, style]} {...props}>
      {ROWS.map((row) => (
        <View key={row.join("")} style={styles.row}>
          {row.map(digit)}
        </View>
      ))}
      <View style={styles.row}>
        {accessoryKey === "decimal" ? (
          <KeypadKey
            variant="plain"
            accessibilityLabel={decimalLabel}
            disabled={disabled}
            style={keyStyle}
            onPress={() => onKeyPress?.("decimal")}
          >
            <Text>{decimalSeparator}</Text>
          </KeypadKey>
        ) : accessoryKey === "biometric" ? (
          <KeypadKey
            variant="plain"
            accessibilityLabel={biometricLabel}
            disabled={disabled}
            style={keyStyle}
            onPress={() => onKeyPress?.("biometric")}
          >
            <Icon as={biometricIcon} />
          </KeypadKey>
        ) : (
          <View style={styles.key} />
        )}
        {digit("0")}
        <KeypadKey
          variant="plain"
          accessibilityLabel={deleteLabel}
          disabled={disabled || deleteDisabled}
          style={keyStyle}
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
