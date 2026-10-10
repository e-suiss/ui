import { StyleSheet, View, type ViewProps } from "react-native"
import { IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const styles = StyleSheet.create({
  root: {
    width: "100%",
    minWidth: 0,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    borderRadius: radius["2xl"],
    padding: 48,
  },
  header: {
    width: "100%",
    maxWidth: 384,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  media: {
    marginBottom: 8,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  mediaIcon: { width: 40, height: 40, borderRadius: radius.lg },
  title: { ...fontSize.lg, fontWeight: "600", textAlign: "center" },
  description: { ...fontSize.sm, textAlign: "center" },
  content: {
    width: "100%",
    maxWidth: 384,
    minWidth: 0,
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
})

function Empty({ style, ...props }: ViewProps) {
  return (
    <TextStyleContext.Provider value={{ textAlign: "center" }}>
      <View style={[styles.root, style]} {...props} />
    </TextStyleContext.Provider>
  )
}

function EmptyHeader({ style, ...props }: ViewProps) {
  return <View style={[styles.header, style]} {...props} />
}

function EmptyMedia({
  style,
  variant = "default",
  ...props
}: ViewProps & { variant?: "default" | "icon" }) {
  const { colors } = useTheme()
  const icon = variant === "icon"
  return (
    <IconSizeContext.Provider value={icon ? 20 : undefined}>
      <View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        style={[
          styles.media,
          icon && styles.mediaIcon,
          icon && { backgroundColor: colors.surfaceSecondary },
          style,
        ]}
        {...props}
      />
    </IconSizeContext.Provider>
  )
}

function EmptyTitle({ style, ...props }: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      role="heading"
      style={[styles.title, { color: colors.label }, style]}
      {...props}
    />
  )
}

function EmptyDescription({
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      style={[styles.description, { color: colors.labelSecondary }, style]}
      {...props}
    />
  )
}

function EmptyContent({ style, ...props }: ViewProps) {
  return <View style={[styles.content, style]} {...props} />
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
}
