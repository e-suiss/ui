import { cn } from "cn"
import type * as React from "react"
import { resolveClassName } from "@/components/primitives/use-render"
import * as WheelPickerPrimitive from "@/components/primitives/wheel-picker"
import { Text, TextClassContext } from "@/components/ui/text"

function WheelPicker({
  className,
  children,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.Root>) {
  return (
    <WheelPickerPrimitive.Root
      className={(state) =>
        cn(
          "relative flex-row items-stretch justify-center",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      <WheelPickerPrimitive.Indicator className="rounded-lg bg-secondary" />
      {children}
    </WheelPickerPrimitive.Root>
  )
}

function WheelPickerColumn({
  className,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.Column>) {
  return (
    <WheelPickerPrimitive.Column
      className={(state) =>
        cn("relative rounded-lg", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

function WheelPickerItem({
  className,
  children,
  disabled = false,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.Item>) {
  return (
    <TextClassContext.Provider
      value={cn(
        "text-xl text-foreground tabular-nums",
        disabled && "text-muted-foreground"
      )}
    >
      <WheelPickerPrimitive.Item
        disabled={disabled}
        className={(state) =>
          cn(
            "flex-row items-center justify-center px-3",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        {typeof children === "string" || typeof children === "number" ? (
          <Text numberOfLines={1}>{children}</Text>
        ) : (
          children
        )}
      </WheelPickerPrimitive.Item>
    </TextClassContext.Provider>
  )
}

export { WheelPicker, WheelPickerColumn, WheelPickerItem }
