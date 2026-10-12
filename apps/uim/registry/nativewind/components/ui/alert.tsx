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
  React.RefAttributes<View> & {
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
    <TextClassContext.Provider value="text-base text-label">
      <View
        role="alert"
        className={cn(
          "relative w-full flex-row gap-3 rounded-2xl bg-surface-secondary p-5",
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
              variant === "destructive" ? "text-danger" : "text-accent",
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
  return <Text className={cn("font-semibold", className)} {...props} />
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return <Text className={cn("text-label-secondary", className)} {...props} />
}

function AlertAction({
  className,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View className={cn("absolute end-4 top-4", className)} {...props} />
}

export { Alert, AlertAction, AlertDescription, AlertTitle }
