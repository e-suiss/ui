import * as AvatarPrimitive from "@rn-primitives/avatar"
import { cn } from "cn"
import { TextClassContext } from "@/components/ui/text"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
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
      className={cn("aspect-square size-full rounded-full", className)}
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
        className={cn(
          "size-full flex-row items-center justify-center rounded-full bg-muted",
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  )
}

export { Avatar, AvatarFallback, AvatarImage }
