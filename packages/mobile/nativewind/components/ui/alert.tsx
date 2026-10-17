import { cn } from "cn"
import type { Icon as PhosphorIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

function Alert({
  className,
  variant = "default",
  children,
  icon,
  iconClassName,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>> & {
    icon?: PhosphorIcon
    variant?: "default" | "destructive"
    iconClassName?: string
  }) {
  const nodes = React.Children.toArray(children)
  const actions = nodes.filter(
    (node) => React.isValidElement(node) && node.type === AlertAction
  )
  const content = nodes.filter((node) => !actions.includes(node))
  return (
    <TextClassContext.Provider value="text-base text-foreground">
      <View
        role="alert"
        className={cn(
          "relative w-full flex-row gap-3 rounded-alert bg-muted p-5",
          actions.length > 0 && "pe-24",
          className
        )}
        {...props}
      >
        {icon ? (
          <Icon
            as={icon}
            className={cn(
              "mt-px size-5",
              variant === "destructive" ? "text-destructive" : "text-primary",
              iconClassName
            )}
          />
        ) : null}
        <View className="flex-1 gap-0.5">{content}</View>
        {actions}
      </View>
    </TextClassContext.Provider>
  )
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return <Text className={cn("font-title", className)} {...props} />
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return <Text className={cn("text-muted-foreground", className)} {...props} />
}

function AlertAction({
  className,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<React.ComponentRef<typeof View>>) {
  return <View className={cn("absolute end-4 top-4", className)} {...props} />
}

export { Alert, AlertAction, AlertDescription, AlertTitle }
