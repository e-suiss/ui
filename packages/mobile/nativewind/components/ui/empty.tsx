import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { View, type ViewProps } from "react-native"
import { IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

function Empty({ className, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-center">
      <View
        className={cn(
          "w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-2xl p-12",
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function EmptyHeader({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("w-full max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  )
}

const emptyMediaVariants = cva("mb-2 shrink-0 items-center justify-center", {
  variants: {
    variant: {
      default: "bg-transparent",
      icon: "size-10 rounded-lg bg-muted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: ViewProps & VariantProps<typeof emptyMediaVariants>) {
  return (
    <IconClassContext.Provider
      value={variant === "icon" ? "size-5 text-foreground" : undefined}
    >
      <View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        className={cn(emptyMediaVariants({ variant }), className)}
        {...props}
      />
    </IconClassContext.Provider>
  )
}

function EmptyTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      role="heading"
      className={cn(
        "text-center text-lg font-semibold text-foreground",
        className
      )}
      {...props}
    />
  )
}

function EmptyDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "w-full max-w-sm min-w-0 flex-col items-center gap-4",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
}
