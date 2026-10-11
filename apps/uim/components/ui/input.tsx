import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"
import type * as React from "react"

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
        "h-11 w-full min-w-0 rounded-lg border border-transparent bg-control px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:text-label caret-accent placeholder:text-label-secondary focus-visible:focus-ring data-[size=md]:h-9 data-[size=md]:text-sm data-[size=sm]:h-8 data-[size=sm]:rounded-md data-[size=sm]:px-2.5 data-[size=sm]:text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-control-disabled disabled:text-label-quaternary disabled:placeholder:text-label-quaternary aria-invalid:border-danger aria-invalid:bg-danger/5 dark:aria-invalid:bg-danger/10",
        className
      )}
      {...props}
    />
  )
}

export { Input }
