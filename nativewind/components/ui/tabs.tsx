import { cn } from "cn"
import * as TabsPrimitive from "@/components/primitives/tabs"
import { resolveClassName } from "@/components/primitives/use-render"
import { TextClassContext } from "@/components/ui/text"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={(state) =>
        cn("flex flex-col gap-2", resolveClassName(className, state))
      }
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
      className={(state) =>
        cn(
          "h-9 flex-row items-center justify-center rounded-full bg-muted p-1",
          "self-start",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Tab>) {
  const { value } = TabsPrimitive.useRootContext()
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm font-medium text-foreground-60 dark:text-muted-foreground",
        value === props.value && "text-foreground dark:text-foreground"
      )}
    >
      <TabsPrimitive.Tab
        className={(state) =>
          cn(
            "flex-row items-center justify-center gap-2 rounded-full border border-transparent px-3 py-1",
            state.disabled && "opacity-50",
            state.active && "bg-background dark:bg-input-30",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function TabsContent(props: React.ComponentProps<typeof TabsPrimitive.Panel>) {
  return <TabsPrimitive.Panel {...props} />
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
