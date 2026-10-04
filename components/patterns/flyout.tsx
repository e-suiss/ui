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

function FlyoutTrigger(props: {
  render?: React.ReactElement
  className?: string
  disabled?: boolean
  children?: React.ReactNode
}) {
  const { isMobile } = useFlyout()
  const Trigger = isMobile ? DrawerTrigger : PopoverTrigger

  return <Trigger data-slot="flyout-trigger" {...props} />
}

function FlyoutContent({
  align,
  side,
  showCloseButton,
  closeLabel,
  className,
  children,
}: Pick<React.ComponentProps<typeof PopoverContent>, "align" | "side"> & {
  showCloseButton?: boolean
  closeLabel?: string
  className?: string
  children?: React.ReactNode
}) {
  const { isMobile } = useFlyout()

  if (isMobile) {
    return (
      <DrawerContent
        data-slot="flyout-content"
        showCloseButton={showCloseButton}
        closeLabel={closeLabel}
        className={className}
      >
        {children}
      </DrawerContent>
    )
  }

  return (
    <PopoverContent
      data-slot="flyout-content"
      align={align}
      side={side}
      className={className}
    >
      {children}
    </PopoverContent>
  )
}

function FlyoutHeader(props: React.ComponentProps<"div">) {
  const { isMobile } = useFlyout()
  const Header = isMobile ? DrawerHeader : PopoverHeader

  return <Header data-slot="flyout-header" {...props} />
}

function FlyoutTitle({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { isMobile } = useFlyout()
  const Title = isMobile ? DrawerTitle : PopoverTitle

  return (
    <Title data-slot="flyout-title" className={className}>
      {children}
    </Title>
  )
}

function FlyoutDescription({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { isMobile } = useFlyout()
  const Description = isMobile ? DrawerDescription : PopoverDescription

  return (
    <Description data-slot="flyout-description" className={className}>
      {children}
    </Description>
  )
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

function FlyoutClose(props: {
  render?: React.ReactElement
  className?: string
  children?: React.ReactNode
}) {
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
