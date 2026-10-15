import { cn } from "cn"
import * as React from "react"
import { View } from "react-native"
import * as AvatarPrimitive from "@/components/primitives/avatar"
import { resolveClassName } from "@/components/primitives/use-render"
import { IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

type AvatarSize = "default" | "sm" | "lg" | "xl"

const AvatarSizeContext = React.createContext<AvatarSize>("default")

const AvatarGroupItemContext = React.createContext<number | null>(null)

const ROOT_SIZE: Record<AvatarSize, string> = {
  sm: "size-6",
  default: "size-8",
  lg: "size-10",
  xl: "size-16",
}

const FALLBACK_TEXT: Record<AvatarSize, string> = {
  sm: "text-3xs",
  default: "text-xs",
  lg: "text-md",
  xl: "text-2xl",
}

const FALLBACK_ICON: Record<AvatarSize, string> = {
  sm: "size-3.5",
  default: "size-5",
  lg: "size-6",
  xl: "size-10",
}

const BADGE_SIZE: Record<AvatarSize, string> = {
  sm: "size-3",
  default: "size-4",
  lg: "size-4.5",
  xl: "size-5.5",
}

const BADGE_ICON: Record<AvatarSize, string> = {
  sm: "size-0",
  default: "size-2",
  lg: "size-2.5",
  xl: "size-3",
}

const COUNT_ICON: Record<AvatarSize, string> = {
  sm: "size-3",
  default: "size-4",
  lg: "size-5",
  xl: "size-7",
}

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: AvatarSize
}) {
  const groupIndex = React.useContext(AvatarGroupItemContext)
  const grouped = groupIndex !== null
  return (
    <AvatarSizeContext.Provider value={size}>
      <AvatarGroupItemContext.Provider value={null}>
        <AvatarPrimitive.Root
          className={(state) =>
            cn(
              "relative shrink-0 rounded-full",
              ROOT_SIZE[size],
              grouped && "border-2 border-background",
              grouped && groupIndex > 0 && (size === "xl" ? "-ms-4" : "-ms-2"),
              resolveClassName(className, state)
            )
          }
          {...props}
        />
      </AvatarGroupItemContext.Provider>
    </AvatarSizeContext.Provider>
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
      resizeMode="cover"
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  const size = React.useContext(AvatarSizeContext)
  return (
    <TextClassContext.Provider
      value={cn(
        "font-semibold uppercase text-primary-foreground",
        FALLBACK_TEXT[size]
      )}
    >
      <IconClassContext.Provider value={FALLBACK_ICON[size]}>
        <AvatarPrimitive.Fallback
          className={(state) =>
            cn(
              "size-full flex-row items-center justify-center rounded-full bg-muted-foreground dark:bg-muted-foreground/60",
              resolveClassName(className, state)
            )
          }
          {...props}
        >
          {typeof children === "string" || typeof children === "number" ? (
            <Text>{children}</Text>
          ) : (
            children
          )}
        </AvatarPrimitive.Fallback>
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

function AvatarBadge({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  const size = React.useContext(AvatarSizeContext)
  return (
    <TextClassContext.Provider value="text-primary-foreground">
      <IconClassContext.Provider value={BADGE_ICON[size]}>
        <View
          className={cn(
            "absolute -end-0.5 -bottom-0.5 z-10 items-center justify-center rounded-full border-2 border-background bg-primary",
            BADGE_SIZE[size],
            className
          )}
          {...props}
        >
          {size === "sm" ? null : children}
        </View>
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

function AvatarGroup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  let index = 0
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    const value = index
    index += 1
    return (
      <AvatarGroupItemContext.Provider value={value}>
        {child}
      </AvatarGroupItemContext.Provider>
    )
  })
  return (
    <View className={cn("flex-row items-center", className)} {...props}>
      {items}
    </View>
  )
}

function AvatarGroupCount({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    size?: AvatarSize
  }) {
  const groupIndex = React.useContext(AvatarGroupItemContext)
  return (
    <TextClassContext.Provider
      value={cn("font-semibold text-foreground", FALLBACK_TEXT[size])}
    >
      <IconClassContext.Provider value={COUNT_ICON[size]}>
        <View
          className={cn(
            "relative shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted",
            ROOT_SIZE[size],
            groupIndex !== null &&
              groupIndex > 0 &&
              (size === "xl" ? "-ms-4" : "-ms-2"),
            className
          )}
          {...props}
        />
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
}
