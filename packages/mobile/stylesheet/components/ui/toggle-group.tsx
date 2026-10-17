import * as React from "react"
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import Animated, {
  Easing,
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated"
import {
  Toggle as TogglePrimitive,
  type ToggleState,
} from "@/components/primitives/toggle"
import {
  ToggleGroupIndicator as ToggleGroupIndicatorPrimitive,
  ToggleGroup as ToggleGroupPrimitive,
  useToggleGroupContext,
} from "@/components/primitives/toggle-group"
import type { Orientation } from "@/components/primitives/types"
import { resolveStyle } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import { TextStyleContext } from "@/components/ui/text"
import {
  fontSize,
  metrics,
  radius,
  shadow,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"
import {
  type ToggleVariantProps,
  toggleStyle,
  toggleTextStyle,
} from "@/components/ui/toggle"

type ToggleGroupContextValue = ToggleVariantProps & {
  spacing: number
  orientation: Orientation
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  variant: "default",
  size: "default",
  spacing: 2,
  orientation: "horizontal",
})

const ItemPositionContext = React.createContext({ first: true, last: true })

const INDICATOR_TRANSITION = LinearTransition.duration(300)
  .easing(Easing.bezier(0.32, 0.72, 0, 1))
  .reduceMotion(ReduceMotion.System)

const styles = StyleSheet.create({
  root: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  vertical: { flexDirection: "column", alignItems: "stretch" },
  attached: { borderRadius: metrics.radius.toggle },
  item: { flexShrink: 0 },
  segmentedItem: { borderRadius: radius.md, paddingHorizontal: 12 },
  indicator: { borderRadius: radius.md },
  icon: { flexShrink: 0 },
})

function segmentedSelectedStyle(
  colors: ThemeColors,
  isDark: boolean
): StyleProp<ViewStyle> {
  return [{ backgroundColor: isDark ? colors.border : colors.card }, shadow.sm]
}

function ToggleGroupIndicator() {
  const { colors, isDark } = useTheme()
  return (
    <ToggleGroupIndicatorPrimitive
      style={[styles.indicator, segmentedSelectedStyle(colors, isDark)]}
      render={<Animated.View layout={INDICATOR_TRANSITION} />}
    />
  )
}

function ToggleGroup({
  style,
  variant = "default",
  size = "default",
  spacing = 2,
  orientation = "horizontal",
  multiple,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive> &
  ToggleVariantProps & {
    spacing?: number
  }) {
  const { colors } = useTheme()
  const segmented = spacing === 0 && variant === "default"
  const items = React.Children.toArray(children)
  const context = React.useMemo(
    () => ({ variant, size, spacing, orientation }),
    [variant, size, spacing, orientation]
  )
  return (
    <ToggleGroupPrimitive
      orientation={orientation}
      multiple={multiple}
      style={(state) => [
        styles.root,
        orientation === "vertical" && styles.vertical,
        { gap: segmented ? 4 : spacing * 4 },
        spacing === 0 && variant === "outline" && styles.attached,
        segmented && {
          borderRadius: radius.xl,
          backgroundColor: colors.secondary,
          padding: 4,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {segmented && !multiple ? <ToggleGroupIndicator /> : null}
      <ToggleGroupContext.Provider value={context}>
        {items.map((child, index) => (
          <ItemPositionContext.Provider
            key={React.isValidElement(child) ? child.key : index}
            value={{ first: index === 0, last: index === items.length - 1 }}
          >
            {child}
          </ItemPositionContext.Provider>
        ))}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  )
}

function attachedStyle(
  context: ToggleGroupContextValue,
  position: { first: boolean; last: boolean }
): ViewStyle {
  const vertical = context.orientation === "vertical"
  const edge = vertical ? radius.xl : radius.lg
  const firstCorners = vertical
    ? { borderTopLeftRadius: edge, borderTopRightRadius: edge }
    : { borderTopLeftRadius: edge, borderBottomLeftRadius: edge }
  const lastCorners = vertical
    ? { borderBottomLeftRadius: edge, borderBottomRightRadius: edge }
    : { borderTopRightRadius: edge, borderBottomRightRadius: edge }
  const collapsedBorder = vertical
    ? { borderTopWidth: 0 }
    : { borderLeftWidth: 0 }
  return {
    borderRadius: 0,
    ...(position.first && firstCorners),
    ...(position.last && lastCorners),
    ...(context.variant === "outline" && !position.first && collapsedBorder),
  }
}

function itemStyle(
  context: ToggleGroupContextValue,
  position: { first: boolean; last: boolean },
  colors: ThemeColors,
  isDark: boolean,
  state: ToggleState,
  pressing: boolean,
  multiple: boolean
): StyleProp<ViewStyle> {
  if (context.spacing === 0 && context.variant === "default") {
    return [
      toggleStyle(context, colors, { ...state, pressed: false }, false),
      styles.segmentedItem,
      state.pressed && multiple && segmentedSelectedStyle(colors, isDark),
    ]
  }
  return [
    toggleStyle(context, colors, state, pressing),
    context.spacing === 0 && attachedStyle(context, position),
  ]
}

function itemTextStyle(
  context: ToggleGroupContextValue,
  colors: ThemeColors,
  state: ToggleState
): TextStyle {
  if (context.spacing === 0 && context.variant === "default") {
    const color = state.pressed ? colors.foreground : colors.mutedForeground
    return { ...fontSize.sm, color }
  }
  return toggleTextStyle(colors, state)
}

function ToggleGroupItem({
  style,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive> & ToggleVariantProps) {
  const context = React.useContext(ToggleGroupContext)
  const position = React.useContext(ItemPositionContext)
  const { colors, isDark } = useTheme()
  const multiple = useToggleGroupContext()?.multiple ?? false
  const resolved = {
    ...context,
    variant: context.variant || variant,
    size: context.size || size,
  }

  return (
    <TogglePrimitive
      {...props}
      render={(renderProps, state) => (
        <TextStyleContext.Provider
          value={itemTextStyle(resolved, colors, state)}
        >
          <Pressable
            {...renderProps}
            style={({ pressed }) => [
              itemStyle(
                resolved,
                position,
                colors,
                isDark,
                state,
                pressed,
                multiple
              ),
              styles.item,
              resolveStyle(style, state) as StyleProp<ViewStyle>,
            ]}
          />
        </TextStyleContext.Provider>
      )}
    >
      {children}
    </TogglePrimitive>
  )
}

function ToggleGroupIcon({
  style,
  size = 16,
  ...props
}: React.ComponentProps<typeof Icon>) {
  return <Icon size={size} style={[styles.icon, style]} {...props} />
}

export { ToggleGroup, ToggleGroupIcon, ToggleGroupItem }
