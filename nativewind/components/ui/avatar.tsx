import { cn } from "cn"
import * as AvatarPrimitive from "@/components/primitives/avatar"
import { resolveClassName } from "@/components/primitives/use-render"
import { TextClassContext } from "@/components/ui/text"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={(state) =>
        cn(
          "relative flex size-8 shrink-0 overflow-hidden rounded-full",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={(state) =>
        cn(
          "aspect-square size-full rounded-full",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <TextClassContext.Provider value="text-sm text-muted-foreground">
      <AvatarPrimitive.Fallback
        className={(state) =>
          cn(
            "size-full flex-row items-center justify-center rounded-full bg-muted",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </TextClassContext.Provider>
  )
}

export { Avatar, AvatarFallback, AvatarImage }
