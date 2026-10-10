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
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

interface Option {
  value: string
  label: string
}

const Select = SelectPrimitive.Root

const SelectTriggerContext = React.createContext({ disabled: false })

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  group: { padding: 6 },
  value: { flex: 1, textAlign: "left", ...fontSize.base },
  trigger: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "flex-start",
    gap: 6,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  triggerSm: { height: 36, borderRadius: radius.md },
  content: {
    position: "relative",
    minWidth: 144,
    overflow: "hidden",
    borderRadius: radius.xl,
    borderWidth: 1,
    ...shadow.lg,
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
    borderRadius: radius.md,
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
  const { disabled } = React.useContext(SelectTriggerContext)
  return (
    <SelectPrimitive.Value
      numberOfLines={1}
      style={(state) => [
        styles.value,
        {
          color: disabled
            ? colors.labelQuaternary
            : state.placeholder
              ? colors.labelSecondary
              : colors.label,
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
  invalid,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  children?: React.ReactNode
  size?: "default" | "sm"
  invalid?: boolean
}) {
  const { colors, isDark } = useTheme()
  const field = useFieldRootContext()
  const select = SelectPrimitive.useSelectRootContext("SelectTrigger")
  const isInvalid = invalid ?? field.state.invalid
  const disabled = !!props.disabled || select.floating.disabled
  const context = React.useMemo(() => ({ disabled }), [disabled])
  return (
    <SelectPrimitive.Trigger
      style={(state) => [
        styles.trigger,
        { backgroundColor: colors.control },
        size === "sm" && styles.triggerSm,
        isInvalid && {
          borderColor: colors.danger,
          backgroundColor: `${colors.danger}${isDark ? "1a" : "0d"}`,
        },
        state.disabled && { backgroundColor: colors.controlDisabled },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      <SelectTriggerContext.Provider value={context}>
        {children}
      </SelectTriggerContext.Provider>
      <SelectPrimitive.Icon>
        <Icon as={CaretUpDownIcon} size={16} color={colors.labelSecondary} />
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
          borderColor: `${colors.label}${isDark ? "1a" : "0d"}`,
          backgroundColor: colors.surfaceRaised,
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
              value={{ ...fontSize.base, color: colors.label }}
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
        { color: colors.labelSecondary },
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
        state.highlighted && { backgroundColor: colors.itemPressed },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      <SelectPrimitive.ItemText
        style={(state) => [
          styles.itemText,
          { color: state.disabled ? colors.labelQuaternary : colors.label },
        ]}
      >
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator style={styles.indicator}>
        <Icon
          as={CheckIcon}
          size={16}
          color={colors.link}
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
        { backgroundColor: colors.separator },
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
