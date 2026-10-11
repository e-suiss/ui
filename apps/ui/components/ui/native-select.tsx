"use client"

import { CaretUpDownIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import type * as React from "react"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "relative w-fit has-[select:disabled]:bg-control-disabled has-[select:disabled]:text-label-quaternary",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="h-11 w-full min-w-0 appearance-none rounded-lg border border-transparent bg-control py-1 pe-8 ps-3 text-base transition-[color,box-shadow,background-color] outline-none select-none selection:bg-accent selection:text-on-accent placeholder:text-label-secondary has-[option[value='']:checked]:text-label-secondary focus-visible:focus-ring disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-danger aria-invalid:bg-danger/5 dark:aria-invalid:bg-danger/10 data-[size=sm]:h-9 data-[size=sm]:rounded-md"
        {...props}
      />
      <CaretUpDownIcon
        className="pointer-events-none absolute top-1/2 inset-e-2.5 size-4 -translate-y-1/2 text-label-secondary select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
