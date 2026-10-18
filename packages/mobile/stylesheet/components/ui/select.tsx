import { CaretUpDownIcon, CheckIcon } from "phosphor-react-native"
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
import { useFieldRootContext } from "@/components/primitives/field"
import { useOptionalPositionerContext } from "@/components/primitives/positioner"
import * as SelectPrimitive from "@/components/primitives/select"
import { resolveStyle } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, metrics, radius, useTheme } from "@/components/ui/theme"

interface Option {
  value: string
  label: string
}

const Select = SelectPrimitive.Root

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  group: { padding: metrics.padding.menu },
  value: { flex: 1, textAlign: "left", ...fontSize.base },
  trigger: {
    height: metrics.height.input,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "flex-start",
    gap: 6,
    borderRadius: metrics.radius.input,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: metrics.paddingX.input,
    paddingVertical: 8,
  },
  triggerSm: { height: 36, borderRadius: radius.md },
  content: {
    position: "relative",
    minWidth: 144,
    overflow: "hidden",
    borderRadius: metrics.radius.menu,
    borderWidth: 1,
    ...metrics.shadow.menu,
  },
  list: { position: "relative", width: "100%" },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...fontSize.xs,
    fontWeight: "600",
  },
  item: {
    position: "relative",
    width: "100%",
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
  indicatorIcon: { flexShrink: 0 },
  itemText: { flex: 1, ...fontSize.base, userSelect: "none" },
  separator: { marginVertical: 6, height: 1 },
})

function SelectGroup({
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      style={(state) => [
        styles.group,
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

function SelectValue({
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  const { colors } = useTheme()
  return (
    <SelectPrimitive.Value
      numberOfLines={1}
      style={(state) => {
        const color = state.placeholder
          ? colors.mutedForeground
          : colors.foreground
        return [
          styles.value,
          { color },
          resolveStyle(style, state) as StyleProp<TextStyle>,
        ]
      }}
      {...props}
    />
  )
}

function SelectTrigger({
  style,
  children,
  size = "default",
  invalid,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  children?: React.ReactNode
  size?: "default" | "sm"
  invalid?: boolean
}) {
  const { colors, isDark } = useTheme()
  const field = useFieldRootContext()
  const isInvalid = invalid ?? field.state.invalid
  return (
    <SelectPrimitive.Trigger
      style={(state) => [
        styles.trigger,
        { backgroundColor: colors.secondary },
        size === "sm" && styles.triggerSm,
        isInvalid && {
          borderColor: colors.destructive,
          backgroundColor: `${colors.destructive}${isDark ? "1a" : "0d"}`,
        },
        state.disabled && { opacity: 0.5 },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <Icon as={CaretUpDownIcon} size={16} color={colors.mutedForeground} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

type PositionerProps = React.ComponentProps<typeof SelectPrimitive.Positioner>

function ContentPopup({
  style,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Popup>) {
  const { colors, isDark } = useTheme()
  const positioner = useOptionalPositionerContext()
  const width = positioner?.anchorWidth || undefined
  return (
    <SelectPrimitive.Popup
      style={(state) => [
        styles.content,
        {
          width,
          borderColor: `${colors.menuForeground}${isDark ? "1a" : "0d"}`,
          backgroundColor: colors.menu,
        },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      <SelectPrimitive.List style={styles.list}>
        {children}
      </SelectPrimitive.List>
    </SelectPrimitive.Popup>
  )
}

function SelectContent({
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
              value={{ ...fontSize.base, color: colors.menuForeground }}
            >
              <ContentPopup {...props} />
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
        { color: colors.menuMutedForeground },
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
        state.highlighted && { opacity: 0.8 },
        state.disabled && { opacity: 0.5 },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      <SelectPrimitive.ItemText
        style={[styles.itemText, { color: colors.menuForeground }]}
      >
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator style={styles.indicator}>
        <Icon
          as={CheckIcon}
          size={16}
          color={colors.primary}
          style={styles.indicatorIcon}
        />
      </SelectPrimitive.ItemIndicator>
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
        { backgroundColor: colors.menuBorder },
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
