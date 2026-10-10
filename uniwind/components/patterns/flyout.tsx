import { cn } from "cn"
import type * as React from "react"
import { View, type ViewProps } from "react-native"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

type Side = "top" | "right" | "bottom" | "left"

type Align = "start" | "center" | "end"

function Flyout({
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

function FlyoutTrigger(props: React.ComponentProps<typeof DrawerTrigger>) {
  return <DrawerTrigger {...props} />
}

function FlyoutContent({
  align: _align,
  alignOffset: _alignOffset,
  side: _side,
  sideOffset: _sideOffset,
  ...props
}: React.ComponentProps<typeof DrawerContent> & {
  align?: Align
  alignOffset?: number
  side?: Side
  sideOffset?: number
}) {
  return <DrawerContent {...props} />
}

function FlyoutHeader(props: React.ComponentProps<typeof DrawerHeader>) {
  return <DrawerHeader {...props} />
}

function FlyoutTitle(props: React.ComponentProps<typeof DrawerTitle>) {
  return <DrawerTitle {...props} />
}

function FlyoutDescription(
  props: React.ComponentProps<typeof DrawerDescription>
) {
  return <DrawerDescription {...props} />
}

function FlyoutBody({ className, ...props }: ViewProps) {
  return <View className={cn("p-4", className)} {...props} />
}

function FlyoutClose(props: React.ComponentProps<typeof DrawerClose>) {
  return <DrawerClose {...props} />
}

export {
  Flyout,
  FlyoutBody,
  FlyoutClose,
  FlyoutContent,
  FlyoutDescription,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutTrigger,
}
