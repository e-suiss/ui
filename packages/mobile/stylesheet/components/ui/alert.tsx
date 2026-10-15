import type {
  Icon as PhosphorIcon,
  IconProps as PhosphorIconProps,
} from "phosphor-react-native"
import * as React from "react"
import { StyleSheet, View } from "react-native"
import { Icon } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    position: "relative",
    width: "100%",
    flexDirection: "row",
    gap: 12,
    borderRadius: radius["2xl"],
    padding: 20,
  },
  withAction: { paddingEnd: 96 },
  icon: { marginTop: 1 },
  content: { flex: 1, gap: 2 },
  title: { fontWeight: "600" },
  action: { position: "absolute", top: 16, end: 16 },
})

function Alert({
  style,
  variant = "default",
  children,
  icon,
  iconStyle,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>> & {
    icon?: PhosphorIcon
    variant?: "default" | "destructive"
    iconStyle?: PhosphorIconProps["style"]
  }) {
  const { colors } = useTheme()
  const nodes = React.Children.toArray(children)
  const actions = nodes.filter(
    (node) => React.isValidElement(node) && node.type === AlertAction
  )
  const content = nodes.filter((node) => !actions.includes(node))
  return (
    <TextStyleContext.Provider
      value={{ ...fontSize.base, color: colors.foreground }}
    >
      <View
        role="alert"
        style={[
          styles.root,
          { backgroundColor: colors.muted },
          actions.length > 0 && styles.withAction,
          style,
        ]}
        {...props}
      >
        {icon ? (
          <Icon
            as={icon}
            size={20}
            color={
              variant === "destructive" ? colors.destructive : colors.primary
            }
            style={[styles.icon, iconStyle]}
          />
        ) : null}
        <View style={styles.content}>{content}</View>
        {actions}
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
  return <Text style={[{ color: colors.mutedForeground }, style]} {...props} />
}

function AlertAction({
  style,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>>) {
  return <View style={[styles.action, style]} {...props} />
}

export { Alert, AlertAction, AlertDescription, AlertTitle }
