import { cn } from "cn"
import type * as React from "react"
import { View, type ViewProps } from "react-native"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

function Panel({
  open,
  defaultOpen,
  onOpenChange,
  floating,
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

function PanelTrigger(props: React.ComponentProps<typeof DrawerTrigger>) {
  return <DrawerTrigger {...props} />
}

function PanelContent({
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DrawerContent>) {
  return <DrawerContent showCloseButton={showCloseButton} {...props} />
}

function PanelHeader(props: React.ComponentProps<typeof DrawerHeader>) {
  return <DrawerHeader {...props} />
}

function PanelTitle(props: React.ComponentProps<typeof DrawerTitle>) {
  return <DrawerTitle {...props} />
}

function PanelDescription(
  props: React.ComponentProps<typeof DrawerDescription>
) {
  return <DrawerDescription {...props} />
}

function PanelBody({ className, ...props }: ViewProps) {
  return <View className={cn("p-4", className)} {...props} />
}

function PanelFooter(props: React.ComponentProps<typeof DrawerFooter>) {
  return <DrawerFooter {...props} />
}

function PanelClose(props: React.ComponentProps<typeof DrawerClose>) {
  return <DrawerClose {...props} />
}

export {
  Panel,
  PanelBody,
  PanelClose,
  PanelContent,
  PanelDescription,
  PanelFooter,
  PanelHeader,
  PanelTitle,
  PanelTrigger,
}
