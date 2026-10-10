import { CaretDownIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as SelectPrimitive from "@/components/primitives/select"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

type Option = SelectPrimitive.Option

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

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
  overlay: { zIndex: 50 },
  content: {
    position: "relative",
    zIndex: 50,
    minWidth: 144,
    borderRadius: radius["3xl"],
    borderWidth: 1,
    ...shadow.lg,
  },
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
  ref,
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  const { value } = SelectPrimitive.useRootContext()
  const { colors } = useTheme()
  return (
    <SelectPrimitive.Value
      ref={ref}
      numberOfLines={1}
      style={[
        styles.value,
        { color: value ? colors.foreground : colors.mutedForeground },
        style,
      ]}
      {...props}
    />
  )
}

function SelectTrigger({
  ref,
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
      ref={ref}
      style={(state) => [
        styles.trigger,
        { backgroundColor: colors.inputSoft },
        props.disabled && styles.disabled,
        size === "sm" && styles.triggerSm,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {children}
      <Icon
        as={CaretDownIcon}
        aria-hidden={true}
        size={16}
        color={colors.mutedForeground}
      />
    </SelectPrimitive.Trigger>
  )
}

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function SelectContent({
  style,
  children,
  position = "popper",
  portalHost,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  portalHost?: string
}) {
  const { colors } = useTheme()
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <SelectPrimitive.Overlay style={StyleSheet.absoluteFill} asChild>
          <AnimatedView
            style={styles.overlay}
            entering={FadeIn.reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.reduceMotion(ReduceMotion.System)}
            as="Pressable"
          >
            <TextStyleContext.Provider
              value={{ ...fontSize.sm, color: colors.popoverForeground }}
            >
              <SelectPrimitive.Content
                style={StyleSheet.flatten<ViewStyle>([
                  styles.content,
                  {
                    borderColor: colors.outline,
                    backgroundColor: colors.popover,
                  },
                  style as StyleProp<ViewStyle>,
                ])}
                position={position}
                {...props}
              >
                <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
              </SelectPrimitive.Content>
            </TextStyleContext.Provider>
          </AnimatedView>
        </SelectPrimitive.Overlay>
      </FullWindowOverlay>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  const { colors } = useTheme()
  return (
    <SelectPrimitive.Label
      style={[styles.label, { color: colors.mutedForeground }, style]}
      {...props}
    />
  )
}

function SelectItem({
  style,
  ...props
}: Omit<React.ComponentProps<typeof SelectPrimitive.Item>, "children">) {
  const { colors } = useTheme()
  return (
    <SelectPrimitive.Item
      style={(state) => [
        styles.item,
        state.pressed && { backgroundColor: colors.accent },
        props.disabled && styles.disabled,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <View style={styles.indicator}>
        <SelectPrimitive.ItemIndicator>
          <Icon
            as={CheckIcon}
            size={16}
            color={colors.foreground}
            style={styles.indicatorIcon}
          />
        </SelectPrimitive.ItemIndicator>
      </View>
      <SelectPrimitive.ItemText
        style={[styles.itemText, { color: colors.foreground }]}
      />
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
      style={[styles.separator, { backgroundColor: colors.border }, style]}
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
