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

type AdaptiveDialogContextProps = {
  isMobile: boolean
}

const AdaptiveDialogContext =
  React.createContext<AdaptiveDialogContextProps | null>(null)

function useAdaptiveDialog() {
  const context = React.useContext(AdaptiveDialogContext)

  if (!context) {
    throw new Error(
      "useAdaptiveDialog must be used within a <AdaptiveDialog />"
    )
  }

  return context
}

function AdaptiveDialog({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: Pick<
  React.ComponentProps<typeof Dialog>,
  "open" | "defaultOpen" | "children"
> & {
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const rootProps = {
    open,
    defaultOpen,
    onOpenChange: (next: boolean) => onOpenChange?.(next),
    children,
  }

  return (
    <AdaptiveDialogContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer data-slot="adaptive-dialog" showSwipeHandle {...rootProps} />
      ) : (
        <Dialog data-slot="adaptive-dialog" {...rootProps} />
      )}
    </AdaptiveDialogContext.Provider>
  )
}

function AdaptiveDialogTrigger(
  props: Omit<
    React.ComponentProps<typeof DialogTrigger>,
    "handle" | "className"
  > & {
    className?: string
  }
) {
  const { isMobile } = useAdaptiveDialog()
  const Trigger = isMobile ? DrawerTrigger : DialogTrigger

  return <Trigger data-slot="adaptive-dialog-trigger" {...props} />
}

function AdaptiveDialogContent({
  showCloseButton,
  ...props
}: Omit<
  React.ComponentProps<typeof DialogContent>,
  "className" | "style" | "render"
> & {
  className?: string
  style?: React.CSSProperties
}) {
  const { isMobile } = useAdaptiveDialog()

  if (isMobile) {
    return <DrawerContent data-slot="adaptive-dialog-content" {...props} />
  }

  return (
    <DialogContent
      data-slot="adaptive-dialog-content"
      showCloseButton={showCloseButton}
      {...props}
    />
  )
}

function AdaptiveDialogHeader(props: React.ComponentProps<"div">) {
  const { isMobile } = useAdaptiveDialog()
  const Header = isMobile ? DrawerHeader : DialogHeader

  return <Header data-slot="adaptive-dialog-header" {...props} />
}

function AdaptiveDialogBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isMobile } = useAdaptiveDialog()

  return (
    <div
      data-slot="adaptive-dialog-body"
      className={cn(isMobile && "p-4", className)}
      {...props}
    />
  )
}

function AdaptiveDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isMobile } = useAdaptiveDialog()

  if (isMobile) {
    return (
      <DrawerFooter
        data-slot="adaptive-dialog-footer"
        className={cn("flex-col-reverse", className)}
        {...props}
      />
    )
  }

  return (
    <DialogFooter
      data-slot="adaptive-dialog-footer"
      className={className}
      {...props}
    />
  )
}

function AdaptiveDialogTitle(props: React.ComponentProps<typeof DialogTitle>) {
  const { isMobile } = useAdaptiveDialog()
  const Title = isMobile ? DrawerTitle : DialogTitle

  return <Title data-slot="adaptive-dialog-title" {...props} />
}

function AdaptiveDialogDescription(
  props: React.ComponentProps<typeof DialogDescription>
) {
  const { isMobile } = useAdaptiveDialog()
  const Description = isMobile ? DrawerDescription : DialogDescription

  return <Description data-slot="adaptive-dialog-description" {...props} />
}

function AdaptiveDialogClose(props: React.ComponentProps<typeof DialogClose>) {
  const { isMobile } = useAdaptiveDialog()
  const Close = isMobile ? DrawerClose : DialogClose

  return <Close data-slot="adaptive-dialog-close" {...props} />
}

export {
  AdaptiveDialog,
  AdaptiveDialogBody,
  AdaptiveDialogClose,
  AdaptiveDialogContent,
  AdaptiveDialogDescription,
  AdaptiveDialogFooter,
  AdaptiveDialogHeader,
  AdaptiveDialogTitle,
  AdaptiveDialogTrigger,
}
