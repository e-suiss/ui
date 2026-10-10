import * as TabsPrimitive from "@rn-primitives/tabs"
import { cn } from "cn"
import { TextClassContext } from "@/components/ui/text"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "h-9 flex-row items-center justify-center rounded-full bg-muted p-1",
        "self-start",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { value } = TabsPrimitive.useRootContext()
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm font-medium text-foreground/60 dark:text-muted-foreground",
        value === props.value && "text-foreground dark:text-foreground"
      )}
    >
      <TabsPrimitive.Trigger
        className={cn(
          "flex-row items-center justify-center gap-2 rounded-full border border-transparent px-3 py-1",
          props.disabled && "opacity-50",
          props.value === value && "bg-background dark:bg-input/30",
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn(className)} {...props} />
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
