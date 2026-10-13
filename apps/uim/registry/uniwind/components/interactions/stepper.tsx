import { cn } from "cn"
import { MinusIcon, PlusIcon } from "phosphor-react-native"
import type * as React from "react"
import { View, type ViewProps } from "react-native"
import * as NumberFieldPrimitive from "@/components/primitives/number-field"
import { resolveClassName } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"

function Stepper({
  value,
  defaultValue = 0,
  onValueChange,
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof NumberFieldPrimitive.Root>,
  "value" | "defaultValue" | "onValueChange"
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (
    value: number,
    eventDetails: NumberFieldPrimitive.ChangeEventDetails
  ) => void
}) {
  return (
    <NumberFieldPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next, details) => {
        if (next === null) {
          details.cancel()
          return
        }
        onValueChange?.(next, details)
      }}
      className={(state) =>
        cn("flex-row items-center gap-3", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

function StepperInput({
  className,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Input>) {
  return (
    <NumberFieldPrimitive.Input
      className={(state) =>
        cn(
          "h-8 w-16 min-w-0 rounded-md bg-transparent px-1 py-0 text-right text-base text-label tabular-nums",
          state.disabled && "text-label-quaternary",
          resolveClassName(className, state)
        )
      }
      cursorColorClassName="accent-accent"
      selectionColorClassName="accent-accent"
      {...props}
    />
  )
}

function StepperGroup({
  className,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Group>) {
  return (
    <NumberFieldPrimitive.Group
      className={(state) =>
        cn(
          "h-8 shrink-0 flex-row items-center gap-[3px] rounded-lg bg-control p-[3px]",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function StepperDecrement({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Decrement>) {
  const { canDecrement } = NumberFieldPrimitive.useRootContext()
  return (
    <NumberFieldPrimitive.Decrement
      hitSlop={{ top: 9, bottom: 9 }}
      className={(state) =>
        cn(
          "relative h-full w-9 items-center justify-center rounded-md",
          state.disabled || !canDecrement
            ? "bg-control-disabled"
            : "bg-surface-raised shadow-sm active:bg-control-pressed active:shadow-none dark:bg-label-quaternary dark:shadow-none dark:active:bg-control-pressed",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {children ?? (
        <Icon
          as={MinusIcon}
          weight="bold"
          className={cn(
            "size-4 text-label",
            !canDecrement && "text-label-quaternary"
          )}
        />
      )}
    </NumberFieldPrimitive.Decrement>
  )
}

function StepperIncrement({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NumberFieldPrimitive.Increment>) {
  const { canIncrement } = NumberFieldPrimitive.useRootContext()
  return (
    <NumberFieldPrimitive.Increment
      hitSlop={{ top: 9, bottom: 9 }}
      className={(state) =>
        cn(
          "relative h-full w-9 items-center justify-center rounded-md",
          state.disabled || !canIncrement
            ? "bg-control-disabled"
            : "bg-surface-raised shadow-sm active:bg-control-pressed active:shadow-none dark:bg-label-quaternary dark:shadow-none dark:active:bg-control-pressed",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {children ?? (
        <Icon
          as={PlusIcon}
          weight="bold"
          className={cn(
            "size-4 text-label",
            !canIncrement && "text-label-quaternary"
          )}
        />
      )}
    </NumberFieldPrimitive.Increment>
  )
}

function StepperSeparator({ className, ...props }: ViewProps) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      className={cn("h-4.5 w-px shrink-0 bg-separator", className)}
      {...props}
    />
  )
}

export {
  Stepper,
  StepperDecrement,
  StepperGroup,
  StepperIncrement,
  StepperInput,
  StepperSeparator,
}
