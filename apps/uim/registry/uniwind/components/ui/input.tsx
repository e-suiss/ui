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
          "h-11 w-full min-w-0 flex-row items-center rounded-lg border border-transparent bg-control px-3 py-1 text-base text-label",
          size === "md" && "h-9 text-sm",
          size === "sm" && "h-8 rounded-md px-2.5 text-sm",
          state.focused && "border-focus",
          state.invalid && "border-danger bg-danger/5 dark:bg-danger/10",
          state.disabled && "bg-control-disabled text-label-quaternary",
          resolveClassName(className, state)
        )
      }
      placeholderTextColorClassName={
        props.disabled ? "accent-label-quaternary" : "accent-label-secondary"
      }
      cursorColorClassName="accent-accent"
      selectionColorClassName="accent-accent"
      {...props}
    />
  )
}

export { Input }
