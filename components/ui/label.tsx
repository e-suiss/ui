"use client"

import { cn } from "cn"
import type * as React from "react"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-base font-semibold select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-label-quaternary peer-disabled:cursor-not-allowed peer-disabled:text-label-quaternary",
        className
      )}
      {...props}
    />
  )
}

export { Label }
