"use client"

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
import { cn } from "@/lib/utils"

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
  open: isOpen,
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
  const isMobile = useIsMobile()

  return (
    <ModalContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer
          data-slot="modal"
          floating={floating}
          showSwipeHandle
          open={isOpen}
          defaultOpen={defaultOpen}
          onOpenChange={(next) => onOpenChange?.(next)}
        >
          {children}
        </Drawer>
      ) : (
        <Dialog
          data-slot="modal"
          isOpen={isOpen}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          {children}
        </Dialog>
      )}
    </ModalContext.Provider>
  )
}

type ModalButtonProps = {
  render?: React.ReactElement
  className?: string
  children?: React.ReactNode
  id?: string
  "aria-label"?: string
}

function ModalTrigger({ render, ...props }: ModalButtonProps) {
  const { isMobile } = useModal()

  if (isMobile)
    return (
      <DrawerTrigger data-slot="modal-trigger" render={render} {...props} />
    )
  if (React.isValidElement(render))
    return React.cloneElement(
      render as React.ReactElement<Record<string, unknown>>,
      {
        "data-slot": "modal-trigger",
        ...props,
      }
    )

  return <DialogTrigger data-slot="modal-trigger" {...props} />
}

function ModalContent({
  showCloseButton = true,
  ...props
}: {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  showCloseButton?: boolean
  closeLabel?: string
  id?: string
  "aria-label"?: string
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

function ModalTitle(props: {
  className?: string
  children?: React.ReactNode
  id?: string
}) {
  const { isMobile } = useModal()
  const Title = isMobile ? DrawerTitle : DialogTitle

  return <Title data-slot="modal-title" {...props} />
}

function ModalDescription(props: {
  className?: string
  children?: React.ReactNode
  id?: string
}) {
  const { isMobile } = useModal()
  const Description = isMobile ? DrawerDescription : DialogDescription

  return <Description data-slot="modal-description" {...props} />
}

function ModalClose({ render, ...props }: ModalButtonProps) {
  const { isMobile } = useModal()

  if (isMobile)
    return <DrawerClose data-slot="modal-close" render={render} {...props} />
  if (React.isValidElement(render))
    return React.cloneElement(
      render as React.ReactElement<Record<string, unknown>>,
      {
        "data-slot": "modal-close",
        slot: "close",
        ...props,
      }
    )

  return <DialogClose data-slot="modal-close" {...props} />
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
