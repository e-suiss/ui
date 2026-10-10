import { cn } from "cn"
import * as SwitchPrimitives from "@/components/primitives/switch"
import { resolveClassName } from "@/components/primitives/use-render"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      className={(state) =>
        cn(
          "h-5 w-11 shrink-0 flex-row items-center rounded-full border-2",
          state.checked
            ? "border-primary bg-primary"
            : "border-transparent bg-input/90",
          state.disabled && "opacity-50",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={(state) =>
          cn(
            "h-4 w-6 rounded-full bg-background shadow-sm",
            state.checked
              ? "translate-x-4 dark:bg-primary-foreground"
              : "dark:bg-foreground translate-x-0"
          )
        }
      />
    </SwitchPrimitives.Root>
  )
}

export { Switch }
