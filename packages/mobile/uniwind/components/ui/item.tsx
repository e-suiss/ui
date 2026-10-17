import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"
import { Pressable, View, type ViewProps } from "react-native"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"
import { IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

type ItemSize = "default" | "sm" | "xs"

const ItemGroupContext = React.createContext<{ inset: boolean }>({
  inset: false,
})

const ItemContext = React.createContext<{ size: ItemSize }>({
  size: "default",
})

function ItemGroup({
  className,
  variant = "default",
  ...props
}: ViewProps & { variant?: "default" | "inset" }) {
  const inset = variant === "inset"
  const contextValue = React.useMemo(() => ({ inset }), [inset])
  return (
    <ItemGroupContext.Provider value={contextValue}>
      <View
        role="list"
        className={cn(
          "w-full flex-col gap-4",
          inset && "gap-0 overflow-hidden rounded-2xl bg-muted",
          className
        )}
        {...props}
      />
    </ItemGroupContext.Provider>
  )
}

function ItemSeparator({ className, ...props }: ViewProps) {
  const { inset } = React.useContext(ItemGroupContext)
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      className={cn(
        "my-2 h-px shrink-0 bg-border",
        inset && "my-0 ms-4",
        className
      )}
      {...props}
    />
  )
}

const itemVariants = cva(
  "w-full flex-row flex-wrap items-center rounded-item border",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
        muted: "border-transparent bg-muted/50",
      },
      size: {
        default: "gap-3.5 px-4 py-3.5",
        sm: "gap-3.5 px-3.5 py-3",
        xs: "gap-2.5 px-3 py-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ItemProps = React.ComponentProps<typeof Pressable> &
  VariantProps<typeof itemVariants> & {
    render?: RenderProp<Record<string, unknown>, Record<string, never>>
  }

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: ItemProps) {
  const { inset } = React.useContext(ItemGroupContext)
  const interactive = Boolean(props.onPress || props.onLongPress)
  const contextValue = React.useMemo(
    () => ({ size: size ?? "default" }),
    [size]
  )
  const element = useRender({
    defaultComponent: interactive ? Pressable : View,
    render,
    props: [
      {
        role: interactive ? "button" : "listitem",
        className: cn(
          itemVariants({ variant, size }),
          inset && "rounded-none",
          interactive && "active:opacity-80",
          props.disabled && "opacity-50",
          className
        ),
      },
      props,
    ],
  })
  return (
    <ItemContext.Provider value={contextValue}>{element}</ItemContext.Provider>
  )
}

const itemMediaVariants = cva(
  "shrink-0 flex-row items-center justify-center gap-2",
  {
    variants: {
      variant: {
        default: "",
        icon: "",
        image: "size-10 overflow-hidden rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: ViewProps & VariantProps<typeof itemMediaVariants>) {
  const { size } = React.useContext(ItemContext)
  return (
    <IconClassContext.Provider
      value={variant === "icon" ? "size-4" : undefined}
    >
      <View
        className={cn(
          itemMediaVariants({ variant }),
          variant === "image" && size === "sm" && "size-8",
          variant === "image" && size === "xs" && "size-6 rounded-sm",
          className
        )}
        {...props}
      />
    </IconClassContext.Provider>
  )
}

function ItemContent({ className, ...props }: ViewProps) {
  const { size } = React.useContext(ItemContext)
  return (
    <View
      className={cn(
        "min-w-0 flex-1 flex-col gap-1",
        size === "xs" && "gap-0.5",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({
  className,
  numberOfLines = 1,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function ItemDescription({
  className,
  numberOfLines = 2,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={cn("text-start text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-base text-muted-foreground">
      <View
        className={cn("flex-row items-center gap-2", className)}
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function ItemHeader({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "w-full flex-row items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "w-full flex-row items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemGroupContext,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
}
