import * as DropdownMenuPrimitive from "@rn-primitives/dropdown-menu"
import type { IconProps as PhosphorIconProps } from "phosphor-react-native"
import { CaretDownIcon, CaretUpIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native"
import { FadeIn, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

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

function DropdownMenuSubTrigger({
  style,
  inset,
  children,
  iconStyle,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  children?: React.ReactNode
  iconStyle?: PhosphorIconProps["style"]
  inset?: boolean
}) {
  const { open } = DropdownMenuPrimitive.useSubContext()
  const { colors } = useTheme()
  const icon = open ? CaretUpIcon : CaretDownIcon
  return (
    <TextStyleContext.Provider
      value={{
        ...styles.itemText,
        color: open ? colors.accentForeground : colors.popoverForeground,
      }}
    >
      <DropdownMenuPrimitive.SubTrigger
        style={(state) => [
          styles.subTrigger,
          state.pressed && { backgroundColor: colors.accent },
          typeof style === "function" ? style(state) : style,
          open && { backgroundColor: colors.accent },
          inset && styles.inset,
        ]}
        {...props}
      >
        {children}
        <Icon
          as={icon}
          size={16}
          color={colors.foreground}
          style={[styles.subTriggerIcon, iconStyle]}
        />
      </DropdownMenuPrimitive.SubTrigger>
    </TextStyleContext.Provider>
  )
}

function DropdownMenuSubContent({
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  const { colors } = useTheme()
  return (
    <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <DropdownMenuPrimitive.SubContent
        style={(state) => [
          styles.subContent,
          { borderColor: colors.outline, backgroundColor: colors.popover },
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      />
    </AnimatedView>
  )
}

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function DropdownMenuContent({
  style,
  overlayStyle,
  portalHost,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  overlayStyle?: StyleProp<ViewStyle>
  portalHost?: string
}) {
  const { colors } = useTheme()
  return (
    <DropdownMenuPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <DropdownMenuPrimitive.Overlay
          style={
            overlayStyle
              ? StyleSheet.flatten([
                  StyleSheet.absoluteFill,
                  overlayStyle as typeof StyleSheet.absoluteFill,
                ])
              : StyleSheet.absoluteFill
          }
          asChild
        >
          <AnimatedView
            entering={FadeIn.reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <TextStyleContext.Provider
              value={{ ...fontSize.sm, color: colors.popoverForeground }}
            >
              <DropdownMenuPrimitive.Content
                style={StyleSheet.flatten<ViewStyle>([
                  styles.content,
                  {
                    borderColor: colors.outline,
                    backgroundColor: colors.popover,
                  },
                  style as StyleProp<ViewStyle>,
                ])}
                {...props}
              />
            </TextStyleContext.Provider>
          </AnimatedView>
        </DropdownMenuPrimitive.Overlay>
      </FullWindowOverlay>
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuItem({
  style,
  inset,
  variant,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
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
      <DropdownMenuPrimitive.Item
        style={(state) => [
          styles.item,
          state.pressed && {
            backgroundColor: destructive
              ? colors.destructiveSubtle
              : colors.accent,
          },
          props.disabled && styles.disabled,
          inset && styles.inset,
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

function DropdownMenuCheckboxItem({
  style,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...styles.itemText, color: colors.popoverForeground }}
    >
      <DropdownMenuPrimitive.CheckboxItem
        style={(state) => [
          styles.checkItem,
          state.pressed && { backgroundColor: colors.accent },
          props.disabled && styles.disabled,
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      >
        <View style={styles.indicator}>
          <DropdownMenuPrimitive.ItemIndicator>
            <Icon as={CheckIcon} size={16} color={colors.foreground} />
          </DropdownMenuPrimitive.ItemIndicator>
        </View>
        {children}
      </DropdownMenuPrimitive.CheckboxItem>
    </TextStyleContext.Provider>
  )
}

function DropdownMenuRadioItem({
  style,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...styles.itemText, color: colors.popoverForeground }}
    >
      <DropdownMenuPrimitive.RadioItem
        style={(state) => [
          styles.checkItem,
          state.pressed && { backgroundColor: colors.accent },
          props.disabled && styles.disabled,
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      >
        <View style={styles.indicator}>
          <DropdownMenuPrimitive.ItemIndicator>
            <Icon as={CheckIcon} size={16} color={colors.foreground} />
          </DropdownMenuPrimitive.ItemIndicator>
        </View>
        {children}
      </DropdownMenuPrimitive.RadioItem>
    </TextStyleContext.Provider>
  )
}

function DropdownMenuLabel({
  style,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  const { colors } = useTheme()
  return (
    <DropdownMenuPrimitive.Label
      style={[
        styles.label,
        { color: colors.mutedForeground },
        inset && styles.inset,
        style,
      ]}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  style,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  const { colors } = useTheme()
  return (
    <DropdownMenuPrimitive.Separator
      style={[
        styles.separator,
        { backgroundColor: colors.borderSubtle },
        style,
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
