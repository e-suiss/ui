import { cva } from "class-variance-authority"
import { cn } from "cn"
import { type Icon as PhosphorIcon, XIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, ScrollView } from "react-native"
import {
  type ToggleChangeEventDetails,
  Toggle as TogglePrimitive,
  type ToggleState,
} from "@/components/primitives/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@/components/primitives/toggle-group"
import { resolveClassName } from "@/components/primitives/use-render"
import { Icon, IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

type ChipSize = "default" | "sm"

const ChipGroupContext = React.createContext<{ size: ChipSize } | null>(null)

const chipVariants = cva(
  "shrink-0 flex-row items-center justify-center self-start rounded-full",
  {
    variants: {
      size: {
        default: "h-8 gap-1.5 px-3",
        sm: "h-7 gap-1 px-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function chipStateClassName(state: ToggleState) {
  return cn(
    state.pressed ? "bg-foreground" : "bg-secondary",
    state.disabled ? "opacity-50" : "active:scale-[0.96] active:opacity-80"
  )
}

function chipTextClassName(size: ChipSize, state: ToggleState) {
  return cn(
    "font-medium",
    size === "sm" ? "text-xs" : "text-sm",
    state.pressed ? "text-background" : "text-foreground"
  )
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
  className,
  children,
  disabled,
  ...props
}: ChipProps) {
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
      className={(state) =>
        cn(
          chipVariants({ size }),
          chipStateClassName(state),
          onRemove && (size === "sm" ? "pe-1.5" : "pe-2"),
          resolveClassName(className, state)
        )
      }
      render={(renderProps, state) => (
        <TextClassContext.Provider value={chipTextClassName(size, state)}>
          <IconClassContext.Provider
            value={size === "sm" ? "size-3.5" : "size-4"}
          >
            <Pressable {...renderProps} />
          </IconClassContext.Provider>
        </TextClassContext.Provider>
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
          className="size-5 items-center justify-center rounded-full active:opacity-80"
        >
          <Icon as={XIcon} weight="bold" className="size-3" />
        </Pressable>
      ) : null}
    </TogglePrimitive>
  )
}

function ChipGroup({
  size = "default",
  scrollable = false,
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive> & {
  size?: ChipSize
  scrollable?: boolean
}) {
  const context = React.useMemo(() => ({ size }), [size])
  const group = (
    <ChipGroupContext.Provider value={context}>
      <ToggleGroupPrimitive
        className={(state) =>
          cn(
            "flex-row gap-2",
            !scrollable && "flex-wrap",
            resolveClassName(className, state)
          )
        }
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
      className="grow-0"
    >
      {group}
    </ScrollView>
  )
}

export type { ChipProps, ChipSize }
export { Chip, ChipGroup, chipVariants }
