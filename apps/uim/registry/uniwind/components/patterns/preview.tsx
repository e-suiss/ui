import { cn } from "cn"
import type * as React from "react"
import { View } from "react-native"
import { resolveClassName } from "@/components/primitives/use-render"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Text, TextClassContext } from "@/components/ui/text"

function Preview({
  open,
  defaultOpen,
  onOpenChange,
  floating = true,
  children,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  floating?: boolean
  children?: React.ReactNode
}) {
  return (
    <Drawer
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(next) => onOpenChange?.(next)}
      floating={floating}
      showSwipeHandle
    >
      {children}
    </Drawer>
  )
}

function PreviewTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerTrigger>) {
  return (
    <TextClassContext.Provider value="text-link">
      <DrawerTrigger
        className={(state) =>
          cn("self-start active:opacity-60", resolveClassName(className, state))
        }
        {...props}
      >
        {typeof children === "string" || typeof children === "number" ? (
          <Text>{children}</Text>
        ) : (
          children
        )}
      </DrawerTrigger>
    </TextClassContext.Provider>
  )
}

function PreviewContent({
  showCloseButton,
  closeLabel,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof DrawerContent>, "className"> & {
  className?: string
}) {
  return (
    <DrawerContent
      showCloseButton={showCloseButton}
      closeLabel={closeLabel}
      {...props}
    >
      <View
        className={cn(
          "p-4",
          showCloseButton && "pe-14",
          showCloseButton && closeLabel && "pe-24",
          className
        )}
      >
        {children}
      </View>
    </DrawerContent>
  )
}

export { Preview, PreviewContent, PreviewTrigger }
