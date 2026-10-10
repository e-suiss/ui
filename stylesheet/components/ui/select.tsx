import { CaretDownIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as SelectPrimitive from "@/components/primitives/select"
import { resolveStyle } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

interface Option {
  value: string
  label: string
}

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  value: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    ...fontSize.sm,
  },
  trigger: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    borderRadius: radius["3xl"],
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  triggerSm: { height: 32 },
  disabled: { opacity: 0.5 },
  content: {
    position: "relative",
    minWidth: 144,
    borderRadius: radius["3xl"],
    borderWidth: 1,
    ...shadow.lg,
  },
  list: { width: "100%", padding: 6 },
  label: { paddingHorizontal: 12, paddingVertical: 10, ...fontSize.xs },
  item: {
    position: "relative",
    width: "100%",
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
  indicatorIcon: { flexShrink: 0 },
  itemText: { ...fontSize.sm, fontWeight: "500", userSelect: "none" },
  separator: { marginHorizontal: -6, marginVertical: 6, height: 1 },
})

function SelectValue({
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  const { colors } = useTheme()
  return (
    <SelectPrimitive.Value
      numberOfLines={1}
      style={(state) => [
        styles.value,
        {
          color: state.placeholder ? colors.mutedForeground : colors.foreground,
        },
        resolveStyle(style, state) as StyleProp<TextStyle>,
      ]}
      {...props}
    />
  )
}

function SelectTrigger({
  style,
  children,
  size = "default",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  children?: React.ReactNode
  size?: "default" | "sm"
}) {
  const { colors } = useTheme()
  return (
    <SelectPrimitive.Trigger
      style={(state) => [
        styles.trigger,
        { backgroundColor: colors.inputSoft },
        state.disabled && styles.disabled,
        size === "sm" && styles.triggerSm,
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <Icon as={CaretDownIcon} size={16} color={colors.mutedForeground} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

type PositionerProps = React.ComponentProps<typeof SelectPrimitive.Positioner>

function SelectContent({
  style,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  portalHost,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Popup> &
  Pick<PositionerProps, "align" | "alignOffset" | "side" | "sideOffset"> & {
    portalHost?: string
  }) {
  const { colors } = useTheme()
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <SelectPrimitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
        >
          <AnimatedView
            entering={FadeIn.reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.reduceMotion(ReduceMotion.System)}
          >
            <TextStyleContext.Provider
              value={{ ...fontSize.sm, color: colors.popoverForeground }}
            >
              <SelectPrimitive.Popup
                style={(state) => [
                  styles.content,
                  {
                    borderColor: colors.outline,
                    backgroundColor: colors.popover,
                  },
                  resolveStyle(style, state) as StyleProp<ViewStyle>,
                ]}
                {...props}
              >
                <SelectPrimitive.List style={styles.list}>
                  {children}
                </SelectPrimitive.List>
              </SelectPrimitive.Popup>
            </TextStyleContext.Provider>
          </AnimatedView>
        </SelectPrimitive.Positioner>
      </FullWindowOverlay>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.GroupLabel>) {
  const { colors } = useTheme()
  return (
    <SelectPrimitive.GroupLabel
      style={(state) => [
        styles.label,
        { color: colors.mutedForeground },
        resolveStyle(style, state) as StyleProp<TextStyle>,
      ]}
      {...props}
    />
  )
}

function SelectItem({
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof SelectPrimitive.Item>, "children"> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <SelectPrimitive.Item
      style={(state) => [
        styles.item,
        state.highlighted && { backgroundColor: colors.accent },
        state.disabled && styles.disabled,
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      <SelectPrimitive.ItemIndicator style={styles.indicator}>
        <Icon
          as={CheckIcon}
          size={16}
          color={colors.foreground}
          style={styles.indicatorIcon}
        />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText
        style={[styles.itemText, { color: colors.foreground }]}
      >
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  const { colors } = useTheme()
  return (
    <SelectPrimitive.Separator
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
  type Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
