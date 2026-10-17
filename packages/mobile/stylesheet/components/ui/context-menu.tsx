import type { IconProps as PhosphorIconProps } from "phosphor-react-native"
import { CaretRightIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native"
import { FadeIn, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as ContextMenuPrimitive from "@/components/primitives/context-menu"
import { resolveStyle } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, metrics, useTheme } from "@/components/ui/theme"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuSub = ContextMenuPrimitive.SubmenuRoot

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  itemText: { ...fontSize.base, userSelect: "none" },
  subTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: metrics.radius.menuItem,
    paddingHorizontal: metrics.paddingX.menuItem,
    paddingVertical: metrics.paddingY.menuItem,
  },
  subTriggerIcon: { marginLeft: "auto", flexShrink: 0 },
  subTriggerIconOpen: { transform: [{ rotate: "90deg" }] },
  subContent: {
    minWidth: 144,
    borderRadius: metrics.radius.menu,
    borderWidth: 1,
    padding: metrics.padding.menu,
    ...metrics.shadow.menu,
  },
  content: {
    minWidth: 192,
    borderRadius: metrics.radius.menu,
    borderWidth: 1,
    padding: metrics.padding.menu,
    ...metrics.shadow.menu,
  },
  item: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: metrics.radius.menuItem,
    paddingHorizontal: metrics.paddingX.menuItem,
    paddingVertical: metrics.paddingY.menuItem,
  },
  checkItem: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: metrics.radius.menuItem,
    paddingVertical: metrics.paddingY.menuItem,
    paddingRight: 32,
    paddingLeft: metrics.paddingX.menuItem,
  },
  indicator: {
    position: "absolute",
    right: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...fontSize.xs,
    fontWeight: "600",
  },
  inset: { paddingLeft: 38 },
  separator: {
    marginHorizontal: -6,
    marginVertical: 6,
    height: 1,
    opacity: 0.5,
  },
})

function usePopupColors() {
  const { colors, isDark } = useTheme()
  return {
    borderColor: `${colors.foreground}${isDark ? "1a" : "0d"}`,
    backgroundColor: colors.popover,
  }
}

type PositionerProps = React.ComponentProps<
  typeof ContextMenuPrimitive.Positioner
>

function ContextMenuContent({
  style,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 0,
  portalHost,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Popup> &
  Pick<PositionerProps, "align" | "alignOffset" | "side" | "sideOffset"> & {
    portalHost?: string
  }) {
  const { colors } = useTheme()
  const popupColors = usePopupColors()
  return (
    <ContextMenuPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <ContextMenuPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
        >
          <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
            <TextStyleContext.Provider
              value={{ ...fontSize.base, color: colors.foreground }}
            >
              <ContextMenuPrimitive.Popup
                style={(state) => [
                  styles.content,
                  popupColors,
                  resolveStyle(style, state) as StyleProp<ViewStyle>,
                ]}
                {...props}
              />
            </TextStyleContext.Provider>
          </AnimatedView>
        </ContextMenuPrimitive.Positioner>
      </FullWindowOverlay>
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuSubTrigger({
  style,
  inset,
  children,
  iconStyle,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubmenuTrigger> & {
  children?: React.ReactNode
  iconStyle?: PhosphorIconProps["style"]
  inset?: boolean
}) {
  const { open } = ContextMenuPrimitive.useMenuRootContext().floating
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{
        ...styles.itemText,
        color: colors.foreground,
      }}
    >
      <ContextMenuPrimitive.SubmenuTrigger
        style={(state) => [
          styles.subTrigger,
          state.open && { backgroundColor: colors.accent },
          state.open && { marginBottom: 4 },
          state.highlighted && { opacity: 0.8 },
          props.disabled && { opacity: 0.5 },
          inset && styles.inset,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      >
        {children}
        <View
          style={[styles.subTriggerIcon, open && styles.subTriggerIconOpen]}
        >
          <Icon as={CaretRightIcon} size={16} style={iconStyle} />
        </View>
      </ContextMenuPrimitive.SubmenuTrigger>
    </TextStyleContext.Provider>
  )
}

function ContextMenuSubContent({
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Popup>) {
  const popupColors = usePopupColors()
  return (
    <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <ContextMenuPrimitive.Popup
        style={(state) => [
          styles.subContent,
          popupColors,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      />
    </AnimatedView>
  )
}

function ContextMenuItem({
  style,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  const { colors } = useTheme()
  const destructive = variant === "destructive"
  const color = destructive ? colors.destructive : colors.foreground
  return (
    <TextStyleContext.Provider
      value={{
        ...styles.itemText,
        color,
      }}
    >
      <ContextMenuPrimitive.Item
        style={(state) => [
          styles.item,
          state.highlighted && { opacity: 0.8 },
          props.disabled && { opacity: 0.5 },
          inset && styles.inset,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

function ContextMenuCheckboxItem({
  style,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> & {
  children?: React.ReactNode
  inset?: boolean
}) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{
        ...styles.itemText,
        color: colors.foreground,
      }}
    >
      <ContextMenuPrimitive.CheckboxItem
        style={(state) => [
          styles.checkItem,
          state.highlighted && { opacity: 0.8 },
          props.disabled && { opacity: 0.5 },
          inset && styles.inset,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      >
        <View style={styles.indicator}>
          <ContextMenuPrimitive.CheckboxItemIndicator>
            <Icon as={CheckIcon} size={16} />
          </ContextMenuPrimitive.CheckboxItemIndicator>
        </View>
        {children}
      </ContextMenuPrimitive.CheckboxItem>
    </TextStyleContext.Provider>
  )
}

function ContextMenuRadioItem({
  style,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> & {
  children?: React.ReactNode
  inset?: boolean
}) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{
        ...styles.itemText,
        color: colors.foreground,
      }}
    >
      <ContextMenuPrimitive.RadioItem
        style={(state) => [
          styles.checkItem,
          state.highlighted && { opacity: 0.8 },
          props.disabled && { opacity: 0.5 },
          inset && styles.inset,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      >
        <View style={styles.indicator}>
          <ContextMenuPrimitive.RadioItemIndicator>
            <Icon as={CheckIcon} size={16} />
          </ContextMenuPrimitive.RadioItemIndicator>
        </View>
        {children}
      </ContextMenuPrimitive.RadioItem>
    </TextStyleContext.Provider>
  )
}

function ContextMenuLabel({
  style,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.GroupLabel> & {
  inset?: boolean
}) {
  const { colors } = useTheme()
  return (
    <ContextMenuPrimitive.GroupLabel
      style={(state) => [
        styles.label,
        { color: colors.mutedForeground },
        inset && styles.inset,
        resolveStyle(style, state) as StyleProp<TextStyle>,
      ]}
      {...props}
    />
  )
}

function ContextMenuSeparator({
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  const { colors } = useTheme()
  return (
    <ContextMenuPrimitive.Separator
      style={(state) => [
        styles.separator,
        { backgroundColor: colors.border },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
