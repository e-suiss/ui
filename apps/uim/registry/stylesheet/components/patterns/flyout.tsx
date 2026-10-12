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

function FlyoutContent(props: React.ComponentProps<typeof DrawerContent>) {
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

function FlyoutBody({ style, ...props }: ViewProps) {
  return <View style={[{ padding: 16 }, style]} {...props} />
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
