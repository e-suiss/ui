import { cn } from "cn"
import * as InputPrimitive from "@/components/primitives/input"
import { resolveClassName } from "@/components/primitives/use-render"

function Textarea({
  className,
  multiline = true,
  numberOfLines = 8,
  ...props
}: React.ComponentProps<typeof InputPrimitive.Root>) {
  return (
    <InputPrimitive.Root
      className={(state) =>
        cn(
          "min-h-16 w-full flex-row rounded-xl border border-transparent bg-control px-3 py-3 text-base text-label",
          state.focused && "border-focus",
          state.invalid && "border-danger bg-danger/5 dark:bg-danger/10",
          state.disabled && "bg-control-disabled text-label-quaternary",
          resolveClassName(className, state)
        )
      }
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      placeholderTextColorClassName={
        props.disabled ? "accent-label-quaternary" : "accent-label-secondary"
      }
      cursorColorClassName="accent-accent"
      selectionColorClassName="accent-accent"
      {...props}
    />
  )
}

export { Textarea }
