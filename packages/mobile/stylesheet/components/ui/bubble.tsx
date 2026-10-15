import type { IconProps as PhosphorIconProps } from "phosphor-react-native"
import * as React from "react"
import {
  type GestureResponderEvent,
  I18nManager,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native"
import Svg, { Path } from "react-native-svg"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type BubbleAlign = "start" | "end"

type BubbleVariant =
  | "default"
  | "secondary"
  | "muted"
  | "tinted"
  | "outline"
  | "ghost"
  | "destructive"

type BubbleContextValue = {
  variant: BubbleVariant
  align: BubbleAlign
  tail: boolean
}

const BubbleAlignContext = React.createContext<BubbleAlign | undefined>(
  undefined
)

const BubbleTailContext = React.createContext(true)

const BubbleContext = React.createContext<BubbleContextValue>({
  variant: "default",
  align: "start",
  tail: true,
})

const TAIL_PATH = "M7 0H20V4A16 16 0 0 1 4 20H0V19.54A10 10 0 0 0 7 10Z"

const styles = StyleSheet.create({
  group: { minWidth: 0, flexDirection: "column", gap: 8 },
  bubble: {
    position: "relative",
    minWidth: 0,
    maxWidth: "80%",
    flexDirection: "column",
    gap: 4,
  },
  content: {
    position: "relative",
    minWidth: 0,
    maxWidth: "100%",
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  ghost: { borderRadius: 0, borderWidth: 0, padding: 0, paddingHorizontal: 0 },
  tail: { position: "absolute", bottom: -1, width: 20, height: 20 },
  layer: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
  reactions: {
    position: "absolute",
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: radius.full,
    borderWidth: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
})

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function bubbleColors(
  variant: BubbleVariant,
  colors: ThemeColors,
  pressed: boolean
) {
  switch (variant) {
    case "default":
      return {
        background: pressed ? colors.accentPressed : colors.accent,
        text: colors.onAccent,
      }
    case "secondary":
      return {
        background: pressed ? colors.controlPressed : colors.control,
        text: colors.label,
      }
    case "muted":
      return {
        background: pressed ? colors.surfaceTertiary : colors.surfaceSecondary,
        text: colors.label,
      }
    case "tinted":
      return {
        background: withAlpha(colors.accent, pressed ? 0.2 : 0.12),
        text: colors.label,
      }
    case "outline":
      return {
        background: pressed ? colors.control : colors.surface,
        text: colors.label,
        border: colors.separator,
      }
    case "ghost":
      return {
        background: pressed ? colors.itemPressed : "transparent",
        text: colors.label,
      }
    default:
      return {
        background: pressed
          ? colors.dangerSurfacePressed
          : colors.dangerSurface,
        text: colors.danger,
      }
  }
}

function wrapText(children: React.ReactNode) {
  const output: React.ReactNode[] = []
  let run: (string | number)[] = []
  const flush = () => {
    if (run.length === 0) return
    output.push(<Text key={`text-${output.length}`}>{run.join("")}</Text>)
    run = []
  }
  for (const child of React.Children.toArray(children)) {
    if (typeof child === "string" || typeof child === "number") {
      run.push(child)
    } else {
      flush()
      output.push(child)
    }
  }
  flush()
  return output
}

function BubbleGroup({ style, children, ...props }: ViewProps) {
  const groupAlign = React.useContext(BubbleAlignContext)
  const nodes = React.Children.toArray(children)
  const alignOf = (node: React.ReactNode): BubbleAlign | null => {
    if (!React.isValidElement<{ align?: BubbleAlign }>(node)) return null
    if (node.type !== Bubble) return null
    return node.props.align ?? groupAlign ?? "start"
  }
  return (
    <View style={[styles.group, style]} {...props}>
      {nodes.map((node, index) => {
        const align = alignOf(node)
        if (align === null || !React.isValidElement(node)) return node
        const tail = alignOf(nodes[index + 1]) !== align
        return (
          <BubbleTailContext.Provider key={node.key ?? index} value={tail}>
            {node}
          </BubbleTailContext.Provider>
        )
      })}
    </View>
  )
}

function Bubble({
  variant = "default",
  align: alignProp,
  style,
  children,
  ...props
}: ViewProps & {
  variant?: BubbleVariant
  align?: BubbleAlign
}) {
  const inheritedAlign = React.useContext(BubbleAlignContext)
  const tail = React.useContext(BubbleTailContext)
  const align = alignProp ?? inheritedAlign ?? "start"
  let reactionSide: "top" | "bottom" | null = null
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement<{ side?: "top" | "bottom" }>(child) &&
      child.type === BubbleReactions
    ) {
      reactionSide = child.props.side ?? "bottom"
    }
  })
  const context = React.useMemo(
    () => ({
      variant,
      align,
      tail: tail && variant !== "ghost" && variant !== "outline",
    }),
    [variant, align, tail]
  )
  return (
    <BubbleContext.Provider value={context}>
      <View
        style={[
          styles.bubble,
          {
            alignItems: align === "end" ? "flex-end" : "flex-start",
            alignSelf: align === "end" ? "flex-end" : "flex-start",
          },
          variant === "ghost" && { maxWidth: "100%" },
          reactionSide === "bottom" && { marginBottom: 20 },
          reactionSide === "top" && { marginTop: 20 },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    </BubbleContext.Provider>
  )
}

function BubbleTailShape({ color, size, style }: PhosphorIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" style={style}>
      <Path d={TAIL_PATH} fill={color} />
    </Svg>
  )
}

function BubbleTail({
  color,
  surface,
  align,
}: {
  color: string
  surface: string
  align: BubbleAlign
}) {
  const mirrored = (align === "end") !== I18nManager.isRTL
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.tail,
        align === "end" ? { end: -6.9 } : { start: -6.9 },
        mirrored ? { transform: [{ scaleX: -1 }] } : null,
      ]}
    >
      <View style={styles.layer}>
        <Icon as={BubbleTailShape} size={20} color={surface} />
      </View>
      <View style={styles.layer}>
        <Icon as={BubbleTailShape} size={20} color={color} />
      </View>
    </View>
  )
}

function BubbleContent({
  style,
  render,
  children,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "style"> &
  React.RefAttributes<View> & {
    style?: StyleProp<ViewStyle>
    render?: RenderProp<Record<string, unknown>, Record<string, never>>
  }) {
  const { colors } = useTheme()
  const { variant, align, tail } = React.useContext(BubbleContext)
  const [pressed, setPressed] = React.useState(false)
  const interactive = Boolean(onPress || onLongPress || render)
  const palette = bubbleColors(variant, colors, pressed)
  const element = useRender({
    defaultComponent: interactive ? Pressable : View,
    render,
    props: [
      {
        style: [
          styles.content,
          { alignSelf: align === "end" ? "flex-end" : "flex-start" },
          { backgroundColor: palette.background },
          palette.border ? { borderColor: palette.border } : null,
          variant === "ghost" && styles.ghost,
          style,
        ],
        role: onPress || onLongPress ? "button" : undefined,
        onPress,
        onLongPress,
        onPressIn: (event: GestureResponderEvent) => {
          setPressed(true)
          onPressIn?.(event)
        },
        onPressOut: (event: GestureResponderEvent) => {
          setPressed(false)
          onPressOut?.(event)
        },
        children: (
          <>
            {tail ? (
              <BubbleTail
                color={palette.background}
                surface={colors.surface}
                align={align}
              />
            ) : null}
            {wrapText(children as React.ReactNode)}
          </>
        ),
      },
      props,
    ],
  })
  return (
    <TextStyleContext.Provider
      value={{ ...fontSize.base, color: palette.text }}
    >
      {element}
    </TextStyleContext.Provider>
  )
}

function BubbleReactions({
  side = "bottom",
  align = "end",
  style,
  children,
  ...props
}: ViewProps & {
  align?: BubbleAlign
  side?: "top" | "bottom"
}) {
  const { colors } = useTheme()
  return (
    <TextStyleContext.Provider value={{ ...fontSize.sm, color: colors.label }}>
      <View
        style={[
          styles.reactions,
          {
            borderColor: colors.surface,
            backgroundColor: colors.surfaceSecondary,
          },
          side === "top" ? { top: -20 } : { bottom: -20 },
          align === "start" ? { start: 12 } : { end: 12 },
          style,
        ]}
        {...props}
      >
        {wrapText(children)}
      </View>
    </TextStyleContext.Provider>
  )
}

export {
  Bubble,
  BubbleAlignContext,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
}
