"use client"

import { cn } from "cn"
import * as React from "react"

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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

type PanelContextProps = {
  isMobile: boolean
}

const PanelContext = React.createContext<PanelContextProps | null>(null)

function usePanel() {
  const context = React.useContext(PanelContext)

  if (!context) {
    throw new Error("usePanel must be used within a <Panel />")
  }

  return context
}

function Panel({
  open,
  defaultOpen,
  onOpenChange,
  floating,
  children,
}: Pick<
  React.ComponentProps<typeof Sheet>,
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
    <PanelContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer
          data-slot="panel"
          floating={floating}
          showSwipeHandle
          {...rootProps}
        />
      ) : (
        <Sheet data-slot="panel" {...rootProps} />
      )}
    </PanelContext.Provider>
  )
}

function PanelTrigger(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    render?: React.ReactElement
  }
) {
  const { isMobile } = usePanel()
  const Trigger = isMobile ? DrawerTrigger : SheetTrigger

  return <Trigger data-slot="panel-trigger" {...props} />
}

function PanelContent({
  side = "right",
  showCloseButton = true,
  closeLabel,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  closeLabel?: string
}) {
  const { isMobile } = usePanel()

  if (isMobile) {
    return (
      <DrawerContent
        data-slot="panel-content"
        showCloseButton={showCloseButton}
        closeLabel={closeLabel}
        {...props}
      />
    )
  }

  return (
    <SheetContent
      data-slot="panel-content"
      side={side}
      showCloseButton={showCloseButton}
      closeLabel={closeLabel}
      {...props}
    />
  )
}

function PanelHeader(props: React.ComponentProps<"div">) {
  const { isMobile } = usePanel()
  const Header = isMobile ? DrawerHeader : SheetHeader

  return <Header data-slot="panel-header" {...props} />
}

function PanelTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  const { isMobile } = usePanel()
  const Title = isMobile ? DrawerTitle : SheetTitle

  return <Title data-slot="panel-title" {...props} />
}

function PanelDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  const { isMobile } = usePanel()
  const Description = isMobile ? DrawerDescription : SheetDescription

  return <Description data-slot="panel-description" {...props} />
}

function PanelBody({ className, ...props }: React.ComponentProps<"div">) {
  const { isMobile } = usePanel()

  return (
    <div
      data-slot="panel-body"
      className={cn(isMobile ? "p-4" : "px-6", className)}
      {...props}
    />
  )
}

function PanelFooter(props: React.ComponentProps<"div">) {
  const { isMobile } = usePanel()
  const Footer = isMobile ? DrawerFooter : SheetFooter

  return <Footer data-slot="panel-footer" {...props} />
}

function PanelClose(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    render?: React.ReactElement
  }
) {
  const { isMobile } = usePanel()
  const Close = isMobile ? DrawerClose : SheetClose

  return <Close data-slot="panel-close" {...props} />
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
