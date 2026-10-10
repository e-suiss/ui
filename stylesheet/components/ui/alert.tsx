import type {
  Icon as PhosphorIcon,
  IconProps as PhosphorIconProps,
} from "phosphor-react-native"
import * as React from "react"
import { StyleSheet, View } from "react-native"
import { Icon } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    position: "relative",
    width: "100%",
    gap: 2,
    borderRadius: 21.6,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconWrapper: { position: "absolute", top: 14, left: 16 },
  title: { marginLeft: 2, paddingLeft: 24, fontWeight: "500" },
  description: { ...fontSize.sm, marginLeft: 2, paddingLeft: 24 },
})

function Alert({
  style,
  variant,
  children,
  icon,
  iconStyle,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    icon: PhosphorIcon
    variant?: "default" | "destructive"
    iconStyle?: PhosphorIconProps["style"]
  }) {
  const { colors } = useTheme()
  const isDestructive = variant === "destructive"
  return (
    <TextStyleContext.Provider
      value={{
        ...fontSize.sm,
        color: isDestructive ? colors.destructive : colors.cardForeground,
      }}
    >
      <View
        role="alert"
        style={[
          styles.root,
          { borderColor: colors.border, backgroundColor: colors.card },
          style,
        ]}
        {...props}
      >
        <View style={styles.iconWrapper}>
          <Icon
            as={icon}
            size={16}
            color={isDestructive ? colors.destructive : undefined}
            style={iconStyle}
          />
        </View>
        {children}
      </View>
    </TextStyleContext.Provider>
  )
}

function AlertTitle({ style, ...props }: React.ComponentProps<typeof Text>) {
  return <Text style={[styles.title, style]} {...props} />
}

function AlertDescription({
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  const textStyle = React.useContext(TextStyleContext)
  const isDestructive = textStyle?.color === colors.destructive
  return (
    <Text
      style={[
        styles.description,
        {
          color: isDestructive
            ? colors.destructiveStrong
            : colors.mutedForeground,
        },
        style,
      ]}
      {...props}
    />
  )
}

export { Alert, AlertDescription, AlertTitle }
