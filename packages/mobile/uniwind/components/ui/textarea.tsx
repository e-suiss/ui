import { cn } from "cn"
import * as InputPrimitive from "@/components/primitives/input"
import { resolveClassName } from "@/components/primitives/use-render"

type TextareaSize = "default" | "lg"

function Textarea({
  className,
  size = "default",
  multiline = true,
  numberOfLines = 8,
  ...props
}: React.ComponentProps<typeof InputPrimitive.Root> & {
  size?: TextareaSize
}) {
  return (
    <InputPrimitive.Root
      className={(state) =>
        cn(
          "w-full flex-row rounded-textarea border border-border bg-background text-foreground dark:bg-foreground/6",
          size === "lg"
            ? "min-h-13.5 px-4 py-3.5 text-[17px]"
            : "min-h-16 px-3 py-3 text-base",
          state.focused && "border-ring ring-1 ring-ring",
          state.invalid &&
            "border-[1.5px] border-destructive bg-destructive/5 ring-destructive dark:bg-destructive/10",
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
