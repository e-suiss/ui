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

function Modal({
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

function ModalTrigger(props: React.ComponentProps<typeof DrawerTrigger>) {
  return <DrawerTrigger {...props} />
}

function ModalContent({
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DrawerContent>) {
  return <DrawerContent showCloseButton={showCloseButton} {...props} />
}

function ModalHeader(props: React.ComponentProps<typeof DrawerHeader>) {
  return <DrawerHeader {...props} />
}

function ModalBody({ className, ...props }: ViewProps) {
  return <View className={cn("p-4", className)} {...props} />
}

function ModalFooter({ className, ...props }: ViewProps) {
  return (
    <DrawerFooter className={cn("flex-col-reverse", className)} {...props} />
  )
}

function ModalTitle(props: React.ComponentProps<typeof DrawerTitle>) {
  return <DrawerTitle {...props} />
}

function ModalDescription(
  props: React.ComponentProps<typeof DrawerDescription>
) {
  return <DrawerDescription {...props} />
}

function ModalClose(props: React.ComponentProps<typeof DrawerClose>) {
  return <DrawerClose {...props} />
}

export {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
}
