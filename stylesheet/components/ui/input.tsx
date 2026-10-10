import * as React from "react"
import { StyleSheet, TextInput } from "react-native"
import { radius, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    height: 36,
    width: "100%",
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius["3xl"],
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 16,
    lineHeight: 20,
  },
  disabled: { opacity: 0.5 },
})

function Input({
  style,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  const { colors } = useTheme()
  const [focused, setFocused] = React.useState(false)
  return (
    <TextInput
      style={[
        styles.root,
        { backgroundColor: colors.inputSoft, color: colors.foreground },
        focused && { borderColor: colors.ring },
        props.editable === false && styles.disabled,
        style,
      ]}
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

export { Input }
