import { type Icon as PhosphorIcon, XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import {
  type ToggleChangeEventDetails,
  Toggle as TogglePrimitive,
  type ToggleState,
} from "@/components/primitives/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@/components/primitives/toggle-group"
import { resolveStyle } from "@/components/primitives/use-render"
import { Icon, IconSizeContext } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type ChipSize = "default" | "sm"

const ChipGroupContext = React.createContext<{ size: ChipSize } | null>(null)

const sizes = StyleSheet.create({
  default: { height: 32, gap: 6, paddingHorizontal: 12 },
  sm: { height: 28, gap: 4, paddingHorizontal: 10 },
})

const styles = StyleSheet.create({
  root: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderRadius: radius.full,
  },
  removable: { paddingEnd: 8 },
  removableSm: { paddingEnd: 6 },
  scaled: { transform: [{ scale: 0.96 }] },
  remove: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  group: { flexDirection: "row", gap: 8 },
  wrap: { flexWrap: "wrap" },
  scroll: { flexGrow: 0 },
})

function chipStyle(
  size: ChipSize,
  colors: ThemeColors,
  state: ToggleState,
  pressing: boolean,
  removable: boolean
): StyleProp<ViewStyle> {
  return [
    styles.root,
    sizes[size],
    removable && (size === "sm" ? styles.removableSm : styles.removable),
    { backgroundColor: state.pressed ? colors.foreground : colors.secondary },
    pressing && !state.disabled && [styles.scaled, { opacity: 0.8 }],
    state.disabled && { opacity: 0.5 },
  ]
}

function chipTextStyle(
  size: ChipSize,
  colors: ThemeColors,
  state: ToggleState
): TextStyle {
  let color = colors.foreground
  if (state.pressed) color = colors.background
  return {
    ...(size === "sm" ? fontSize.xs : fontSize.sm),
    fontWeight: "500",
    color,
  }
}

type ChipProps = Omit<
  React.ComponentProps<typeof TogglePrimitive>,
  "pressed" | "defaultPressed" | "onPressedChange"
> & {
  selected?: boolean
  defaultSelected?: boolean
  onSelectedChange?: (
    selected: boolean,
    eventDetails: ToggleChangeEventDetails
  ) => void
  size?: ChipSize
  icon?: PhosphorIcon
  onRemove?: () => void
  removeLabel?: string
}

function Chip({
  selected,
  defaultSelected,
  onSelectedChange,
  size: sizeProp,
  icon,
  onRemove,
  removeLabel = "Remove",
  style,
  children,
  disabled,
  ...props
}: ChipProps) {
  const { colors } = useTheme()
  const group = React.useContext(ChipGroupContext)
  const size = sizeProp ?? group?.size ?? "default"
  return (
    <TogglePrimitive
      pressed={selected}
      defaultPressed={defaultSelected}
      onPressedChange={onSelectedChange}
      disabled={disabled}
      accessibilityActions={
        onRemove && !disabled
          ? [{ name: "remove", label: removeLabel }]
          : undefined
      }
      onAccessibilityAction={(event) => {
        if (disabled) return
        if (event.nativeEvent.actionName === "remove") onRemove?.()
      }}
      render={(renderProps, state) => (
        <TextStyleContext.Provider value={chipTextStyle(size, colors, state)}>
          <IconSizeContext.Provider value={size === "sm" ? 14 : 16}>
            <Pressable
              {...renderProps}
              style={({ pressed }) => [
                chipStyle(size, colors, state, pressed, Boolean(onRemove)),
                resolveStyle(style, state) as StyleProp<ViewStyle>,
              ]}
            />
          </IconSizeContext.Provider>
        </TextStyleContext.Provider>
      )}
      {...props}
    >
      {icon ? <Icon as={icon} /> : null}
      {typeof children === "string" || typeof children === "number" ? (
        <Text numberOfLines={1}>{children}</Text>
      ) : (
        children
      )}
      {onRemove ? (
        <Pressable
          role="button"
          accessibilityLabel={removeLabel}
          disabled={disabled}
          hitSlop={8}
          onPress={onRemove}
          style={({ pressed }) => [styles.remove, pressed && { opacity: 0.8 }]}
        >
          <Icon as={XIcon} weight="bold" size={12} />
        </Pressable>
      ) : null}
    </TogglePrimitive>
  )
}

function ChipGroup({
  size = "default",
  scrollable = false,
  style,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive> & {
  size?: ChipSize
  scrollable?: boolean
}) {
  const context = React.useMemo(() => ({ size }), [size])
  const group = (
    <ChipGroupContext.Provider value={context}>
      <ToggleGroupPrimitive
        style={(state) => [
          styles.group,
          !scrollable && styles.wrap,
          resolveStyle(style, state) as StyleProp<ViewStyle>,
        ]}
        {...props}
      />
    </ChipGroupContext.Provider>
  )
  if (!scrollable) return group
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={styles.scroll}
    >
      {group}
    </ScrollView>
  )
}

export type { ChipProps, ChipSize }
export { Chip, ChipGroup, chipStyle, chipTextStyle }
