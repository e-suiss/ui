import { cn } from "cn"
import { cssInterop } from "nativewind"
import { TextInput } from "react-native"
import * as InputPrimitive from "@/components/primitives/input"
import { resolveClassName } from "@/components/primitives/use-render"

declare module "react-native" {
  interface TextInputProps {
    cursorColorClassName?: string
    selectionColorClassName?: string
  }
}

cssInterop(TextInput, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
  placeholderClassName: {
    target: false,
    nativeStyleToProp: { color: "placeholderTextColor" },
  },
  cursorColorClassName: {
    target: false,
    nativeStyleToProp: { color: "cursorColor" },
  },
  selectionColorClassName: {
    target: false,
    nativeStyleToProp: { color: "selectionColor" },
  },
})

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
          "w-full flex-row rounded-textarea border border-border bg-background text-foreground dark:bg-foreground-6",
          size === "lg"
            ? "min-h-[3.375rem] px-4 py-3.5 text-[17px]"
            : "min-h-16 px-3 py-3 text-base",
          state.focused && "border-ring",
          state.invalid &&
            "border-[1.5px] border-destructive bg-destructive-5 ring-0 dark:bg-destructive-10",
          state.disabled && "opacity-50",
          resolveClassName(className, state)
        )
      }
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      placeholderClassName="text-muted-foreground"
      cursorColorClassName="text-primary"
      selectionColorClassName="text-primary"
      {...props}
    />
  )
}

export { Textarea }
