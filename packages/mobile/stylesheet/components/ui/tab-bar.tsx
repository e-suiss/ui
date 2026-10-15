import type { Icon as PhosphorIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useHaptics } from "@/components/primitives/haptics"
import * as TabsPrimitive from "@/components/primitives/tabs"
import { resolveStyle } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import { ScreenContext } from "@/components/ui/screen"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

type TabBarBadgeValue = number | string | boolean

const styles = StyleSheet.create({
  root: { paddingHorizontal: 16, paddingTop: 8 },
  list: {
    flexDirection: "row",
    borderRadius: radius.full,
    borderWidth: 1,
    padding: 4,
    ...shadow.lg,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderRadius: radius.full,
    paddingVertical: 6,
  },
  label: { ...fontSize["3xs"], fontWeight: "500" },
  iconWrap: { position: "relative" },
  dot: {
    position: "absolute",
    top: -2,
    end: -4,
    width: 10,
    height: 10,
    borderRadius: radius.full,
    borderWidth: 2,
  },
  badge: {
    position: "absolute",
    top: -6,
    end: -12,
    height: 18,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderWidth: 2,
    paddingHorizontal: 4,
  },
  badgeText: { ...fontSize["3xs"], fontWeight: "600" },
})

function withAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16)
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`
}

function badgeText(badge: TabBarBadgeValue | undefined) {
  if (badge === undefined || badge === false || badge === true) return undefined
  if (typeof badge === "number") {
    if (badge <= 0) return undefined
    return badge > 99 ? "99+" : String(badge)
  }
  return badge.length > 0 ? badge : undefined
}

function TabBar({
  onValueChange,
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const haptics = useHaptics()
  const insets = useSafeAreaInsets()
  const screen = React.useContext(ScreenContext)
  const consumed = screen?.edges.includes("bottom") ? insets.bottom : 0
  const paddingBottom = Math.max(12, insets.bottom - consumed - 8)
  return (
    <TabsPrimitive.Root
      style={(state) => [
        styles.root,
        { paddingBottom },
        resolveStyle(style, state) as ViewStyle,
      ]}
      onValueChange={(value, details) => {
        onValueChange?.(value, details)
        if (!details.isCanceled) haptics.selection()
      }}
      {...props}
    />
  )
}

function TabBarList({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { colors, isDark } = useTheme()
  return (
    <TabsPrimitive.List
      style={(state) => [
        styles.list,
        {
          borderColor: withAlpha(colors.foreground, isDark ? 0.1 : 0.05),
          backgroundColor: colors.card,
        },
        resolveStyle(style, state) as ViewStyle,
      ]}
      {...props}
    />
  )
}

function TabBarBadge({ badge }: { badge: TabBarBadgeValue }) {
  const { colors } = useTheme()
  const text = badgeText(badge)
  if (badge === true) {
    return (
      <View
        style={[
          styles.dot,
          { backgroundColor: colors.destructive, borderColor: colors.card },
        ]}
      />
    )
  }
  if (text === undefined) return null
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.destructive, borderColor: colors.card },
      ]}
    >
      <Text
        style={[styles.badgeText, { color: colors.primaryForeground }]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  )
}

function TabBarItem({
  icon,
  badge,
  style,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab> & {
  icon?: PhosphorIcon
  badge?: TabBarBadgeValue
}) {
  const { colors } = useTheme()
  const text = badgeText(badge)
  return (
    <TabsPrimitive.Tab
      style={(state) => [
        styles.item,
        state.active && { backgroundColor: colors.secondary },
        state.disabled && { opacity: 0.5 },
        resolveStyle(style, state) as ViewStyle,
      ]}
      accessibilityValue={text === undefined ? undefined : { text }}
      render={(renderProps, state) => {
        let color = colors.mutedForeground
        if (state.active) color = colors.primary
        const { style: baseStyle, ...rest } = renderProps
        return (
          <TextStyleContext.Provider value={{ ...styles.label, color }}>
            <Pressable
              {...rest}
              style={({ pressed }) => [baseStyle, pressed && { opacity: 0.8 }]}
            >
              {icon || badge !== undefined ? (
                <View style={styles.iconWrap}>
                  {icon ? (
                    <Icon
                      as={icon}
                      size={24}
                      color={color}
                      weight={state.active ? "fill" : "regular"}
                    />
                  ) : null}
                  {badge !== undefined ? <TabBarBadge badge={badge} /> : null}
                </View>
              ) : null}
              {typeof children === "string" || typeof children === "number" ? (
                <Text numberOfLines={1}>{children}</Text>
              ) : (
                children
              )}
            </Pressable>
          </TextStyleContext.Provider>
        )
      }}
      {...props}
    />
  )
}

export type { TabBarBadgeValue }
export { TabBar, TabBarItem, TabBarList }
