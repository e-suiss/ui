"use client"

import { cn } from "cn"
import * as React from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { useIsMobile } from "@/hooks/use-mobile"

type ModalContextProps = {
  isMobile: boolean
}

const ModalContext = React.createContext<ModalContextProps | null>(null)

function useModal() {
  const context = React.useContext(ModalContext)

  if (!context) {
    throw new Error("useModal must be used within a <Modal />")
  }

  return context
}

function Modal({
  open,
  defaultOpen,
  onOpenChange,
  floating,
  children,
}: Pick<
  React.ComponentProps<typeof Dialog>,
  "open" | "defaultOpen" | "children"
> & {
  onOpenChange?: (open: boolean) => void
  floating?: boolean
}) {
  const isMobile = useIsMobile()
  const rootProps = {
    open,
    defaultOpen,
    onOpenChange: (next: boolean) => onOpenChange?.(next),
    children,
  }

  return (
    <ModalContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer
          data-slot="modal"
          floating={floating}
          showSwipeHandle
          {...rootProps}
        />
      ) : (
        <Dialog data-slot="modal" {...rootProps} />
      )}
    </ModalContext.Provider>
  )
}

function ModalTrigger(
  props: Omit<
    React.ComponentProps<typeof DialogTrigger>,
    "handle" | "className"
  > & {
    className?: string
  }
) {
  const { isMobile } = useModal()
  const Trigger = isMobile ? DrawerTrigger : DialogTrigger

  return <Trigger data-slot="modal-trigger" {...props} />
}

function ModalContent({
  showCloseButton = true,
  ...props
}: Omit<
  React.ComponentProps<typeof DialogContent>,
  "className" | "style" | "render"
> & {
  className?: string
  style?: React.CSSProperties
}) {
  const { isMobile } = useModal()

  if (isMobile) {
    return (
      <DrawerContent
        data-slot="modal-content"
        showCloseButton={showCloseButton}
        {...props}
      />
    )
  }

  return (
    <DialogContent
      data-slot="modal-content"
      showCloseButton={showCloseButton}
      {...props}
    />
  )
}

function ModalHeader(props: React.ComponentProps<"div">) {
  const { isMobile } = useModal()
  const Header = isMobile ? DrawerHeader : DialogHeader

  return <Header data-slot="modal-header" {...props} />
}

function ModalBody({ className, ...props }: React.ComponentProps<"div">) {
  const { isMobile } = useModal()

  return (
    <div
      data-slot="modal-body"
      className={cn(isMobile && "p-4", className)}
      {...props}
    />
  )
}

function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  const { isMobile } = useModal()

  if (isMobile) {
    return (
      <DrawerFooter
        data-slot="modal-footer"
        className={cn("flex-col-reverse", className)}
        {...props}
      />
    )
  }

  return (
    <DialogFooter data-slot="modal-footer" className={className} {...props} />
  )
}

function ModalTitle(props: React.ComponentProps<typeof DialogTitle>) {
  const { isMobile } = useModal()
  const Title = isMobile ? DrawerTitle : DialogTitle

  return <Title data-slot="modal-title" {...props} />
}

function ModalDescription(
  props: React.ComponentProps<typeof DialogDescription>
) {
  const { isMobile } = useModal()
  const Description = isMobile ? DrawerDescription : DialogDescription

  return <Description data-slot="modal-description" {...props} />
}

function ModalClose(props: React.ComponentProps<typeof DialogClose>) {
  const { isMobile } = useModal()
  const Close = isMobile ? DrawerClose : DialogClose

  return <Close data-slot="modal-close" {...props} />
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
