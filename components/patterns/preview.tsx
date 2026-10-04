"use client"

import { cn } from "cn"
import * as React from "react"

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useIsMobile } from "@/hooks/use-mobile"

type PreviewContextProps = {
  isMobile: boolean
}

const PreviewContext = React.createContext<PreviewContextProps | null>(null)

function usePreview() {
  const context = React.useContext(PreviewContext)

  if (!context) {
    throw new Error("usePreview must be used within a <Preview />")
  }

  return context
}

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
  const isMobile = useIsMobile()
  const rootProps = {
    open,
    defaultOpen,
    onOpenChange: (next: boolean) => onOpenChange?.(next),
    children,
  }

  return (
    <PreviewContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer
          data-slot="preview"
          floating={floating}
          showSwipeHandle
          {...rootProps}
        />
      ) : (
        <HoverCard data-slot="preview" {...rootProps} />
      )}
    </PreviewContext.Provider>
  )
}

function PreviewTrigger({
  href,
  className,
  children,
}: {
  href?: string
  className?: string
  children?: React.ReactNode
}) {
  const { isMobile } = usePreview()

  if (isMobile) {
    return (
      <DrawerTrigger
        data-slot="preview-trigger"
        className={cn(
          "cursor-pointer text-link underline-offset-4 outline-none focus-visible:focus-ring",
          className
        )}
      >
        {children}
      </DrawerTrigger>
    )
  }

  return (
    <HoverCardTrigger
      data-slot="preview-trigger"
      href={href}
      className={cn(
        "text-link underline-offset-4 outline-none hover:underline focus-visible:focus-ring",
        className
      )}
    >
      {children}
    </HoverCardTrigger>
  )
}

function PreviewContent({
  align,
  side,
  showCloseButton,
  closeLabel,
  className,
  children,
}: Pick<React.ComponentProps<typeof HoverCardContent>, "align" | "side"> & {
  showCloseButton?: boolean
  closeLabel?: string
  className?: string
  children?: React.ReactNode
}) {
  const { isMobile } = usePreview()

  if (isMobile) {
    return (
      <DrawerContent
        data-slot="preview-content"
        showCloseButton={showCloseButton}
        closeLabel={closeLabel}
      >
        <div
          className={cn(
            "p-4",
            showCloseButton && "pe-14",
            showCloseButton && closeLabel && "pe-24",
            className
          )}
        >
          {children}
        </div>
      </DrawerContent>
    )
  }

  return (
    <HoverCardContent
      data-slot="preview-content"
      align={align}
      side={side}
      className={className}
    >
      {children}
    </HoverCardContent>
  )
}

export { Preview, PreviewContent, PreviewTrigger }
