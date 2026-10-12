import { cn } from "cn"
import type { IconProps as PhosphorIconProps } from "phosphor-react-native"
import * as React from "react"
import {
  type GestureResponderEvent,
  I18nManager,
  Pressable,
  View,
  type ViewProps,
} from "react-native"
import Svg, { Path } from "react-native-svg"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"
import { Icon, IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

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

const CONTENT_TEXT: Record<BubbleVariant, string> = {
  default: "text-on-accent",
  secondary: "text-label",
  muted: "text-label",
  tinted: "text-label",
  outline: "text-label",
  ghost: "text-label",
  destructive: "text-danger",
}

const CONTENT_BACKGROUND: Record<BubbleVariant, [string, string]> = {
  default: ["bg-accent", "bg-accent-pressed"],
  secondary: ["bg-control", "bg-control-pressed"],
  muted: ["bg-surface-secondary", "bg-surface-tertiary"],
  tinted: ["bg-accent-12", "bg-accent-20"],
  outline: ["border-separator bg-surface", "border-separator bg-control"],
  ghost: ["bg-transparent", "bg-item-pressed"],
  destructive: ["bg-danger-surface", "bg-danger-surface-pressed"],
}

const TAIL_COLOR: Record<BubbleVariant, [string, string]> = {
  default: ["text-accent", "text-accent-pressed"],
  secondary: ["text-control", "text-control-pressed"],
  muted: ["text-surface-secondary", "text-surface-tertiary"],
  tinted: ["text-accent-12", "text-accent-20"],
  outline: ["text-surface", "text-control"],
  ghost: ["text-transparent", "text-item-pressed"],
  destructive: ["text-danger-surface", "text-danger-surface-pressed"],
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

function BubbleGroup({ className, children, ...props }: ViewProps) {
  const groupAlign = React.useContext(BubbleAlignContext)
  const nodes = React.Children.toArray(children)
  const alignOf = (node: React.ReactNode): BubbleAlign | null => {
    if (!React.isValidElement<{ align?: BubbleAlign }>(node)) return null
    if (node.type !== Bubble) return null
    return node.props.align ?? groupAlign ?? "start"
  }
  return (
    <View className={cn("min-w-0 flex-col gap-2", className)} {...props}>
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
  className,
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
        className={cn(
          "relative min-w-0 max-w-[80%] flex-col gap-1",
          align === "end" ? "items-end self-end" : "items-start self-start",
          variant === "ghost" && "max-w-full",
          reactionSide === "bottom" && "mb-5",
          reactionSide === "top" && "mt-5",
          className
        )}
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
  variant,
  align,
  pressed,
}: {
  variant: BubbleVariant
  align: BubbleAlign
  pressed: boolean
}) {
  const mirrored = (align === "end") !== I18nManager.isRTL
  return (
    <TextClassContext.Provider value={undefined}>
      <IconClassContext.Provider value={undefined}>
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className="absolute -bottom-px size-5"
          style={[
            align === "end" ? { end: -7.9 } : { start: -7.9 },
            mirrored ? { transform: [{ scaleX: -1 }] } : null,
          ]}
        >
          <View className="absolute inset-0">
            <Icon as={BubbleTailShape} className="size-5 text-surface" />
          </View>
          <View className="absolute inset-0">
            <Icon
              as={BubbleTailShape}
              className={cn("size-5", TAIL_COLOR[variant][pressed ? 1 : 0])}
            />
          </View>
        </View>
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

function BubbleContent({
  className,
  render,
  children,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof Pressable> &
  React.RefAttributes<View> & {
    render?: RenderProp<Record<string, unknown>, Record<string, never>>
  }) {
  const { variant, align, tail } = React.useContext(BubbleContext)
  const [pressed, setPressed] = React.useState(false)
  const interactive = Boolean(onPress || onLongPress || render)
  const element = useRender({
    defaultComponent: interactive ? Pressable : View,
    render,
    props: [
      {
        className: cn(
          "relative min-w-0 max-w-full rounded-2xl border border-transparent px-3.5 py-1.5",
          align === "end" ? "self-end" : "self-start",
          CONTENT_BACKGROUND[variant][pressed ? 1 : 0],
          variant === "ghost" && "rounded-none border-0 p-0",
          className
        ),
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
              <BubbleTail variant={variant} align={align} pressed={pressed} />
            ) : null}
            {wrapText(children as React.ReactNode)}
          </>
        ),
      },
      props,
    ],
  })
  return (
    <TextClassContext.Provider value={cn("text-base", CONTENT_TEXT[variant])}>
      {element}
    </TextClassContext.Provider>
  )
}

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  children,
  ...props
}: ViewProps & {
  align?: BubbleAlign
  side?: "top" | "bottom"
}) {
  return (
    <TextClassContext.Provider value="text-sm text-label">
      <View
        className={cn(
          "absolute z-10 flex-row items-center justify-center gap-1 rounded-full border-[3px] border-surface bg-surface-secondary px-1.5 py-0.5",
          side === "top" ? "-top-5" : "-bottom-5",
          align === "start" ? "start-3" : "end-3",
          className
        )}
        {...props}
      >
        {wrapText(children)}
      </View>
    </TextClassContext.Provider>
  )
}

export {
  Bubble,
  BubbleAlignContext,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
}
