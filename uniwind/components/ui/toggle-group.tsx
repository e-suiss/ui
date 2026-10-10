import type { VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"
import * as TogglePrimitive from "@/components/primitives/toggle"
import * as ToggleGroupPrimitive from "@/components/primitives/toggle-group"
import { resolveClassName } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<VariantProps<
  typeof toggleVariants
> | null>(null)

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      className={(state) =>
        cn(
          "flex-row items-center gap-2 self-start",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function useToggleGroupContext() {
  const context = React.useContext(ToggleGroupContext)
  if (context === null) {
    throw new Error(
      "ToggleGroup compound components cannot be rendered outside the ToggleGroup component"
    )
  }
  return context
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  isFirst,
  isLast,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    isFirst?: boolean
    isLast?: boolean
  }) {
  const context = useToggleGroupContext()

  return (
    <TextClassContext.Provider value="text-sm font-medium text-foreground">
      <TogglePrimitive.Root
        className={(state) =>
          cn(
            toggleVariants({
              variant: context.variant || variant,
              size: context.size || size,
            }),
            state.disabled && "opacity-50",
            state.pressed && "bg-muted",
            "shrink-0",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        {children}
      </TogglePrimitive.Root>
    </TextClassContext.Provider>
  )
}

function ToggleGroupIcon({
  className,
  ...props
}: React.ComponentProps<typeof Icon>) {
  const textClass = React.useContext(TextClassContext)
  return (
    <Icon className={cn("size-4 shrink-0", textClass, className)} {...props} />
  )
}

export { ToggleGroup, ToggleGroupIcon, ToggleGroupItem }
