import { cn } from "cn"
import * as SeparatorPrimitive from "@/components/primitives/separator"
import { resolveClassName } from "@/components/primitives/use-render"

function Separator({
  className,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      className={(state) =>
        cn(
          "shrink-0 bg-border",
          state.orientation === "horizontal"
            ? "h-px w-full"
            : "w-px self-stretch",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

export { Separator }
