import { StyleSheet, View } from "react-native"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    overflow: "hidden",
    borderRadius: radius["4xl"],
    borderWidth: 1,
    paddingVertical: 24,
    ...shadow.md,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500",
  },
  description: { ...fontSize.sm },
  content: { paddingHorizontal: 24 },
  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
  },
})

function Card({
  style,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider value={{ color: colors.cardForeground }}>
      <View
        style={[
          styles.card,
          { borderColor: colors.outline, backgroundColor: colors.card },
          style,
        ]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

function CardHeader({
  style,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View style={[styles.header, style]} {...props} />
}

function CardTitle({
  style,
  ref,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  return (
    <Text
      ref={ref}
      role="heading"
      aria-level={3}
      style={[styles.title, style]}
      {...props}
    />
  )
}

function CardDescription({
  style,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      style={[styles.description, { color: colors.mutedForeground }, style]}
      {...props}
    />
  )
}

function CardContent({
  style,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View style={[styles.content, style]} {...props} />
}

function CardFooter({
  style,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View style={[styles.footer, style]} {...props} />
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
