"use client"

import type * as React from "react"
import { Input as InputPrimitive } from "react-aria-components"
import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  size?: "sm" | "md" | "default"
}) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(
        "cn-input w-full min-w-0 outline-none file:inline-flex file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
