import type { IconProps as PhosphorIconProps } from "phosphor-react-native"
import { CaretRightIcon, CheckIcon } from "phosphor-react-native"
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
import { Menubar as MenubarPrimitive } from "@/components/primitives/menubar"
import { resolveStyle } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const MenubarMenu = MenuPrimitive.Root

const MenubarPortal = MenuPrimitive.Portal

const MenubarGroup = MenuPrimitive.Group

const MenubarSub = MenuPrimitive.SubmenuRoot

const MenubarRadioGroup = MenuPrimitive.RadioGroup

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  root: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 4,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  triggerText: { ...fontSize.sm, userSelect: "none" },
  itemText: { ...fontSize.base, userSelect: "none" },
  subTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  subTriggerIcon: { marginLeft: "auto", flexShrink: 0 },
  subTriggerIconOpen: { transform: [{ rotate: "90deg" }] },
  subContent: {
    minWidth: 128,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: 6,
    ...shadow.lg,
  },
  content: {
    minWidth: 192,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: 6,
    ...shadow.lg,
  },
  item: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  checkItem: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: radius.md,
    paddingVertical: 8,
    paddingRight: 12,
    paddingLeft: 38,
  },
  indicator: {
    position: "absolute",
    left: 12,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...fontSize.xs,
    fontWeight: "600",
  },
  inset: { paddingLeft: 38 },
  separator: {
    marginHorizontal: -4,
    marginVertical: 4,
    height: 1,
    opacity: 0.5,
  },
  shortcut: { marginLeft: "auto", ...fontSize.xs },
})

function usePopupColors() {
  const { colors, isDark } = useTheme()
  return {
    borderColor: `${colors.label}${isDark ? "1a" : "0d"}`,
    backgroundColor: colors.surfaceRaised,
  }
}

function Menubar({
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive>) {
  const { colors } = useTheme()
  return (
    <MenubarPrimitive
      style={(state) => [
        styles.root,
        { borderColor: colors.separator },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

function MenubarTrigger({
  style,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  const { colors } = useTheme()
  const [pressed, setPressed] = React.useState(false)
  return (
    <TextStyleContext.Provider
      value={{
        ...styles.triggerText,
        color: props.disabled ? colors.labelQuaternary : colors.label,
      }}
    >
      <MenuPrimitive.Trigger
        onPressIn={(event) => {
          setPressed(true)
          onPressIn?.(event)
        }}
        onPressOut={(event) => {
          setPressed(false)
          onPressOut?.(event)
        }}
        style={(state) => [
          styles.trigger,
          state.open && { backgroundColor: colors.itemSelected },
          pressed && { backgroundColor: colors.itemPressed },
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

type PositionerProps = React.ComponentProps<typeof MenuPrimitive.Positioner>

function MenubarContent({
  style,
  align = "start",
  alignOffset = -4,
  side = "bottom",
  sideOffset = 8,
  portalHost,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Popup> &
  Pick<PositionerProps, "align" | "alignOffset" | "side" | "sideOffset"> & {
    portalHost?: string
  }) {
  const { colors } = useTheme()
  const popupColors = usePopupColors()
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
              value={{ ...fontSize.base, color: colors.label }}
            >
              <MenuPrimitive.Popup
                style={(state) => [
                  styles.content,
                  popupColors,
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

function MenubarSubTrigger({
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
        color: props.disabled ? colors.labelQuaternary : colors.label,
      }}
    >
      <MenuPrimitive.SubmenuTrigger
        style={(state) => [
          styles.subTrigger,
          state.open && { backgroundColor: colors.itemSelected },
          state.highlighted && { backgroundColor: colors.itemPressed },
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
      </MenuPrimitive.SubmenuTrigger>
    </TextStyleContext.Provider>
  )
}

function MenubarSubContent({
  style,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Popup>) {
  const popupColors = usePopupColors()
  return (
    <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <MenuPrimitive.Popup
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

function MenubarItem({
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
        color: props.disabled
          ? colors.labelQuaternary
          : destructive
            ? colors.danger
            : colors.label,
      }}
    >
      <MenuPrimitive.Item
        style={(state) => [
          styles.item,
          state.highlighted && {
            backgroundColor: destructive
              ? colors.dangerSurfacePressed
              : colors.itemPressed,
          },
          inset && styles.inset,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

function MenubarCheckboxItem({
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
      value={{
        ...styles.itemText,
        color: props.disabled ? colors.labelQuaternary : colors.label,
      }}
    >
      <MenuPrimitive.CheckboxItem
        style={(state) => [
          styles.checkItem,
          state.highlighted && { backgroundColor: colors.itemPressed },
          inset && styles.inset,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      >
        <View style={styles.indicator}>
          <MenuPrimitive.CheckboxItemIndicator>
            <Icon as={CheckIcon} size={16} />
          </MenuPrimitive.CheckboxItemIndicator>
        </View>
        {children}
      </MenuPrimitive.CheckboxItem>
    </TextStyleContext.Provider>
  )
}

function MenubarRadioItem({
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
      value={{
        ...styles.itemText,
        color: props.disabled ? colors.labelQuaternary : colors.label,
      }}
    >
      <MenuPrimitive.RadioItem
        style={(state) => [
          styles.checkItem,
          state.highlighted && { backgroundColor: colors.itemPressed },
          inset && styles.inset,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      >
        <View style={styles.indicator}>
          <MenuPrimitive.RadioItemIndicator>
            <Icon as={CheckIcon} size={16} />
          </MenuPrimitive.RadioItemIndicator>
        </View>
        {children}
      </MenuPrimitive.RadioItem>
    </TextStyleContext.Provider>
  )
}

function MenubarLabel({
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
        { color: colors.labelSecondary },
        inset && styles.inset,
        resolveStyle(style, state) as StyleProp<TextStyle>,
      ]}
      {...props}
    />
  )
}

function MenubarSeparator({
  style,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  const { colors } = useTheme()
  return (
    <MenuPrimitive.Separator
      style={(state) => [
        styles.separator,
        { backgroundColor: colors.separator },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

function MenubarShortcut({
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      style={[styles.shortcut, { color: colors.labelSecondary }, style]}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
}
