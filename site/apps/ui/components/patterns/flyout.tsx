"use client"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "cn"
import * as React from "react"

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
  open,
  defaultOpen,
  onOpenChange,
  floating,
  children,
}: Pick<
  React.ComponentProps<typeof Popover>,
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
    <FlyoutContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer
          data-slot="flyout"
          floating={floating}
          showSwipeHandle
          {...rootProps}
        />
      ) : (
        <Popover data-slot="flyout" {...rootProps} />
      )}
    </FlyoutContext.Provider>
  )
}

function FlyoutTrigger(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    render?: React.ReactElement
  }
) {
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
}: React.HTMLAttributes<HTMLElement> &
  Pick<
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

function FlyoutTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  const { isMobile } = useFlyout()
  const Title = isMobile ? DrawerTitle : PopoverTitle

  return <Title data-slot="flyout-title" {...props} />
}

function FlyoutDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
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

function FlyoutClose(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    render?: React.ReactElement
  }
) {
  const { isMobile } = useFlyout()
  const Close = isMobile ? DrawerClose : PopoverPrimitive.Close

  return <Close data-slot="flyout-close" {...props} />
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
