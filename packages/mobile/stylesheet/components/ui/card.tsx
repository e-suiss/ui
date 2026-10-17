import * as React from "react"
import { StyleSheet, View } from "react-native"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, metrics, useTheme } from "@/components/ui/theme"

type CardSize = "default" | "sm"

type CardVariant = "default" | "filled"

const CardSizeContext = React.createContext<CardSize>("default")

const SPACING: Record<CardSize, number> = { default: 24, sm: 16 }

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: metrics.radius.card,
  },
  raised: { borderWidth: 1, ...metrics.shadow.card },
  header: { flexDirection: "column", gap: 6 },
  headerWithAction: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  headerText: { flex: 1, flexDirection: "column", gap: 6 },
  title: { ...fontSize.base, fontWeight: metrics.fontWeight.title },
  description: { ...fontSize.sm },
  action: { alignSelf: "flex-start" },
  footer: { flexDirection: "row", alignItems: "center" },
})

function Card({
  style,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>> & {
    size?: CardSize
    variant?: CardVariant
  }) {
  const { colors, isDark } = useTheme()
  const spacing = SPACING[size]
  return (
    <CardSizeContext.Provider value={size}>
      <TextStyleContext.Provider
        value={{ ...fontSize.base, color: colors.foreground }}
      >
        <View
          style={[
            styles.card,
            { gap: spacing, paddingVertical: spacing },
            variant === "filled"
              ? { backgroundColor: colors.muted }
              : [
                  styles.raised,
                  {
                    backgroundColor: colors.card,
                    borderColor: isDark
                      ? "rgba(245, 245, 247, 0.1)"
                      : "rgba(29, 29, 31, 0.05)",
                  },
                ],
            style,
          ]}
          {...props}
        />
      </TextStyleContext.Provider>
    </CardSizeContext.Provider>
  )
}

function CardHeader({
  style,
  children,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>>) {
  const size = React.useContext(CardSizeContext)
  const nodes = React.Children.toArray(children)
  const action = nodes.find(
    (node) => React.isValidElement(node) && node.type === CardAction
  )
  const padding = { paddingHorizontal: SPACING[size] }
  if (!action) {
    return (
      <View style={[styles.header, padding, style]} {...props}>
        {children}
      </View>
    )
  }
  return (
    <View style={[styles.headerWithAction, padding, style]} {...props}>
      <View style={styles.headerText}>
        {nodes.filter((node) => node !== action)}
      </View>
      {action}
    </View>
  )
}

function CardTitle({
  style,
  ref,
  ...props
}: React.ComponentProps<typeof Text> &
  React.RefAttributes<React.ComponentRef<typeof Text>>) {
  return (
    <Text ref={ref} role="heading" style={[styles.title, style]} {...props} />
  )
}

function CardDescription({
  style,
  ...props
}: React.ComponentProps<typeof Text> &
  React.RefAttributes<React.ComponentRef<typeof Text>>) {
  const { colors } = useTheme()
  return (
    <Text
      style={[styles.description, { color: colors.mutedForeground }, style]}
      {...props}
    />
  )
}

function CardAction({
  style,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>>) {
  return <View style={[styles.action, style]} {...props} />
}

function CardContent({
  style,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>>) {
  const size = React.useContext(CardSizeContext)
  return (
    <View style={[{ paddingHorizontal: SPACING[size] }, style]} {...props} />
  )
}

function CardFooter({
  style,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>>) {
  const size = React.useContext(CardSizeContext)
  return (
    <View
      style={[styles.footer, { paddingHorizontal: SPACING[size] }, style]}
      {...props}
    />
  )
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
}
