import { cn } from "cn"
import { cssInterop } from "nativewind"
import { TextInput } from "react-native"
import { useInsetContext } from "@/components/primitives/field"
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

type InputSize = "sm" | "md" | "default" | "lg"

function Input({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof InputPrimitive.Root> & {
  size?: InputSize
}) {
  const inset = useInsetContext()
  return (
    <InputPrimitive.Root
      className={(state) =>
        cn(
          "w-full min-w-0 flex-row items-center rounded-input border border-border bg-background py-1 text-[16px] text-foreground dark:bg-foreground-6",
          size === "lg"
            ? "h-[3.375rem] px-4 text-[17px]"
            : "h-input px-input-x",
          size === "md" && "h-9 text-[14px]",
          size === "sm" && "h-8 rounded-md px-2.5 text-[14px]",
          state.focused && "border-ring",
          state.invalid &&
            "border-[1.5px] border-destructive bg-destructive-5 ring-0 dark:bg-destructive-10",
          inset && "border-0 bg-transparent ring-0 dark:bg-transparent",
          state.disabled && "opacity-50",
          resolveClassName(className, state)
        )
      }
      placeholderClassName="text-muted-foreground"
      cursorColorClassName="text-primary"
      selectionColorClassName="text-primary"
      {...props}
    />
  )
}

export { Input }
