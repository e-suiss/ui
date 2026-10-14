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
          state.invalid && "border-danger bg-danger-5 dark:bg-danger-10",
          state.disabled && "bg-control-disabled text-label-quaternary",
          resolveClassName(className, state)
        )
      }
      placeholderClassName={
        props.disabled ? "text-label-quaternary" : "text-label-secondary"
      }
      cursorColorClassName="text-accent"
      selectionColorClassName="text-accent"
      {...props}
    />
  )
}

export { Input }
