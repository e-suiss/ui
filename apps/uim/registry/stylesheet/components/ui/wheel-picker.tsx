import type * as React from "react"
import {
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { resolveStyle } from "@/components/primitives/use-render"
import * as WheelPickerPrimitive from "@/components/primitives/wheel-picker"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    position: "relative",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
  },
  indicator: { borderRadius: radius.lg },
  column: { position: "relative", borderRadius: radius.lg },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  text: { ...fontSize.xl, fontVariant: ["tabular-nums"] },
})

function WheelPicker({
  style,
  children,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.Root>) {
  const { colors } = useTheme()
  return (
    <WheelPickerPrimitive.Root
      style={(state) => [
        styles.root,
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      <WheelPickerPrimitive.Indicator
        style={[styles.indicator, { backgroundColor: colors.control }]}
      />
      {children}
    </WheelPickerPrimitive.Root>
  )
}

function WheelPickerColumn({
  style,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.Column>) {
  return (
    <WheelPickerPrimitive.Column
      style={(state) => [
        styles.column,
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

function WheelPickerItem({
  style,
  children,
  disabled = false,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.Item>) {
  const { colors } = useTheme()
  const textStyle: TextStyle = {
    ...styles.text,
    color: disabled ? colors.labelTertiary : colors.label,
  }
  return (
    <TextStyleContext.Provider value={textStyle}>
      <WheelPickerPrimitive.Item
        disabled={disabled}
        style={(state) => [
          styles.item,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      >
        {typeof children === "string" || typeof children === "number" ? (
          <Text numberOfLines={1}>{children}</Text>
        ) : (
          children
        )}
      </WheelPickerPrimitive.Item>
    </TextStyleContext.Provider>
  )
}

export { WheelPicker, WheelPickerColumn, WheelPickerItem }
