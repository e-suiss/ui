import { CaretDownIcon, CheckIcon, XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type View,
  type ViewStyle,
} from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as ComboboxPrimitive from "@/components/primitives/combobox"
import { useFieldRootContext } from "@/components/primitives/field"
import { useOptionalPositionerContext } from "@/components/primitives/positioner"
import { resolveStyle } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const Combobox = ComboboxPrimitive.Root

const ComboboxValue = ComboboxPrimitive.Value

const ComboboxCollection = ComboboxPrimitive.Collection

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const styles = StyleSheet.create({
  iconButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  inputGroup: {
    height: 44,
    width: "100%",
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "transparent",
    paddingRight: 8,
  },
  inputGroupInPopup: {
    width: "auto",
    height: 32,
    margin: 6,
    marginBottom: 0,
  },
  input: {
    height: "100%",
    minWidth: 0,
    flex: 1,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 4,
    fontSize: fontSize.base.fontSize,
  },
  content: {
    position: "relative",
    overflow: "hidden",
    borderRadius: radius.xl,
    borderWidth: 1,
    ...shadow.lg,
  },
  list: { maxHeight: 288 },
  listContent: { padding: 6 },
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
  itemText: { flex: 1, ...fontSize.base, userSelect: "none" },
  indicator: {
    position: "absolute",
    right: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...fontSize.xs,
    fontWeight: "600",
  },
  empty: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  emptyText: { ...fontSize.sm, textAlign: "center" },
  separator: { marginHorizontal: -6, marginVertical: 6, height: 1 },
  chips: {
    minHeight: 44,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipsFilled: { paddingHorizontal: 6 },
  chip: {
    height: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: radius.full,
    paddingHorizontal: 10,
  },
  chipRemovable: { paddingRight: 2 },
  chipText: { ...fontSize.xs },
  chipRemove: { marginLeft: -4, opacity: 0.5 },
  chipsInput: {
    height: 24,
    minWidth: 64,
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 0,
    fontSize: fontSize.base.fontSize,
  },
})

function wrapText(children: React.ReactNode, style: StyleProp<TextStyle>) {
  if (typeof children === "string" || typeof children === "number") {
    return <Text style={style}>{children}</Text>
  }
  return children
}

function ComboboxTrigger({
  style,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Trigger> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <ComboboxPrimitive.Trigger
      accessibilityLabel="Show options"
      style={(state) => [
        styles.iconButton,
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      {children}
      <Icon as={CaretDownIcon} size={16} color={colors.mutedForeground} />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({
  style,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Clear>) {
  const { colors } = useTheme()
  return (
    <ComboboxPrimitive.Clear
      accessibilityLabel="Clear"
      style={(state) => [
        styles.iconButton,
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      <Icon as={XIcon} size={16} color={colors.foreground} />
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxInput({
  style,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  invalid,
  onFocus,
  onBlur,
  ...props
}: Omit<React.ComponentProps<typeof ComboboxPrimitive.Input>, "style"> & {
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
  showTrigger?: boolean
  showClear?: boolean
  invalid?: boolean
}) {
  const { colors, isDark } = useTheme()
  const combobox = ComboboxPrimitive.useComboboxRootContext("ComboboxInput")
  const field = useFieldRootContext()
  const [focused, setFocused] = React.useState(false)
  const isDisabled = disabled || combobox.disabled
  const isInvalid = invalid ?? field.state.invalid
  const inPopup = useOptionalPositionerContext() !== null
  const clearVisible =
    showClear && (combobox.hasValue || combobox.inputValue !== "")
  return (
    <ComboboxPrimitive.InputGroup
      style={[
        styles.inputGroup,
        { backgroundColor: colors.secondary },
        isInvalid && {
          borderColor: colors.destructive,
          backgroundColor: `${colors.destructive}${isDark ? "1a" : "0d"}`,
        },
        focused && !inPopup && { borderColor: colors.ring },
        inPopup && [
          styles.inputGroupInPopup,
          { borderColor: `${colors.border}4d` },
        ],
        isDisabled && { opacity: 0.5 },
        style,
      ]}
    >
      <ComboboxPrimitive.Input
        disabled={disabled}
        style={[styles.input, { color: colors.foreground }]}
        placeholderTextColor={colors.mutedForeground}
        cursorColor={colors.primary}
        selectionColor={colors.primary}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        {...props}
      />
      {showTrigger && !clearVisible ? (
        <ComboboxTrigger disabled={disabled} />
      ) : null}
      {showClear ? <ComboboxClear disabled={disabled} /> : null}
      {children}
    </ComboboxPrimitive.InputGroup>
  )
}

type PositionerProps = React.ComponentProps<typeof ComboboxPrimitive.Positioner>

function ContentPopup({
  style,
  chips,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Popup> & { chips: boolean }) {
  const { colors, isDark } = useTheme()
  const positioner = useOptionalPositionerContext()
  const anchorWidth = positioner?.anchorWidth ?? 0
  const sizing: ViewStyle = {
    width: anchorWidth || undefined,
    minWidth: chips ? anchorWidth : anchorWidth + 28,
    maxWidth: positioner?.availableWidth,
    maxHeight: positioner?.availableHeight,
  }
  return (
    <ComboboxPrimitive.Popup
      style={(state) => [
        styles.content,
        {
          borderColor: `${colors.menuForeground}${isDark ? "1a" : "0d"}`,
          backgroundColor: colors.menu,
        },
        sizing,
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

function ComboboxContent({
  style,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  portalHost,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Popup> &
  Pick<
    PositionerProps,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  > & {
    portalHost?: string
  }) {
  const { colors } = useTheme()
  return (
    <ComboboxPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <ComboboxPrimitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          anchor={anchor}
        >
          <AnimatedView
            entering={FadeIn.reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.reduceMotion(ReduceMotion.System)}
          >
            <TextStyleContext.Provider
              value={{ ...fontSize.base, color: colors.menuForeground }}
            >
              <ContentPopup style={style} chips={!!anchor} {...props} />
            </TextStyleContext.Provider>
          </AnimatedView>
        </ComboboxPrimitive.Positioner>
      </FullWindowOverlay>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({
  style,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return (
    <ComboboxPrimitive.List
      style={(state) => [
        styles.list,
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      {...props}
    />
  )
}

function ComboboxItem({
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ComboboxPrimitive.Item>, "children"> & {
  children?: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <ComboboxPrimitive.Item
      style={(state) => [
        styles.item,
        state.highlighted && { opacity: 0.8 },
        props.disabled && { opacity: 0.5 },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      {wrapText(children, [styles.itemText, { color: colors.menuForeground }])}
      <ComboboxPrimitive.ItemIndicator style={styles.indicator}>
        <Icon as={CheckIcon} size={16} color={colors.primary} />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup(
  props: React.ComponentProps<typeof ComboboxPrimitive.Group>
) {
  return <ComboboxPrimitive.Group {...props} />
}

function ComboboxLabel({
  style,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.GroupLabel>) {
  const { colors } = useTheme()
  return (
    <ComboboxPrimitive.GroupLabel
      style={(state) => [
        styles.label,
        { color: colors.menuMutedForeground },
        resolveStyle(style, state) as StyleProp<TextStyle>,
      ]}
      {...props}
    />
  )
}

function ComboboxEmpty({
  style,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  const { colors } = useTheme()
  return (
    <ComboboxPrimitive.Empty
      style={(state) => [
        styles.empty,
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      {wrapText(children, [
        styles.emptyText,
        { color: colors.menuMutedForeground },
      ])}
    </ComboboxPrimitive.Empty>
  )
}

function ComboboxSeparator({
  style,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Separator>) {
  const { colors } = useTheme()
  return (
    <ComboboxPrimitive.Separator
      style={(state) => [
        styles.separator,
        { backgroundColor: colors.menuBorder },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

function ComboboxChips({
  style,
  invalid,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chips> & {
  invalid?: boolean
}) {
  const { colors, isDark } = useTheme()
  const { hasValue, disabled } =
    ComboboxPrimitive.useComboboxRootContext("ComboboxChips")
  const field = useFieldRootContext()
  const isInvalid = invalid ?? field.state.invalid
  return (
    <ComboboxPrimitive.Chips
      style={(state) => [
        styles.chips,
        { backgroundColor: colors.secondary },
        hasValue && styles.chipsFilled,
        isInvalid && {
          borderColor: colors.destructive,
          backgroundColor: `${colors.destructive}${isDark ? "1a" : "0d"}`,
        },
        disabled && { opacity: 0.5 },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

function ComboboxChip({
  style,
  children,
  showRemove = true,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chip> & {
  showRemove?: boolean
}) {
  const { colors, isDark } = useTheme()
  const color = colors.primary
  return (
    <ComboboxPrimitive.Chip
      style={(state) => [
        styles.chip,
        { backgroundColor: withAlpha(colors.primary, isDark ? 0.2 : 0.1) },
        showRemove && styles.chipRemovable,
        state.disabled && { opacity: 0.5 },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      {wrapText(children, [styles.chipText, { color }])}
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          accessibilityLabel="Remove"
          render={
            <Button variant="ghost" size="icon-xs" style={styles.chipRemove} />
          }
        >
          <Icon as={XIcon} size={12} color={color} />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({
  style,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input>) {
  const { colors } = useTheme()
  return (
    <ComboboxPrimitive.Input
      style={(state) => [
        styles.chipsInput,
        { color: colors.foreground },
        resolveStyle(style, state) as StyleProp<TextStyle>,
      ]}
      placeholderTextColor={colors.mutedForeground}
      cursorColor={colors.primary}
      selectionColor={colors.primary}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<React.ComponentRef<typeof View> | null>(null)
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
