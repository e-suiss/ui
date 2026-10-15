"use client"

import { cva } from "class-variance-authority"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"
import * as React from "react"
import { createPortal } from "react-dom"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/lib/utils"

const NavigationMenuContext = React.createContext({ open: false })

function NavigationMenu({
  align = "start",
  layout = "popover",
  anchor,
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  align?: "start" | "center" | "end"
  anchor?: React.RefObject<HTMLElement | null>
  layout?: "popover" | "panel"
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? "")
  const current = value ?? uncontrolled

  return (
    <NavigationMenuContext.Provider value={{ open: current !== "" }}>
      <NavigationMenuPrimitive.Root
        data-slot="navigation-menu"
        data-layout={layout}
        value={current}
        onValueChange={(next) => {
          setUncontrolled(next)
          onValueChange?.(next)
        }}
        className={cn(
          "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
        {layout === "panel" ? (
          <NavigationMenuPanel anchor={anchor} />
        ) : (
          <NavigationMenuPositioner align={align} />
        )}
      </NavigationMenuPrimitive.Root>
    </NavigationMenuContext.Provider>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-0",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-md px-4.5 py-2.5 text-sm transition-colors outline-none hover:bg-accent focus:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:hover:bg-accent group-data-[layout=panel]/navigation-menu:h-11 group-data-[layout=panel]/navigation-menu:rounded-none group-data-[layout=panel]/navigation-menu:bg-transparent group-data-[layout=panel]/navigation-menu:px-2.5 group-data-[layout=panel]/navigation-menu:text-xs group-data-[layout=panel]/navigation-menu:text-foreground/80 group-data-[layout=panel]/navigation-menu:transition-[color] group-data-[layout=panel]/navigation-menu:duration-300 group-data-[layout=panel]/navigation-menu:hover:bg-transparent group-data-[layout=panel]/navigation-menu:hover:text-accent-foreground group-data-[layout=panel]/navigation-menu:focus:bg-transparent group-data-[layout=panel]/navigation-menu:data-[state=open]:bg-transparent group-data-[layout=panel]/navigation-menu:data-[state=open]:text-accent-foreground group-data-[layout=panel]/navigation-menu:data-[state=open]:hover:bg-transparent group-data-[layout=panel]/navigation-menu:focus-visible:bg-transparent focus:text-accent-foreground disabled:opacity-50"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <IconPlaceholder
        lucide="ChevronDownIcon"
        tabler="IconChevronDown"
        hugeicons="ArrowDown01Icon"
        phosphor="CaretDownIcon"
        remixicon="RiArrowDownSLine"
        className="relative top-px ms-1 size-3 transition duration-300 group-data-[state=open]/navigation-menu-trigger:rotate-180 group-data-[layout=panel]/navigation-menu:hidden"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "absolute top-0 start-0 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in-0 data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out-0 data-[motion=from-end]:slide-in-from-right-1/2 data-[motion=from-start]:slide-in-from-left-1/2 data-[motion=to-end]:slide-out-to-right-1/2 data-[motion=to-start]:slide-out-to-left-1/2 rtl:data-[motion=from-end]:slide-in-from-left-1/2 rtl:data-[motion=from-start]:slide-in-from-right-1/2 rtl:data-[motion=to-end]:slide-out-to-left-1/2 rtl:data-[motion=to-start]:slide-out-to-right-1/2 h-full w-auto p-2.5 pe-3 transition-[opacity,transform,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] in-data-[slot=navigation-menu-panel]:w-full in-data-[slot=navigation-menu-panel]:translate-x-0! in-data-[slot=navigation-menu-panel]:slide-in-from-left-0 in-data-[slot=navigation-menu-panel]:slide-in-from-right-0 in-data-[slot=navigation-menu-panel]:slide-out-to-left-0 in-data-[slot=navigation-menu-panel]:slide-out-to-right-0 in-data-[slot=navigation-menu-panel]:p-0 in-data-[slot=navigation-menu-panel]:duration-300 in-data-[slot=navigation-menu-panel]:ease-[cubic-bezier(0.4,0,0.6,1)] in-data-[slot=navigation-menu-panel]:data-[motion^=to-]:duration-150 in-data-[slot=navigation-menu-panel]:[&_li]:animate-in in-data-[slot=navigation-menu-panel]:[&_li]:fade-in-0 in-data-[slot=navigation-menu-panel]:[&_li]:slide-in-from-top-2 in-data-[slot=navigation-menu-panel]:[&_li]:fill-mode-both in-data-[slot=navigation-menu-panel]:[&_li]:duration-300 in-data-[slot=navigation-menu-panel]:[&_li]:ease-[cubic-bezier(0.4,0,0.6,1)] in-data-[slot=navigation-menu-panel]:[&_li:nth-child(2)]:delay-[25ms] in-data-[slot=navigation-menu-panel]:[&_li:nth-child(3)]:delay-[50ms] in-data-[slot=navigation-menu-panel]:[&_li:nth-child(4)]:delay-75 in-data-[slot=navigation-menu-panel]:[&_li:nth-child(5)]:delay-100 in-data-[slot=navigation-menu-panel]:[&_li:nth-child(6)]:delay-[125ms] in-data-[slot=navigation-menu-panel]:[&_li:nth-child(n+7)]:delay-150 motion-reduce:[&_li]:animate-none",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuPositioner({
  className,
  align = "start",
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport> & {
  align?: "start" | "center" | "end"
}) {
  return (
    <div
      data-slot="navigation-menu-positioner"
      data-align={align}
      className="absolute top-full isolate z-50 flex pt-2 data-[align=center]:inset-x-0 data-[align=center]:justify-center data-[align=end]:inset-e-0 data-[align=start]:inset-s-0"
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-popup"
        className={cn(
          "relative h-(--radix-navigation-menu-viewport-height) w-(--radix-navigation-menu-viewport-width) origin-top overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/5 transition-[width,height] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-90 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-90 data-closed:duration-150 dark:ring-foreground/10",
          className
        )}
        {...props}
      />
    </div>
  )
}

function useAnchorRect(anchor?: React.RefObject<HTMLElement | null>) {
  const [rect, setRect] = React.useState<{
    top: number
    left: number
    width: number
  }>()

  React.useLayoutEffect(() => {
    const element = anchor?.current
    if (!element) return
    const measure = () => {
      const box = element.getBoundingClientRect()
      setRect({ top: box.bottom, left: box.left, width: box.width })
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(element)
    window.addEventListener("scroll", measure, true)
    return () => {
      resize.disconnect()
      window.removeEventListener("scroll", measure, true)
    }
  }, [anchor])

  return rect
}

function NavigationMenuPanel({
  className,
  anchor,
  style,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport> & {
  anchor?: React.RefObject<HTMLElement | null>
}) {
  const { open } = React.useContext(NavigationMenuContext)
  const rect = useAnchorRect(anchor)

  if (typeof document === "undefined") return null

  return createPortal(
    <>
      {open && (
        <div
          data-slot="navigation-menu-backdrop"
          className="fixed inset-0 z-40 animate-in bg-black/20 backdrop-blur-lg duration-350 ease-[cubic-bezier(0.45,0,0.2,1)] fade-in-0 motion-reduce:animate-none"
        />
      )}
      <div
        className="fixed isolate z-50"
        style={{
          top: rect?.top ?? 0,
          left: rect?.left ?? 0,
          width: rect?.width ?? "100%",
        }}
      >
        <NavigationMenuPrimitive.Viewport
          data-slot="navigation-menu-panel"
          className={cn(
            "relative h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden bg-background text-foreground transition-[height] duration-450 ease-[cubic-bezier(0.45,0,0.2,1)] outline-none data-closed:h-0 data-closed:duration-300 motion-reduce:transition-none dark:bg-muted",
            className
          )}
          style={style}
          {...props}
        />
      </div>
    </>,
    document.body
  )
}

function NavigationMenuLink({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link> & {
  size?: "default" | "lg"
}) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      data-size={size}
      className={cn(
        "flex items-center gap-1.5 rounded-md p-3 text-sm transition-colors outline-none hover:bg-accent focus:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 in-data-[slot=navigation-menu-content]:rounded-md data-active:bg-accent data-active:hover:bg-accent data-active:focus:bg-accent data-[size=lg]:text-2xl data-[size=lg]:font-semibold [&_svg:not([class*='size-'])]:size-4 hover:text-accent-foreground focus:text-accent-foreground",
        "in-data-[slot=navigation-menu-panel]:w-fit in-data-[slot=navigation-menu-panel]:rounded-sm in-data-[slot=navigation-menu-panel]:bg-transparent in-data-[slot=navigation-menu-panel]:px-0 in-data-[slot=navigation-menu-panel]:py-1 in-data-[slot=navigation-menu-panel]:text-xs in-data-[slot=navigation-menu-panel]:font-semibold in-data-[slot=navigation-menu-panel]:text-foreground in-data-[slot=navigation-menu-panel]:hover:bg-transparent in-data-[slot=navigation-menu-panel]:hover:text-primary in-data-[slot=navigation-menu-panel]:focus:bg-transparent in-data-[slot=navigation-menu-panel]:data-active:bg-transparent in-data-[slot=navigation-menu-panel]:data-[size=lg]:py-0.5 in-data-[slot=navigation-menu-panel]:data-[size=lg]:text-2xl",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuLabel({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="navigation-menu-label"
      className={cn("pb-2 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden opacity-0 transition-opacity data-[state=visible]:opacity-100",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-ss-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPanel,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
}
