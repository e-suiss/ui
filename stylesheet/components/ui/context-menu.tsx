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
import * as ContextMenuPrimitive from "@/components/primitives/context-menu"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

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

function ContextMenuSubTrigger({
  style,
  inset,
  children,
  iconStyle,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  children?: React.ReactNode
  iconStyle?: PhosphorIconProps["style"]
  inset?: boolean
}) {
  const { open } = ContextMenuPrimitive.useSubContext()
  const { colors } = useTheme()
  const icon = open ? CaretUpIcon : CaretDownIcon
  return (
    <TextStyleContext.Provider
      value={{
        ...styles.itemText,
        color: open ? colors.accentForeground : colors.popoverForeground,
      }}
    >
      <ContextMenuPrimitive.SubTrigger
        style={(state) => [
          styles.subTrigger,
          state.pressed && { backgroundColor: colors.accent },
          typeof style === "function" ? style(state) : style,
          open && { backgroundColor: colors.accent, marginBottom: 4 },
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
      </ContextMenuPrimitive.SubTrigger>
    </TextStyleContext.Provider>
  )
}

function ContextMenuSubContent({
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  const { colors } = useTheme()
  return (
    <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <ContextMenuPrimitive.SubContent
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

function ContextMenuContent({
  style,
  overlayStyle,
  portalHost,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content> & {
  overlayStyle?: StyleProp<ViewStyle>
  portalHost?: string
}) {
  const { colors } = useTheme()
  return (
    <ContextMenuPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <ContextMenuPrimitive.Overlay
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
              <ContextMenuPrimitive.Content
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
        </ContextMenuPrimitive.Overlay>
      </FullWindowOverlay>
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuItem({
  style,
  inset,
  variant,
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

function ContextMenuCheckboxItem({
  style,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...styles.itemText, color: colors.popoverForeground }}
    >
      <ContextMenuPrimitive.CheckboxItem
        style={(state) => [
          styles.checkItem,
          state.pressed && { backgroundColor: colors.accent },
          props.disabled && styles.disabled,
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      >
        <View style={styles.indicator}>
          <ContextMenuPrimitive.ItemIndicator>
            <Icon as={CheckIcon} size={16} color={colors.foreground} />
          </ContextMenuPrimitive.ItemIndicator>
        </View>
        {children}
      </ContextMenuPrimitive.CheckboxItem>
    </TextStyleContext.Provider>
  )
}

function ContextMenuRadioItem({
  style,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...styles.itemText, color: colors.popoverForeground }}
    >
      <ContextMenuPrimitive.RadioItem
        style={(state) => [
          styles.checkItem,
          state.pressed && { backgroundColor: colors.accent },
          props.disabled && styles.disabled,
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      >
        <View style={styles.indicator}>
          <ContextMenuPrimitive.ItemIndicator>
            <Icon as={CheckIcon} size={16} color={colors.foreground} />
          </ContextMenuPrimitive.ItemIndicator>
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
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}) {
  const { colors } = useTheme()
  return (
    <ContextMenuPrimitive.Label
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

function ContextMenuSeparator({
  style,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  const { colors } = useTheme()
  return (
    <ContextMenuPrimitive.Separator
      style={[
        styles.separator,
        { backgroundColor: colors.borderSubtle },
        style,
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
