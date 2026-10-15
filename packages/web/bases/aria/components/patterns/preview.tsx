"use client"

import * as React from "react"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

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
  isOpen,
  defaultOpen,
  onOpenChange,
  floating = true,
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
    <PreviewContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer
          data-slot="preview"
          floating={floating}
          showSwipeHandle
          open={isOpen}
          defaultOpen={defaultOpen}
          onOpenChange={(next) => onOpenChange?.(next)}
        >
          {children}
        </Drawer>
      ) : (
        <HoverCard
          data-slot="preview"
          isOpen={isOpen}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          {children}
        </HoverCard>
      )}
    </PreviewContext.Provider>
  )
}

function PreviewTrigger({
  href,
  className,
  ...props
}: {
  href?: string
  className?: string
  children?: React.ReactNode
  id?: string
  "aria-label"?: string
}) {
  const { isMobile } = usePreview()

  if (isMobile) {
    return (
      <DrawerTrigger
        data-slot="preview-trigger"
        className={cn(
          "cursor-pointer text-primary underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
        {...props}
      />
    )
  }

  return (
    <HoverCardTrigger
      data-slot="preview-trigger"
      href={href}
      className={cn(
        "text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}

function PreviewContent({
  align,
  alignOffset,
  side,
  sideOffset,
  showCloseButton,
  closeLabel,
  className,
  children,
  ...props
}: {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  id?: string
  "aria-label"?: string
} & Pick<
  React.ComponentProps<typeof HoverCardContent>,
  "align" | "alignOffset" | "side" | "sideOffset"
> & {
    showCloseButton?: boolean
    closeLabel?: string
  }) {
  const { isMobile } = usePreview()

  if (isMobile) {
    return (
      <DrawerContent
        data-slot="preview-content"
        showCloseButton={showCloseButton}
        closeLabel={closeLabel}
        {...props}
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
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      className={className}
      {...props}
    >
      {children}
    </HoverCardContent>
  )
}

export { Preview, PreviewContent, PreviewTrigger }
