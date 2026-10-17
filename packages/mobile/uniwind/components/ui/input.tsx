import { cn } from "cn"
import * as InputPrimitive from "@/components/primitives/input"
import { resolveClassName } from "@/components/primitives/use-render"

type InputSize = "sm" | "md" | "default"

function Input({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof InputPrimitive.Root> & {
  size?: InputSize
}) {
  return (
    <InputPrimitive.Root
      className={(state) =>
        cn(
          "h-input w-full min-w-0 flex-row items-center rounded-input border border-transparent bg-secondary px-input-x py-1 text-[16px] text-secondary-foreground",
          size === "md" && "h-9 text-[14px]",
          size === "sm" && "h-8 rounded-md px-2.5 text-[14px]",
          state.focused && "border-ring ring-3 ring-ring/50",
          state.invalid &&
            "border-destructive bg-destructive/5 dark:bg-destructive/10",
          state.disabled && "opacity-50",
          resolveClassName(className, state)
        )
      }
      placeholderTextColorClassName="accent-muted-foreground"
      cursorColorClassName="accent-primary"
      selectionColorClassName="accent-primary"
      {...props}
    />
  )
}

export { Input }
