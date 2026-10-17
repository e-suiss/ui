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
          "min-h-16 w-full flex-row rounded-textarea border border-transparent bg-secondary px-3 py-3 text-base text-secondary-foreground",
          state.focused && "border-ring ring-3 ring-ring/50",
          state.invalid &&
            "border-destructive bg-destructive/5 dark:bg-destructive/10",
          state.disabled && "opacity-50",
          resolveClassName(className, state)
        )
      }
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      placeholderTextColorClassName="accent-muted-foreground"
      cursorColorClassName="accent-primary"
      selectionColorClassName="accent-primary"
      {...props}
    />
  )
}

export { Textarea }
