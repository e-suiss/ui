"use client"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { useScrollbarGap } from "@/hooks/use-scrollbar-gap"
import { cn } from "@/lib/utils"

type DrawerContextProps = {
  floating: boolean
  hasSnapPoints: boolean
  modal: DrawerPrimitive.Root.Props["modal"]
  showSwipeHandle: boolean
  swipeDirection: NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>
}

const DrawerContext = React.createContext<DrawerContextProps | null>(null)

type AsChildProps<Props> = Omit<Props, "render" | "nativeButton"> & {
  asChild?: boolean
}

function asChildProps(asChild: boolean, children: React.ReactNode) {
  if (
    !asChild ||
    !React.isValidElement<{ children?: React.ReactNode }>(children)
  ) {
    return { children }
  }
  return { render: children, children: children.props.children }
}

function asChildButtonProps(asChild: boolean, children: React.ReactNode) {
  const props = asChildProps(asChild, children)
  if (!props.render) return props
  return {
    ...props,
    nativeButton:
      typeof props.render.type !== "string" || props.render.type === "button",
  }
}

type DrawerIndentContextProps = {
  raised: boolean
  setRaised: (id: string, raised: boolean) => void
}

const DrawerIndentContext =
  React.createContext<DrawerIndentContextProps | null>(null)

function useDrawer() {
  const context = React.useContext(DrawerContext)

  if (!context) {
    throw new Error("useDrawer must be used within a Drawer.")
  }

  return context
}

function DrawerProvider({ children }: DrawerPrimitive.Provider.Props) {
  const [raisers, setRaisers] = React.useState<ReadonlySet<string>>(
    () => new Set()
  )
  const setRaised = React.useCallback((id: string, raised: boolean) => {
    setRaisers((current) => {
      if (current.has(id) === raised) return current
      const next = new Set(current)
      if (raised) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])
  const raised = raisers.size > 0
  const contextValue = React.useMemo(
    () => ({ raised, setRaised }),
    [raised, setRaised]
  )

  return (
    <DrawerIndentContext.Provider value={contextValue}>
      <DrawerPrimitive.Provider>{children}</DrawerPrimitive.Provider>
    </DrawerIndentContext.Provider>
  )
}

function DrawerIndentBackground({
  className,
  ...props
}: Omit<DrawerPrimitive.IndentBackground.Props, "render">) {
  return (
    <DrawerPrimitive.IndentBackground
      data-slot="drawer-indent-background"
      className={cn("cn-drawer-indent-background", className)}
      {...props}
    />
  )
}

function DrawerIndent({
  className,
  ...props
}: Omit<DrawerPrimitive.Indent.Props, "render">) {
  const indent = React.useContext(DrawerIndentContext)

  return (
    <DrawerPrimitive.Indent
      data-slot="drawer-indent"
      data-raised={indent?.raised ? "" : undefined}
      className={cn("cn-drawer-indent", className)}
      {...props}
    />
  )
}

function Drawer({
  floating = false,
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = "down",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  snapPoint: snapPointProp,
  defaultSnapPoint,
  onSnapPointChange,
  ...props
}: DrawerPrimitive.Root.Props & {
  floating?: boolean
  showSwipeHandle?: boolean
}) {
  const hasSnapPoints = snapPoints != null && snapPoints.length > 0
  const indent = React.useContext(DrawerIndentContext)
  const setRaised = indent?.setRaised
  const raiseId = React.useId()
  const initialSnapPoint = defaultSnapPoint ?? snapPoints?.[0] ?? null
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [uncontrolledSnapPoint, setUncontrolledSnapPoint] =
    React.useState(initialSnapPoint)
  const open = openProp ?? uncontrolledOpen
  const snapPoint =
    snapPointProp !== undefined ? snapPointProp : uncontrolledSnapPoint
  const raised =
    open &&
    !floating &&
    swipeDirection === "down" &&
    (!hasSnapPoints || snapPoint === snapPoints.at(-1))

  React.useEffect(() => {
    if (!setRaised) return
    setRaised(raiseId, raised)
    return () => setRaised(raiseId, false)
  }, [setRaised, raiseId, raised])

  const contextValue = React.useMemo(
    () => ({ floating, hasSnapPoints, modal, showSwipeHandle, swipeDirection }),
    [floating, hasSnapPoints, modal, showSwipeHandle, swipeDirection]
  )

  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        snapPoints={snapPoints}
        swipeDirection={swipeDirection}
        open={openProp}
        defaultOpen={defaultOpen}
        onOpenChange={(next, eventDetails) => {
          setUncontrolledOpen(next)
          if (next) setUncontrolledSnapPoint(initialSnapPoint)
          onOpenChange?.(next, eventDetails)
        }}
        snapPoint={snapPointProp}
        defaultSnapPoint={defaultSnapPoint}
        onSnapPointChange={(next, eventDetails) => {
          setUncontrolledSnapPoint(next)
          onSnapPointChange?.(next, eventDetails)
        }}
        {...props}
      />
    </DrawerContext.Provider>
  )
}

function DrawerTrigger({
  asChild = false,
  children,
  ...props
}: AsChildProps<DrawerPrimitive.Trigger.Props>) {
  return (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      {...props}
      {...asChildButtonProps(asChild, children)}
    />
  )
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  asChild = false,
  children,
  ...props
}: AsChildProps<DrawerPrimitive.Close.Props>) {
  return (
    <DrawerPrimitive.Close
      data-slot="drawer-close"
      {...props}
      {...asChildButtonProps(asChild, children)}
    />
  )
}

function DrawerOverlay({
  className,
  ...props
}: Omit<DrawerPrimitive.Backdrop.Props, "render">) {
  useScrollbarGap()

  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn("cn-drawer-overlay inset-0 z-50", className)}
      {...props}
    />
  )
}

function DrawerSwipeHandle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-swipe-handle"
      aria-hidden="true"
      className={cn("cn-drawer-swipe-handle", className)}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  showCloseButton = false,
  closeLabel,
  ...props
}: Omit<DrawerPrimitive.Popup.Props, "render"> & {
  showCloseButton?: boolean
  closeLabel?: string
}) {
  const { floating, hasSnapPoints, modal, showSwipeHandle, swipeDirection } =
    useDrawer()
  const swipeAxis =
    swipeDirection === "down" || swipeDirection === "up" ? "y" : "x"

  return (
    <DrawerPortal data-slot="drawer-portal">
      {modal === true && (
        <DrawerOverlay data-snap-points={hasSnapPoints ? "" : undefined} />
      )}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        data-modal={modal}
        className="cn-drawer-viewport"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          data-swipe-axis={swipeAxis}
          data-floating={floating ? "" : undefined}
          data-snap-points={hasSnapPoints ? "" : undefined}
          className={cn(
            "cn-drawer-popup group/drawer-popup",
            "data-nested-drawer-open:overflow-hidden data-nested-drawer-open:brightness-95",
            "not-data-floating:data-[swipe-direction=down]:rounded-b-none not-data-floating:data-[swipe-direction=down]:pb-[env(safe-area-inset-bottom)] not-data-floating:data-[swipe-direction=left]:rounded-l-none not-data-floating:data-[swipe-direction=right]:rounded-r-none not-data-floating:data-[swipe-direction=up]:rounded-t-none",
            "after:pointer-events-none after:absolute after:bg-(--drawer-bleed-background,var(--color-popover)) data-[swipe-axis=x]:after:inset-y-0 data-[swipe-axis=x]:after:w-(--bleed) data-[swipe-axis=y]:after:inset-x-0 data-[swipe-axis=y]:after:h-(--bleed) data-[swipe-direction=down]:after:top-full data-[swipe-direction=left]:after:right-full data-[swipe-direction=right]:after:left-full data-[swipe-direction=up]:after:bottom-full",
            "[--drawer-content-height:var(--drawer-height,auto)] data-[swipe-axis=x]:[--drawer-content-width:75%] data-[swipe-axis=y]:[--drawer-content-max-height:calc(100dvh-6rem)] data-[swipe-axis=y]:data-snap-points:[--drawer-content-height:100dvh] data-[swipe-axis=x]:sm:[--drawer-content-width:24rem]",
            "[--bleed:3rem] [--peek:1rem] [--stack-height:var(--drawer-frontmost-height,var(--drawer-height,0px))] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))] [--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--stack-shrink:calc(1-var(--stack-scale))] [--stack-step:0.05]",
            "data-ending-style:transform-(--closed-transform) data-ending-style:opacity-[0.9999] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-nested-drawer-swiping:duration-0 data-ending-style:data-nested-drawer-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:transform-(--closed-transform) data-swiping:duration-0 data-ending-style:data-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
            "data-[swipe-axis=y]:inset-x-0 data-[swipe-axis=y]:data-nested-drawer-open:h-(--stack-height)",
            "data-[swipe-axis=x]:inset-y-0 data-[swipe-axis=x]:flex-row",
            "data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:origin-bottom data-[swipe-direction=down]:[--closed-transform:translate3d(0,calc(100%+var(--drawer-inset,0px)+2px),0)] data-[swipe-direction=down]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))]",
            "data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:origin-top data-[swipe-direction=up]:[--closed-transform:translate3d(0,calc(-100%-var(--drawer-inset,0px)-2px),0)] data-[swipe-direction=up]:[--translate-y:calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-height)))]",
            "data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:origin-left data-[swipe-direction=left]:[--closed-transform:translate3d(calc(-100%-var(--drawer-inset,0px)-2px),0,0)] data-[swipe-direction=left]:[--translate-x:calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)+(var(--stack-shrink)*100%))]",
            "data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:origin-right data-[swipe-direction=right]:[--closed-transform:translate3d(calc(100%+var(--drawer-inset,0px)+2px),0,0)] data-[swipe-direction=right]:[--translate-x:calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--stack-shrink)*100%))]",
            className
          )}
          {...props}
        >
          {showSwipeHandle && <DrawerSwipeHandle />}
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            className={cn("cn-drawer-content group/drawer-content")}
          >
            {children}
          </DrawerPrimitive.Content>
          {showCloseButton && (
            <DrawerPrimitive.Close
              data-slot="drawer-close-button"
              data-label={closeLabel ? "" : undefined}
              render={
                <Button
                  variant={closeLabel ? "plain" : "ghost"}
                  className={cn(
                    "absolute inset-e-4 top-2.75 group-has-data-[slot=drawer-swipe-handle]/drawer-popup:top-5.75",
                    closeLabel && "text-base",
                    !closeLabel &&
                      "bg-secondary hover:bg-[color-mix(in_oklab,var(--secondary),var(--foreground)_5%)]"
                  )}
                  size={closeLabel ? "sm" : "icon-sm"}
                />
              }
            >
              {closeLabel ?? (
                <>
                  <IconPlaceholder
                    lucide="XIcon"
                    tabler="IconX"
                    hugeicons="Cancel01Icon"
                    phosphor="XIcon"
                    remixicon="RiCloseLine"
                  />
                  <span className="sr-only">Close</span>
                </>
              )}
            </DrawerPrimitive.Close>
          )}
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("cn-drawer-header flex flex-col", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("cn-drawer-footer mt-auto flex flex-col", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  asChild = false,
  children,
  ...props
}: AsChildProps<DrawerPrimitive.Title.Props>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("cn-font-heading cn-drawer-title", className)}
      {...props}
      {...asChildProps(asChild, children)}
    />
  )
}

function DrawerDescription({
  className,
  asChild = false,
  children,
  ...props
}: AsChildProps<DrawerPrimitive.Description.Props>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("cn-drawer-description", className)}
      {...props}
      {...asChildProps(asChild, children)}
    />
  )
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerIndent,
  DrawerIndentBackground,
  DrawerOverlay,
  DrawerPortal,
  DrawerProvider,
  DrawerSwipeHandle,
  DrawerTitle,
  DrawerTrigger,
}
