import { cn } from "cn"
import * as React from "react"
import { View } from "react-native"
import { Text, TextClassContext } from "@/components/ui/text"

type CardSize = "default" | "sm"

type CardVariant = "default" | "filled"

const CardSizeContext = React.createContext<CardSize>("default")

const SPACING_X: Record<CardSize, string> = { default: "px-6", sm: "px-4" }

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>> & {
    size?: CardSize
    variant?: CardVariant
  }) {
  return (
    <CardSizeContext.Provider value={size}>
      <TextClassContext.Provider value="text-base text-foreground">
        <View
          className={cn(
            "flex-col overflow-hidden rounded-card",
            size === "sm" ? "gap-4 py-4" : "gap-6 py-6",
            variant === "filled"
              ? "bg-muted"
              : "border border-foreground-5 bg-card shadow-card dark:border-foreground-10",
            className
          )}
          {...props}
        />
      </TextClassContext.Provider>
    </CardSizeContext.Provider>
  )
}

function CardHeader({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>>) {
  const size = React.useContext(CardSizeContext)
  const nodes = React.Children.toArray(children)
  const action = nodes.find(
    (node) => React.isValidElement(node) && node.type === CardAction
  )
  if (!action) {
    return (
      <View
        className={cn("flex-col gap-1.5", SPACING_X[size], className)}
        {...props}
      >
        {children}
      </View>
    )
  }
  return (
    <View
      className={cn("flex-row items-start gap-1.5", SPACING_X[size], className)}
      {...props}
    >
      <View className="flex-1 flex-col gap-1.5">
        {nodes.filter((node) => node !== action)}
      </View>
      {action}
    </View>
  )
}

function CardTitle({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof Text> &
  React.RefAttributes<React.ComponentRef<typeof Text>>) {
  return (
    <Text
      ref={ref}
      role="heading"
      className={cn("text-base font-title", className)}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text> &
  React.RefAttributes<React.ComponentRef<typeof Text>>) {
  return (
    <Text
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({
  className,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>>) {
  return <View className={cn("self-start", className)} {...props} />
}

function CardContent({
  className,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>>) {
  const size = React.useContext(CardSizeContext)
  return <View className={cn(SPACING_X[size], className)} {...props} />
}

function CardFooter({
  className,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>>) {
  const size = React.useContext(CardSizeContext)
  return (
    <View
      className={cn("flex-row items-center", SPACING_X[size], className)}
      {...props}
    />
  )
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
}
