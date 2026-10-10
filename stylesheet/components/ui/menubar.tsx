import * as MenubarPrimitive from "@rn-primitives/menubar"
import { Portal } from "@rn-primitives/portal"
import type { IconProps as PhosphorIconProps } from "phosphor-react-native"
import { CaretDownIcon, CaretUpIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  Pressable,
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

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  root: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius["3xl"],
    borderWidth: 1,
    padding: 4,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius["2xl"],
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
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
    minWidth: 128,
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
  label: { paddingHorizontal: 14, paddingVertical: 10, ...fontSize.xs },
  inset: { paddingLeft: 38 },
  disabled: { opacity: 0.5 },
  separator: { marginHorizontal: -4, marginVertical: 4, height: 1 },
  shortcut: { marginLeft: "auto", ...fontSize.xs, letterSpacing: 1.2 },
})

type MenubarProps = Omit<
  React.ComponentProps<typeof MenubarPrimitive.Root>,
  "value" | "onValueChange"
> & {
  value?: string
  onValueChange?: (value: string | undefined) => void
}

function Menubar({
  style,
  value: valueProp,
  onValueChange: onValueChangeProp,
  ...props
}: MenubarProps) {
  const id = React.useId()
  const { colors } = useTheme()
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | undefined
  >(undefined)
  const isControlled = onValueChangeProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue
  const onValueChange = onValueChangeProp ?? setUncontrolledValue

  return (
    <>
      {value ? (
        <Portal name={`menubar-overlay-${id}`}>
          <Pressable
            onPress={() => onValueChange(undefined)}
            style={StyleSheet.absoluteFill}
          />
        </Portal>
      ) : null}
      <MenubarPrimitive.Root
        style={[styles.root, { borderColor: colors.border }, style]}
        value={value}
        onValueChange={onValueChange}
        {...props}
      />
    </>
  )
}

function MenubarTrigger({
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  const { value } = MenubarPrimitive.useRootContext()
  const { value: itemValue } = MenubarPrimitive.useMenuContext()
  const { colors } = useTheme()

  return (
    <TextStyleContext.Provider
      value={{ ...styles.itemText, color: colors.foreground }}
    >
      <MenubarPrimitive.Trigger
        style={(state) => [
          styles.trigger,
          (state.pressed || value === itemValue) && {
            backgroundColor: colors.muted,
          },
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      />
    </TextStyleContext.Provider>
  )
}

function MenubarSubTrigger({
  style,
  inset,
  children,
  iconStyle,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  children?: React.ReactNode
  iconStyle?: PhosphorIconProps["style"]
  inset?: boolean
}) {
  const { open } = MenubarPrimitive.useSubContext()
  const { colors } = useTheme()
  const icon = open ? CaretUpIcon : CaretDownIcon
  return (
    <TextStyleContext.Provider
      value={{
        ...styles.itemText,
        color: open ? colors.accentForeground : colors.popoverForeground,
      }}
    >
      <MenubarPrimitive.SubTrigger
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
      </MenubarPrimitive.SubTrigger>
    </TextStyleContext.Provider>
  )
}

function MenubarSubContent({
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  const { colors } = useTheme()
  return (
    <AnimatedView entering={FadeIn.reduceMotion(ReduceMotion.System)}>
      <MenubarPrimitive.SubContent
        style={[
          styles.subContent,
          { borderColor: colors.outline, backgroundColor: colors.popover },
          style,
        ]}
        {...props}
      />
    </AnimatedView>
  )
}

function MenubarContent({
  style,
  overlayStyle,
  portalHost,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content> & {
  overlayStyle?: StyleProp<ViewStyle>
  portalHost?: string
}) {
  const { colors } = useTheme()
  return (
    <MenubarPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <AnimatedView
          as="Pressable"
          accessible={false}
          entering={FadeIn.reduceMotion(ReduceMotion.System)}
          style={StyleSheet.absoluteFill}
          pointerEvents="box-none"
        >
          <TextStyleContext.Provider
            value={{ ...fontSize.sm, color: colors.popoverForeground }}
          >
            <MenubarPrimitive.Content
              style={StyleSheet.flatten<ViewStyle>([
                styles.content,
                {
                  borderColor: colors.outline,
                  backgroundColor: colors.popover,
                },
                style as StyleProp<ViewStyle>,
              ])}
              align={align}
              alignOffset={alignOffset}
              sideOffset={sideOffset}
              {...props}
            />
          </TextStyleContext.Provider>
        </AnimatedView>
      </FullWindowOverlay>
    </MenubarPrimitive.Portal>
  )
}

function MenubarItem({
  style,
  inset,
  variant,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
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
      <MenubarPrimitive.Item
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

function MenubarCheckboxItem({
  style,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...styles.itemText, color: colors.popoverForeground }}
    >
      <MenubarPrimitive.CheckboxItem
        style={(state) => [
          styles.checkItem,
          state.pressed && { backgroundColor: colors.accent },
          props.disabled && styles.disabled,
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      >
        <View style={styles.indicator}>
          <MenubarPrimitive.ItemIndicator>
            <Icon as={CheckIcon} size={16} color={colors.foreground} />
          </MenubarPrimitive.ItemIndicator>
        </View>
        {children}
      </MenubarPrimitive.CheckboxItem>
    </TextStyleContext.Provider>
  )
}

function MenubarRadioItem({
  style,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider
      value={{ ...styles.itemText, color: colors.popoverForeground }}
    >
      <MenubarPrimitive.RadioItem
        style={(state) => [
          styles.checkItem,
          state.pressed && { backgroundColor: colors.accent },
          props.disabled && styles.disabled,
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      >
        <View style={styles.indicator}>
          <MenubarPrimitive.ItemIndicator>
            <Icon as={CheckIcon} size={16} color={colors.foreground} />
          </MenubarPrimitive.ItemIndicator>
        </View>
        {children}
      </MenubarPrimitive.RadioItem>
    </TextStyleContext.Provider>
  )
}

function MenubarLabel({
  style,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  const { colors } = useTheme()
  return (
    <MenubarPrimitive.Label
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

function MenubarSeparator({
  style,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  const { colors } = useTheme()
  return (
    <MenubarPrimitive.Separator
      style={[
        styles.separator,
        { backgroundColor: colors.borderSubtle },
        style,
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
      style={[styles.shortcut, { color: colors.mutedForeground }, style]}
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
