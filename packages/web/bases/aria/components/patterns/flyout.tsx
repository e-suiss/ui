"use client"

import * as React from "react"
import {
  Button as ButtonPrimitive,
  OverlayTriggerStateContext,
} from "react-aria-components"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

type FlyoutContextProps = {
  isMobile: boolean
}

const FlyoutContext = React.createContext<FlyoutContextProps | null>(null)

function useFlyout() {
  const context = React.useContext(FlyoutContext)

  if (!context) {
    throw new Error("useFlyout must be used within a <Flyout />")
  }

  return context
}

function Flyout({
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
    <FlyoutContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer
          data-slot="flyout"
          floating={floating}
          showSwipeHandle
          open={isOpen}
          defaultOpen={defaultOpen}
          onOpenChange={(next) => onOpenChange?.(next)}
        >
          {children}
        </Drawer>
      ) : (
        <Popover
          data-slot="flyout"
          isOpen={isOpen}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          {children}
        </Popover>
      )}
    </FlyoutContext.Provider>
  )
}

type FlyoutButtonProps = {
  className?: string
  children?: React.ReactNode
  id?: string
  "aria-label"?: string
}

function FlyoutTrigger(props: FlyoutButtonProps) {
  const { isMobile } = useFlyout()
  const Trigger = isMobile ? DrawerTrigger : PopoverTrigger

  return <Trigger data-slot="flyout-trigger" {...props} />
}

function FlyoutContent({
  align,
  alignOffset,
  side,
  sideOffset,
  showCloseButton,
  closeLabel,
  ...props
}: {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  id?: string
  "aria-label"?: string
} & Pick<
  React.ComponentProps<typeof PopoverContent>,
  "align" | "alignOffset" | "side" | "sideOffset"
> & {
    showCloseButton?: boolean
    closeLabel?: string
  }) {
  const { isMobile } = useFlyout()

  if (isMobile) {
    return (
      <DrawerContent
        data-slot="flyout-content"
        showCloseButton={showCloseButton}
        closeLabel={closeLabel}
        {...props}
      />
    )
  }

  return (
    <PopoverContent
      data-slot="flyout-content"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function FlyoutHeader(props: React.ComponentProps<"div">) {
  const { isMobile } = useFlyout()
  const Header = isMobile ? DrawerHeader : PopoverHeader

  return <Header data-slot="flyout-header" {...props} />
}

function FlyoutTitle(props: {
  className?: string
  children?: React.ReactNode
  id?: string
}) {
  const { isMobile } = useFlyout()
  const Title = isMobile ? DrawerTitle : PopoverTitle

  return <Title data-slot="flyout-title" {...props} />
}

function FlyoutDescription(props: {
  className?: string
  children?: React.ReactNode
  id?: string
}) {
  const { isMobile } = useFlyout()
  const Description = isMobile ? DrawerDescription : PopoverDescription

  return <Description data-slot="flyout-description" {...props} />
}

function FlyoutBody({ className, ...props }: React.ComponentProps<"div">) {
  const { isMobile } = useFlyout()

  return (
    <div
      data-slot="flyout-body"
      className={cn(isMobile && "p-4", className)}
      {...props}
    />
  )
}

function FlyoutClose(props: FlyoutButtonProps) {
  const { isMobile } = useFlyout()
  const state = React.useContext(OverlayTriggerStateContext)

  if (isMobile) return <DrawerClose data-slot="flyout-close" {...props} />

  return (
    <ButtonPrimitive
      data-slot="flyout-close"
      onPress={() => state?.close()}
      {...props}
    />
  )
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
