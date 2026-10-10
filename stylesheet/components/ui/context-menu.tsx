import type { IconProps as PhosphorIconProps } from "phosphor-react-native"
import { CaretDownIcon, CaretUpIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  type StyleProp,
  StyleSheet,
  Text,
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
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuSub = ContextMenuPrimitive.SubmenuRoot

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  itemText: { ...fontSize.sm, fontWeight: "500", userSelect: "none" },
  subTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: radius["2xl"],
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  subTriggerIcon: { marginLeft: "auto", flexShrink: 0 },
  subContent: {
    minWidth: 144,
    borderRadius: radius["3xl"],
    borderWidth: 1,
    padding: 6,
    ...shadow.lg,
  },
  content: {
    minWidth: 192,
    borderRadius: radius["3xl"],
    borderWidth: 1,
    padding: 6,
    ...shadow.lg,
  },
  item: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: radius["2xl"],
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  checkItem: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: radius["2xl"],
    paddingVertical: 8,
    paddingRight: 32,
    paddingLeft: 12,
  },
  indicator: {
    position: "absolute",
    right: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { paddingHorizontal: 12, paddingVertical: 10, ...fontSize.xs },
  inset: { paddingLeft: 38 },
  disabled: { opacity: 0.5 },
  separator: { marginHorizontal: -6, marginVertical: 6, height: 1 },
  shortcut: { marginLeft: "auto", ...fontSize.xs, letterSpacing: 1.2 },
})

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
              value={{ ...fontSize.sm, color: colors.popoverForeground }}
            >
              <ContextMenuPrimitive.Popup
                style={(state) => [
                  styles.content,
                  {
                    borderColor: colors.outline,
                    backgroundColor: colors.popover,
                  },
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
        color: open ? colors.accentForeground : colors.popoverForeground,
      }}
    >
      <ContextMenuPrimitive.SubmenuTrigger
        style={(state) => [
          styles.subTrigger,
          (state.highlighted || state.open) && {
            backgroundColor: colors.accent,
          },
          state.open && { marginBottom: 4 },
          state.disabled && styles.disabled,
          inset && styles.inset,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      >
        {children}
        <Icon
          as={open ? CaretUpIcon : CaretDownIcon}
          size={16}
          color={colors.foreground}
          style={[styles.subTriggerIcon, iconStyle]}
        />
      </ContextMenuPrimitive.SubmenuTrigger>
    </TextStyleContext.Provider>
  )
}

function ContextMenuSubContent({
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Popup>) {
  const { colors } = useTheme()
  return (
    <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <ContextMenuPrimitive.Popup
        style={(state) => [
          styles.subContent,
          { borderColor: colors.outline, backgroundColor: colors.popover },
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
  return (
    <TextStyleContext.Provider
      value={{
        ...styles.itemText,
        color: destructive ? colors.destructive : colors.popoverForeground,
      }}
    >
      <ContextMenuPrimitive.Item
        style={(state) => [
          styles.item,
          state.highlighted && {
            backgroundColor: destructive
              ? colors.destructiveSubtle
              : colors.accent,
          },
          state.disabled && styles.disabled,
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
      value={{ ...styles.itemText, color: colors.popoverForeground }}
    >
      <ContextMenuPrimitive.CheckboxItem
        style={(state) => [
          styles.checkItem,
          state.highlighted && { backgroundColor: colors.accent },
          state.disabled && styles.disabled,
          inset && styles.inset,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      >
        <View style={styles.indicator}>
          <ContextMenuPrimitive.CheckboxItemIndicator>
            <Icon as={CheckIcon} size={16} color={colors.foreground} />
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
      value={{ ...styles.itemText, color: colors.popoverForeground }}
    >
      <ContextMenuPrimitive.RadioItem
        style={(state) => [
          styles.checkItem,
          state.highlighted && { backgroundColor: colors.accent },
          state.disabled && styles.disabled,
          inset && styles.inset,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      >
        <View style={styles.indicator}>
          <ContextMenuPrimitive.RadioItemIndicator>
            <Icon as={CheckIcon} size={16} color={colors.foreground} />
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
        { backgroundColor: colors.borderSubtle },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      style={[styles.shortcut, { color: colors.mutedForeground }, style]}
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
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}
