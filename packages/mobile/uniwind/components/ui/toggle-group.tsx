import type { VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"
import { Pressable } from "react-native"
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
import { resolveClassName } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"
import {
  toggleStateClassName,
  toggleTextClassName,
  toggleVariants,
} from "@/components/ui/toggle"

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
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

const SEGMENTED_SELECTED_CLASS_NAME = "bg-card shadow-sm dark:bg-border"

function ToggleGroupIndicator() {
  return (
    <ToggleGroupIndicatorPrimitive
      className={cn("rounded-md", SEGMENTED_SELECTED_CLASS_NAME)}
      render={<Animated.View layout={INDICATOR_TRANSITION} />}
    />
  )
}

function ToggleGroup({
  className,
  style,
  variant = "default",
  size = "default",
  spacing = 2,
  orientation = "horizontal",
  multiple,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number
  }) {
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
      className={(state) =>
        cn(
          "relative flex-row items-center self-start",
          orientation === "vertical" && "flex-col items-stretch",
          spacing === 0 && variant === "outline" && "rounded-lg",
          segmented && "rounded-xl bg-secondary p-1",
          resolveClassName(className, state)
        )
      }
      style={(state) => [
        { gap: segmented ? 4 : spacing * 4 },
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

function itemClassName(
  context: ToggleGroupContextValue,
  position: { first: boolean; last: boolean },
  state: ToggleState,
  multiple: boolean
) {
  const vertical = context.orientation === "vertical"
  if (context.spacing === 0 && context.variant === "default") {
    return cn(
      "rounded-md px-3",
      state.pressed && multiple && SEGMENTED_SELECTED_CLASS_NAME,
      state.disabled && "opacity-50"
    )
  }
  return cn(
    toggleStateClassName(state),
    context.spacing === 0 &&
      cn(
        "rounded-none",
        vertical
          ? cn(
              position.first && "rounded-t-xl",
              position.last && "rounded-b-xl"
            )
          : cn(
              position.first && "rounded-l-lg",
              position.last && "rounded-r-lg"
            ),
        context.variant === "outline" &&
          !position.first &&
          (vertical ? "border-t-0" : "border-l-0")
      )
  )
}

function itemTextClassName(
  context: ToggleGroupContextValue,
  state: ToggleState
) {
  if (context.spacing === 0 && context.variant === "default") {
    return cn(
      "text-sm",
      state.pressed ? "text-card-foreground" : "text-muted-foreground"
    )
  }
  return toggleTextClassName(state)
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)
  const position = React.useContext(ItemPositionContext)
  const multiple = useToggleGroupContext()?.multiple ?? false
  const resolved = {
    ...context,
    variant: context.variant || variant,
    size: context.size || size,
  }

  return (
    <TogglePrimitive
      className={(state) =>
        cn(
          "shrink-0",
          toggleVariants({ variant: resolved.variant, size: resolved.size }),
          itemClassName(resolved, position, state, multiple),
          resolveClassName(className, state)
        )
      }
      render={(renderProps, state) => (
        <TextClassContext.Provider value={itemTextClassName(resolved, state)}>
          <Pressable {...renderProps} />
        </TextClassContext.Provider>
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

function ToggleGroupIcon({
  className,
  ...props
}: React.ComponentProps<typeof Icon>) {
  return <Icon className={cn("size-4 shrink-0", className)} {...props} />
}

export { ToggleGroup, ToggleGroupIcon, ToggleGroupItem }
