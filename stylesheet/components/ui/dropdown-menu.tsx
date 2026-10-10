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
import * as MenuPrimitive from "@/components/primitives/menu"
import { resolveStyle } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const DropdownMenu = MenuPrimitive.Root

const DropdownMenuPortal = MenuPrimitive.Portal

const DropdownMenuTrigger = MenuPrimitive.Trigger

const DropdownMenuGroup = MenuPrimitive.Group

const DropdownMenuSub = MenuPrimitive.SubmenuRoot

const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup

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

type PositionerProps = React.ComponentProps<typeof MenuPrimitive.Positioner>

function DropdownMenuContent({
  style,
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  portalHost,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Popup> &
  Pick<PositionerProps, "align" | "alignOffset" | "side" | "sideOffset"> & {
    portalHost?: string
  }) {
  const { colors } = useTheme()
  return (
    <MenuPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <MenuPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
        >
          <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
            <TextStyleContext.Provider
              value={{ ...fontSize.sm, color: colors.popoverForeground }}
            >
              <MenuPrimitive.Popup
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
        </MenuPrimitive.Positioner>
      </FullWindowOverlay>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuSubTrigger({
  style,
  inset,
  children,
  iconStyle,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.SubmenuTrigger> & {
  children?: React.ReactNode
  iconStyle?: PhosphorIconProps["style"]
  inset?: boolean
}) {
  const { open } = MenuPrimitive.useMenuRootContext().floating
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{
        ...styles.itemText,
        color: open ? colors.accentForeground : colors.popoverForeground,
      }}
    >
      <MenuPrimitive.SubmenuTrigger
        style={(state) => [
          styles.subTrigger,
          (state.highlighted || state.open) && {
            backgroundColor: colors.accent,
          },
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
      </MenuPrimitive.SubmenuTrigger>
    </TextStyleContext.Provider>
  )
}

function DropdownMenuSubContent({
  style,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Popup>) {
  const { colors } = useTheme()
  return (
    <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <MenuPrimitive.Popup
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

function DropdownMenuItem({
  style,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item> & {
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
      <MenuPrimitive.Item
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

function DropdownMenuCheckboxItem({
  style,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem> & {
  children?: React.ReactNode
  inset?: boolean
}) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...styles.itemText, color: colors.popoverForeground }}
    >
      <MenuPrimitive.CheckboxItem
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
          <MenuPrimitive.CheckboxItemIndicator>
            <Icon as={CheckIcon} size={16} color={colors.foreground} />
          </MenuPrimitive.CheckboxItemIndicator>
        </View>
        {children}
      </MenuPrimitive.CheckboxItem>
    </TextStyleContext.Provider>
  )
}

function DropdownMenuRadioItem({
  style,
  children,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem> & {
  children?: React.ReactNode
  inset?: boolean
}) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...styles.itemText, color: colors.popoverForeground }}
    >
      <MenuPrimitive.RadioItem
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
          <MenuPrimitive.RadioItemIndicator>
            <Icon as={CheckIcon} size={16} color={colors.foreground} />
          </MenuPrimitive.RadioItemIndicator>
        </View>
        {children}
      </MenuPrimitive.RadioItem>
    </TextStyleContext.Provider>
  )
}

function DropdownMenuLabel({
  style,
  inset,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.GroupLabel> & {
  inset?: boolean
}) {
  const { colors } = useTheme()
  return (
    <MenuPrimitive.GroupLabel
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

function DropdownMenuSeparator({
  style,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  const { colors } = useTheme()
  return (
    <MenuPrimitive.Separator
      style={(state) => [
        styles.separator,
        { backgroundColor: colors.borderSubtle },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
