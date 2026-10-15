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
          "h-8 w-16 min-w-0 rounded-md bg-transparent px-1 py-0 text-right text-base text-foreground tabular-nums",
          state.disabled && "opacity-50",
          resolveClassName(className, state)
        )
      }
      cursorColorClassName="text-primary"
      selectionColorClassName="text-primary"
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
          "h-8 shrink-0 flex-row items-center gap-[3px] rounded-lg bg-secondary p-[3px]",
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
          "relative h-full w-9 items-center justify-center rounded-md bg-card shadow dark:bg-border dark:shadow-none",
          state.disabled || !canDecrement
            ? "opacity-50 shadow-none"
            : "active:opacity-80 active:shadow-none",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {children ?? (
        <Icon as={MinusIcon} weight="bold" className="size-4 text-foreground" />
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
          "relative h-full w-9 items-center justify-center rounded-md bg-card shadow dark:bg-border dark:shadow-none",
          state.disabled || !canIncrement
            ? "opacity-50 shadow-none"
            : "active:opacity-80 active:shadow-none",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {children ?? (
        <Icon as={PlusIcon} weight="bold" className="size-4 text-foreground" />
      )}
    </NumberFieldPrimitive.Increment>
  )
}

function StepperSeparator({ className, ...props }: ViewProps) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      className={cn("h-[1.125rem] w-px shrink-0 bg-border", className)}
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
