import * as React from "react"
import {
  Pressable,
  type PressableStateCallbackType,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"
import { IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type ItemSize = "default" | "sm" | "xs"

type ItemVariant = "default" | "outline" | "muted"

const ItemGroupContext = React.createContext<{ inset: boolean }>({
  inset: false,
})

const ItemContext = React.createContext<{ size: ItemSize }>({
  size: "default",
})

const styles = StyleSheet.create({
  group: { width: "100%", flexDirection: "column", gap: 16 },
  groupInset: { gap: 0, overflow: "hidden", borderRadius: radius["2xl"] },
  separator: { marginVertical: 8, height: 1, flexShrink: 0 },
  separatorInset: { marginVertical: 0, marginStart: 16 },
  item: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "transparent",
  },
  default: { gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  sm: { gap: 14, paddingHorizontal: 14, paddingVertical: 12 },
  xs: { gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  media: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mediaImage: {
    width: 40,
    height: 40,
    overflow: "hidden",
    borderRadius: radius.md,
  },
  content: { minWidth: 0, flex: 1, flexDirection: "column", gap: 4 },
  title: { ...fontSize.base, fontWeight: "600" },
  description: { ...fontSize.sm, textAlign: "left" },
  actions: { flexDirection: "row", alignItems: "center", gap: 8 },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
})

function ItemGroup({
  style,
  variant = "default",
  ...props
}: ViewProps & { variant?: "default" | "inset" }) {
  const { colors } = useTheme()
  const inset = variant === "inset"
  const contextValue = React.useMemo(() => ({ inset }), [inset])
  return (
    <ItemGroupContext.Provider value={contextValue}>
      <View
        role="list"
        style={[
          styles.group,
          inset && styles.groupInset,
          inset && { backgroundColor: colors.muted },
          style,
        ]}
        {...props}
      />
    </ItemGroupContext.Provider>
  )
}

function ItemSeparator({ style, ...props }: ViewProps) {
  const { colors } = useTheme()
  const { inset } = React.useContext(ItemGroupContext)
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      style={[
        styles.separator,
        inset && styles.separatorInset,
        { backgroundColor: colors.border },
        style,
      ]}
      {...props}
    />
  )
}

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

type ItemProps = Omit<React.ComponentProps<typeof Pressable>, "style"> & {
  variant?: ItemVariant
  size?: ItemSize
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
  render?: RenderProp<Record<string, unknown>, Record<string, never>>
}

function Item({
  style,
  variant = "default",
  size = "default",
  render,
  ...props
}: ItemProps) {
  const { colors } = useTheme()
  const { inset } = React.useContext(ItemGroupContext)
  const interactive = Boolean(props.onPress || props.onLongPress)
  const contextValue = React.useMemo(() => ({ size }), [size])
  const base: StyleProp<ViewStyle> = [
    styles.item,
    styles[size],
    variant === "outline" && { borderColor: colors.border },
    variant === "muted" && {
      backgroundColor: withAlpha(colors.muted, 0.5),
    },
    inset && { borderRadius: 0 },
    props.disabled && { opacity: 0.5 },
  ]
  const element = useRender({
    defaultComponent: interactive ? Pressable : View,
    render,
    props: [
      {
        role: interactive ? "button" : "listitem",
        style: interactive
          ? (state: PressableStateCallbackType) => [
              base,
              state.pressed && { opacity: 0.8 },
              typeof style === "function" ? style(state) : style,
            ]
          : [
              base,
              typeof style === "function" ? style({ pressed: false }) : style,
            ],
      },
      props,
    ],
  })
  return (
    <ItemContext.Provider value={contextValue}>{element}</ItemContext.Provider>
  )
}

function ItemMedia({
  style,
  variant = "default",
  ...props
}: ViewProps & { variant?: "default" | "icon" | "image" }) {
  const { size } = React.useContext(ItemContext)
  const image = variant === "image"
  return (
    <IconSizeContext.Provider value={variant === "icon" ? 16 : undefined}>
      <View
        style={[
          styles.media,
          image && styles.mediaImage,
          image && size === "sm" && { width: 32, height: 32 },
          image &&
            size === "xs" && { width: 24, height: 24, borderRadius: radius.sm },
          style,
        ]}
        {...props}
      />
    </IconSizeContext.Provider>
  )
}

function ItemContent({ style, ...props }: ViewProps) {
  const { size } = React.useContext(ItemContext)
  return (
    <View
      style={[styles.content, size === "xs" && { gap: 2 }, style]}
      {...props}
    />
  )
}

function ItemTitle({
  style,
  numberOfLines = 1,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.title, { color: colors.foreground }, style]}
      {...props}
    />
  )
}

function ItemDescription({
  style,
  numberOfLines = 2,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[styles.description, { color: colors.mutedForeground }, style]}
      {...props}
    />
  )
}

function ItemActions({ style, ...props }: ViewProps) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...fontSize.base, color: colors.mutedForeground }}
    >
      <View style={[styles.actions, style]} {...props} />
    </TextStyleContext.Provider>
  )
}

function ItemHeader({ style, ...props }: ViewProps) {
  return <View style={[styles.row, style]} {...props} />
}

function ItemFooter({ style, ...props }: ViewProps) {
  return <View style={[styles.row, style]} {...props} />
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemGroupContext,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
}
