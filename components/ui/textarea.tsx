import { cn } from "cn"
import type * as React from "react"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full resize-none rounded-xl border border-transparent bg-control px-3 py-3 text-base transition-[color,box-shadow,background-color] outline-none placeholder:text-label-secondary focus-visible:focus-ring disabled:cursor-not-allowed disabled:bg-control-disabled disabled:text-label-quaternary aria-invalid:border-danger aria-invalid:bg-danger/5 dark:aria-invalid:bg-danger/10",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
