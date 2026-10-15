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
          "min-h-16 w-full flex-row rounded-xl border border-transparent bg-secondary px-3 py-3 text-base text-secondary-foreground",
          state.focused && "border-ring",
          state.invalid &&
            "border-destructive bg-destructive-5 dark:bg-destructive-10",
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
