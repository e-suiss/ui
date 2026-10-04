import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"
import type * as React from "react"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-transparent bg-fill px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:text-label placeholder:text-label-secondary focus-visible:focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:bg-danger/5 dark:aria-invalid:bg-danger/10",
        className
      )}
      {...props}
    />
  )
}

export { Input }
