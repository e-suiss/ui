import { cn } from "cn"
import type { Icon as PhosphorIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

function Alert({
  className,
  variant,
  children,
  icon,
  iconClassName,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    icon: PhosphorIcon
    variant?: "default" | "destructive"
    iconClassName?: string
  }) {
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm text-card-foreground",
        variant === "destructive" && "text-destructive",
        className
      )}
    >
      <View
        role="alert"
        className={cn(
          "relative w-full gap-0.5 rounded-2xl border border-border bg-card px-4 py-3",
          className
        )}
        {...props}
      >
        <View className="absolute top-3.5 left-4">
          <Icon
            as={icon}
            className={cn(
              "size-4",
              variant === "destructive" && "text-destructive",
              iconClassName
            )}
          />
        </View>
        {children}
      </View>
    </TextClassContext.Provider>
  )
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn("ml-0.5 pl-6 font-medium", className)} {...props} />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  const textClass = React.useContext(TextClassContext)
  return (
    <Text
      className={cn(
        "ml-0.5 pl-6 text-sm text-muted-foreground",
        textClass?.includes("text-destructive") && "text-destructive/90",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertDescription, AlertTitle }
