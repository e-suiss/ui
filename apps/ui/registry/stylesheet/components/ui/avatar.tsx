import * as React from "react"
import { StyleSheet, View } from "react-native"
import * as AvatarPrimitive from "@/components/primitives/avatar"
import { IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type AvatarSize = "default" | "sm" | "lg" | "xl"

const AvatarSizeContext = React.createContext<AvatarSize>("default")

const AvatarGroupItemContext = React.createContext<number | null>(null)

const ROOT_SIZE: Record<AvatarSize, number> = {
  sm: 24,
  default: 32,
  lg: 40,
  xl: 64,
}

const TEXT_SIZE: Record<AvatarSize, keyof typeof fontSize> = {
  sm: "3xs",
  default: "xs",
  lg: "md",
  xl: "2xl",
}

const FALLBACK_ICON: Record<AvatarSize, number> = {
  sm: 14,
  default: 19,
  lg: 24,
  xl: 38,
}

const BADGE_SIZE: Record<AvatarSize, number> = {
  sm: 12,
  default: 16,
  lg: 18,
  xl: 22,
}

const BADGE_ICON: Record<AvatarSize, number> = {
  sm: 0,
  default: 8,
  lg: 10,
  xl: 12,
}

const COUNT_ICON: Record<AvatarSize, number> = {
  sm: 12,
  default: 16,
  lg: 20,
  xl: 28,
}

const styles = StyleSheet.create({
  root: {
    position: "relative",
    flexShrink: 0,
    borderRadius: radius.full,
  },
  ring: { borderWidth: 2 },
  image: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    borderRadius: radius.full,
  },
  fallback: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  badge: {
    position: "absolute",
    end: -2,
    bottom: -2,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderWidth: 2,
  },
  group: { flexDirection: "row", alignItems: "center" },
  count: {
    position: "relative",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderWidth: 2,
  },
})

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function groupOffset(index: number | null, size: AvatarSize) {
  if (index === null || index === 0) return undefined
  return { marginStart: size === "xl" ? -16 : -8 }
}

function Avatar({
  style,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: AvatarSize
}) {
  const { colors } = useTheme()
  const groupIndex = React.useContext(AvatarGroupItemContext)
  const dimension = ROOT_SIZE[size]
  return (
    <AvatarSizeContext.Provider value={size}>
      <AvatarGroupItemContext.Provider value={null}>
        <AvatarPrimitive.Root
          style={(state) => [
            styles.root,
            { width: dimension, height: dimension },
            groupIndex !== null && [
              styles.ring,
              { borderColor: colors.surface },
            ],
            groupOffset(groupIndex, size),
            typeof style === "function" ? style(state) : style,
          ]}
          {...props}
        />
      </AvatarGroupItemContext.Provider>
    </AvatarSizeContext.Provider>
  )
}

function AvatarImage({
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      style={(state) => [
        styles.image,
        typeof style === "function" ? style(state) : style,
      ]}
      resizeMode="cover"
      {...props}
    />
  )
}

function AvatarFallback({
  style,
  children,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  const { colors, isDark } = useTheme()
  const size = React.useContext(AvatarSizeContext)
  return (
    <TextStyleContext.Provider
      value={{
        ...fontSize[TEXT_SIZE[size]],
        fontWeight: "600",
        textTransform: "uppercase",
        color: colors.onAccent,
      }}
    >
      <IconSizeContext.Provider value={FALLBACK_ICON[size]}>
        <AvatarPrimitive.Fallback
          style={(state) => [
            styles.fallback,
            {
              backgroundColor: isDark
                ? withAlpha(colors.labelSecondary, 0.6)
                : colors.labelSecondary,
            },
            typeof style === "function" ? style(state) : style,
          ]}
          {...props}
        >
          {typeof children === "string" || typeof children === "number" ? (
            <Text>{children}</Text>
          ) : (
            children
          )}
        </AvatarPrimitive.Fallback>
      </IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

function AvatarBadge({
  style,
  children,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  const { colors } = useTheme()
  const size = React.useContext(AvatarSizeContext)
  const dimension = BADGE_SIZE[size]
  return (
    <TextStyleContext.Provider value={{ color: colors.onAccent }}>
      <IconSizeContext.Provider value={BADGE_ICON[size]}>
        <View
          style={[
            styles.badge,
            {
              width: dimension,
              height: dimension,
              backgroundColor: colors.accent,
              borderColor: colors.surface,
            },
            style,
          ]}
          {...props}
        >
          {size === "sm" ? null : children}
        </View>
      </IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

function AvatarGroup({
  style,
  children,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  let index = 0
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    const value = index
    index += 1
    return (
      <AvatarGroupItemContext.Provider value={value}>
        {child}
      </AvatarGroupItemContext.Provider>
    )
  })
  return (
    <View style={[styles.group, style]} {...props}>
      {items}
    </View>
  )
}

function AvatarGroupCount({
  style,
  size = "default",
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    size?: AvatarSize
  }) {
  const { colors } = useTheme()
  const groupIndex = React.useContext(AvatarGroupItemContext)
  const dimension = ROOT_SIZE[size]
  return (
    <TextStyleContext.Provider
      value={{
        ...fontSize[TEXT_SIZE[size]],
        fontWeight: "600",
        color: colors.label,
      }}
    >
      <IconSizeContext.Provider value={COUNT_ICON[size]}>
        <View
          style={[
            styles.count,
            {
              width: dimension,
              height: dimension,
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.surface,
            },
            groupOffset(groupIndex, size),
            style,
          ]}
          {...props}
        />
      </IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
}
