"use client"

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
import { cn } from "@/lib/utils"

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
  isOpen,
  defaultOpen,
  onOpenChange,
  floating,
  children,
}: {
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  floating?: boolean
  children?: React.ReactNode
}) {
  const isMobile = useIsMobile()

  return (
    <PanelContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer
          data-slot="panel"
          floating={floating}
          showSwipeHandle
          open={isOpen}
          defaultOpen={defaultOpen}
          onOpenChange={(next) => onOpenChange?.(next)}
        >
          {children}
        </Drawer>
      ) : (
        <Sheet
          data-slot="panel"
          isOpen={isOpen}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          {children}
        </Sheet>
      )}
    </PanelContext.Provider>
  )
}

type PanelButtonProps = {
  className?: string
  children?: React.ReactNode
  id?: string
  "aria-label"?: string
}

function PanelTrigger(props: PanelButtonProps) {
  const { isMobile } = usePanel()
  const Trigger = isMobile ? DrawerTrigger : SheetTrigger

  return <Trigger data-slot="panel-trigger" {...props} />
}

function PanelContent({
  side = "right",
  showCloseButton = true,
  closeLabel,
  ...props
}: {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  id?: string
  "aria-label"?: string
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

function PanelTitle(props: {
  className?: string
  children?: React.ReactNode
  id?: string
}) {
  const { isMobile } = usePanel()
  const Title = isMobile ? DrawerTitle : SheetTitle

  return <Title data-slot="panel-title" {...props} />
}

function PanelDescription(props: {
  className?: string
  children?: React.ReactNode
  id?: string
}) {
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

function PanelClose(props: PanelButtonProps) {
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
