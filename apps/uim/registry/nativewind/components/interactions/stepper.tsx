import { cn } from "cn"
import { cssInterop } from "nativewind"
import { MinusIcon, PlusIcon } from "phosphor-react-native"
import type * as React from "react"
import { TextInput, View, type ViewProps } from "react-native"
import * as NumberFieldPrimitive from "@/components/primitives/number-field"
import { resolveClassName } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"

declare module "react-native" {
  interface TextInputProps {
    cursorColorClassName?: string
    selectionColorClassName?: string
  }
}

cssInterop(TextInput, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
  placeholderClassName: {
    target: false,
    nativeStyleToProp: { color: "placeholderTextColor" },
  },
  cursorColorClassName: {
    target: false,
    nativeStyleToProp: { color: "cursorColor" },
  },
  selectionColorClassName: {
    target: false,
    nativeStyleToProp: { color: "selectionColor" },
  },
})

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
      cursorColorClassName="text-accent"
      selectionColorClassName="text-accent"
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
          "h-8 shrink-0 flex-row items-center rounded-lg bg-control",
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
      hitSlop={{ top: 6, bottom: 6 }}
      className={(state) =>
        cn(
          "relative h-full w-12 items-center justify-center rounded-l-lg active:bg-control-pressed",
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
      hitSlop={{ top: 6, bottom: 6 }}
      className={(state) =>
        cn(
          "relative h-full w-12 items-center justify-center rounded-r-lg active:bg-control-pressed",
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
      className={cn("h-[1.125rem] w-px shrink-0 bg-separator", className)}
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
