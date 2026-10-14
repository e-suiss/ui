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
          "min-h-16 w-full flex-row rounded-xl border border-transparent bg-control px-3 py-3 text-base text-label",
          state.focused && "border-focus",
          state.invalid && "border-danger bg-danger-5 dark:bg-danger-10",
          state.disabled && "bg-control-disabled text-label-quaternary",
          resolveClassName(className, state)
        )
      }
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
      placeholderClassName={
        props.disabled ? "text-label-quaternary" : "text-label-secondary"
      }
      cursorColorClassName="text-accent"
      selectionColorClassName="text-accent"
      {...props}
    />
  )
}

export { Textarea }
