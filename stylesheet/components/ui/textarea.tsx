import * as React from "react"
import { StyleSheet, TextInput, useWindowDimensions } from "react-native"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    minHeight: 64,
    width: "100%",
    flexDirection: "row",
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  disabled: { opacity: 0.5 },
})

function Textarea({
  style,
  multiline = true,
  numberOfLines = 8,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const [focused, setFocused] = React.useState(false)
  return (
    <TextInput
      style={[
        styles.root,
        width >= 768 ? fontSize.sm : fontSize.base,
        { backgroundColor: colors.inputSoft, color: colors.foreground },
        focused && { borderColor: colors.ring },
        props.editable === false && styles.disabled,
        style,
      ]}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      placeholderTextColor={colors.mutedForeground}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      {...props}
    />
  )
}

export { Textarea }
