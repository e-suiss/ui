"use client"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { XIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"
import { Button } from "@/components/ui/button"

type DrawerContextProps = {
  floating: boolean
  hasSnapPoints: boolean
  modal: DrawerPrimitive.Root.Props["modal"]
  showSwipeHandle: boolean
  swipeDirection: NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>
}

const DrawerContext = React.createContext<DrawerContextProps | null>(null)

type DrawerIndentContextProps = {
  raised: boolean
  setRaised: (raised: boolean) => void
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
  const [raised, setRaised] = React.useState(false)
  const contextValue = React.useMemo(() => ({ raised, setRaised }), [raised])

  return (
    <DrawerIndentContext.Provider value={contextValue}>
      <DrawerPrimitive.Provider>{children}</DrawerPrimitive.Provider>
    </DrawerIndentContext.Provider>
  )
}

function DrawerIndentBackground({
  className,
  ...props
}: DrawerPrimitive.IndentBackground.Props) {
  return (
    <DrawerPrimitive.IndentBackground
      data-slot="drawer-indent-background"
      className={cn("fixed inset-0 -z-10 bg-label dark:bg-surface", className)}
      {...props}
    />
  )
}

function DrawerIndent({ className, ...props }: DrawerPrimitive.Indent.Props) {
  const indent = React.useContext(DrawerIndentContext)

  return (
    <DrawerPrimitive.Indent
      data-slot="drawer-indent"
      data-raised={indent?.raised ? "" : undefined}
      className={cn(
        "relative min-h-dvh origin-top bg-surface transition-[scale,translate,border-radius] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-raised:translate-y-[max(env(safe-area-inset-top),--spacing(3))] data-raised:scale-[0.94] data-raised:overflow-hidden data-raised:rounded-2xl motion-reduce:transition-none",
        className
      )}
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
    setRaised(raised)
    return () => setRaised(false)
  }, [setRaised, raised])

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

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 min-h-dvh bg-scrim opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] select-none data-ending-style:pointer-events-none data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-snap-points:[--drawer-overlay-min-opacity:0.5] data-starting-style:opacity-0 data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute",
        className
      )}
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
      className={cn(
        "relative z-10 flex shrink-0 cursor-grab transition-opacity duration-200 group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-[swipe-axis=x]/drawer-popup:h-full group-data-[swipe-axis=x]/drawer-popup:w-3 group-data-[swipe-axis=x]/drawer-popup:items-center group-data-[swipe-axis=y]/drawer-popup:h-3 group-data-[swipe-axis=y]/drawer-popup:w-full group-data-[swipe-axis=y]/drawer-popup:justify-center group-data-[swipe-direction=down]/drawer-popup:items-end group-data-[swipe-direction=left]/drawer-popup:order-last group-data-[swipe-direction=left]/drawer-popup:justify-start group-data-[swipe-direction=right]/drawer-popup:justify-end group-data-[swipe-direction=up]/drawer-popup:order-last group-data-[swipe-direction=up]/drawer-popup:items-start after:block after:shrink-0 after:rounded-full after:bg-label-quaternary group-data-[swipe-axis=x]/drawer-popup:after:h-9 group-data-[swipe-axis=x]/drawer-popup:after:w-1.25 group-data-[swipe-axis=y]/drawer-popup:after:h-1.25 group-data-[swipe-axis=y]/drawer-popup:after:w-9 active:cursor-grabbing",
        className
      )}
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
}: DrawerPrimitive.Popup.Props & {
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
        className="pointer-events-none fixed inset-0 z-50 select-none data-[modal=true]:pointer-events-auto"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          data-swipe-axis={swipeAxis}
          data-floating={floating ? "" : undefined}
          data-snap-points={hasSnapPoints ? "" : undefined}
          className={cn(
            "group/drawer-popup pointer-events-auto fixed z-50 m-(--drawer-inset,0px) flex h-(--drawer-content-height) max-h-(--drawer-content-max-height,none) min-h-0 w-(--drawer-content-width,auto) transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)_scale(var(--stack-scale))] flex-col rounded-3xl bg-surface-raised text-base text-label shadow-xl transition-[transform,height,opacity,filter] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform outline-none select-none [--drawer-bleed-background:transparent] data-floating:[--drawer-inset:--spacing(2)] [--drawer-stacked-shadow:0_-20px_25px_-5px_rgb(0_0_0/0.1),0_-8px_10px_-6px_rgb(0_0_0/0.1)] [interpolate-size:allow-keywords] data-[swipe-direction=down]:data-nested-drawer-open:shadow-(--drawer-stacked-shadow)",
            "data-nested-drawer-open:overflow-hidden data-nested-drawer-open:brightness-95",
            "not-data-floating:data-[swipe-direction=down]:rounded-b-none not-data-floating:data-[swipe-direction=down]:pb-[env(safe-area-inset-bottom)] not-data-floating:data-[swipe-direction=left]:rounded-l-none not-data-floating:data-[swipe-direction=right]:rounded-r-none not-data-floating:data-[swipe-direction=up]:rounded-t-none",
            "after:pointer-events-none after:absolute after:bg-(--drawer-bleed-background,var(--color-surface-raised)) data-[swipe-axis=x]:after:inset-y-0 data-[swipe-axis=x]:after:w-(--bleed) data-[swipe-axis=y]:after:inset-x-0 data-[swipe-axis=y]:after:h-(--bleed) data-[swipe-direction=down]:after:top-full data-[swipe-direction=left]:after:right-full data-[swipe-direction=right]:after:left-full data-[swipe-direction=up]:after:bottom-full",
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
            className={cn(
              "flex min-h-0 flex-1 flex-col overflow-hidden overscroll-contain rounded-[inherit] transition-opacity duration-300 ease-[cubic-bezier(0.45,1.005,0,1.005)] select-text group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 group-data-swiping/drawer-popup:select-none"
            )}
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
                      "bg-surface-tertiary hover:bg-[color-mix(in_oklab,var(--surface-tertiary),var(--label)_5%)] active:bg-[color-mix(in_oklab,var(--surface-tertiary),var(--label)_10%)]"
                  )}
                  size={closeLabel ? "sm" : "icon-sm"}
                />
              }
            >
              {closeLabel ?? (
                <>
                  <XIcon />
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
      className={cn(
        "flex shrink-0 flex-col gap-0.5 p-4 pb-0 group-has-data-[slot=drawer-close-button]/drawer-popup:px-14 group-has-[[data-slot=drawer-close-button][data-label]]/drawer-popup:px-24 group-data-[swipe-axis=y]/drawer-popup:text-center",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex shrink-0 flex-col gap-2 p-4 pt-0", className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-base font-semibold text-label", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-balance text-label-secondary", className)}
      {...props}
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
