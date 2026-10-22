"use client"

import { cva } from "class-variance-authority"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"
import * as React from "react"
import { createPortal } from "react-dom"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/lib/utils"

const NavigationMenuContext = React.createContext({ open: false })

function subscribeMounted() {
  return () => undefined
}

function useMounted() {
  return React.useSyncExternalStore(
    subscribeMounted,
    () => true,
    () => false
  )
}

function NavigationMenu({
  align = "start",
  layout = "popover",
  anchor,
  value,
  defaultValue,
  onValueChange,
  onPointerOver,
  onPointerDown,
  onKeyDown,
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
  const dismissed = React.useRef(false)

  return (
    <NavigationMenuContext.Provider value={{ open: current !== "" }}>
      <NavigationMenuPrimitive.Root
        data-slot="navigation-menu"
        data-layout={layout}
        value={current}
        onValueChange={(next) => {
          if (next !== "" && dismissed.current) return
          dismissed.current = next === ""
          setUncontrolled(next)
          onValueChange?.(next)
        }}
        onPointerOver={(event) => {
          const trigger = (event.target as Element).closest(
            '[data-slot="navigation-menu-trigger"]'
          )
          if (trigger && !trigger.contains(event.relatedTarget as Node)) {
            dismissed.current = false
          }
          onPointerOver?.(event)
        }}
        onPointerDown={(event) => {
          dismissed.current = false
          onPointerDown?.(event)
        }}
        onKeyDown={(event) => {
          if (event.key !== "Escape") dismissed.current = false
          onKeyDown?.(event)
        }}
        className={cn(
          "cn-navigation-menu group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
        {layout === "panel" ? (
          <NavigationMenuPanel anchor={anchor} />
        ) : (
          <NavigationMenuPositioner align={align} anchor={anchor} />
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
        "cn-navigation-menu-list group flex flex-1 list-none items-center justify-center",
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
      className={cn("cn-navigation-menu-item relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "cn-navigation-menu-trigger group/navigation-menu-trigger inline-flex w-max items-center justify-center outline-none disabled:pointer-events-none"
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
        "cn-navigation-menu-content absolute transition-[opacity,transform,translate] top-0 in-data-[slot=navigation-menu-panel]:[&_li]:animate-in in-data-[slot=navigation-menu-panel]:[&_li]:fade-in-0 in-data-[slot=navigation-menu-panel]:[&_li]:slide-in-from-top-2 in-data-[slot=navigation-menu-panel]:[&_li]:fill-mode-both in-data-[slot=navigation-menu-panel]:[&_li]:duration-300 in-data-[slot=navigation-menu-panel]:[&_li]:ease-[cubic-bezier(0.4,0,0.6,1)] in-data-[slot=navigation-menu-panel]:[&_li:nth-child(2)]:delay-[25ms] in-data-[slot=navigation-menu-panel]:[&_li:nth-child(3)]:delay-[50ms] in-data-[slot=navigation-menu-panel]:[&_li:nth-child(4)]:delay-75 in-data-[slot=navigation-menu-panel]:[&_li:nth-child(5)]:delay-100 in-data-[slot=navigation-menu-panel]:[&_li:nth-child(6)]:delay-[125ms] in-data-[slot=navigation-menu-panel]:[&_li:nth-child(n+7)]:delay-150 motion-reduce:[&_li]:animate-none",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuPositioner({
  className,
  align = "start",
  anchor,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport> & {
  align?: "start" | "center" | "end"
  anchor?: React.RefObject<HTMLElement | null>
}) {
  const { open } = React.useContext(NavigationMenuContext)
  const rect = useAnchorRect(anchor, open)
  const mounted = useMounted()

  const positioner = (
    <div
      data-slot="navigation-menu-positioner"
      data-align={align}
      className={cn(
        "cn-navigation-menu-positioner flex",
        anchor
          ? "fixed data-[align=center]:justify-center data-[align=end]:justify-end"
          : "absolute top-full data-[align=center]:inset-x-0 data-[align=center]:justify-center data-[align=end]:inset-e-0 data-[align=start]:inset-s-0"
      )}
      style={
        anchor
          ? { top: rect?.top ?? 0, left: rect?.left ?? 0, width: rect?.width }
          : undefined
      }
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-popup"
        className={cn(
          "cn-navigation-menu-popup relative overflow-hidden",
          className
        )}
        {...props}
      />
    </div>
  )

  if (!anchor) return positioner
  if (!mounted) return null
  return createPortal(positioner, document.body)
}

function useAnchorRect(
  anchor: React.RefObject<HTMLElement | null> | undefined,
  open: boolean
) {
  const [rect, setRect] = React.useState<{
    top: number
    left: number
    width: number
  }>()

  React.useLayoutEffect(() => {
    if (!open) return
    const element = anchor?.current
    if (!element) return
    const measure = () => {
      const box = element.getBoundingClientRect()
      setRect({ top: box.bottom, left: box.left, width: box.width })
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(element)
    window.addEventListener("resize", measure)
    window.addEventListener("scroll", measure, true)
    return () => {
      resize.disconnect()
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", measure, true)
    }
  }, [anchor, open])

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
  const rect = useAnchorRect(anchor, open)
  const mounted = useMounted()

  if (!mounted) return null

  return createPortal(
    <>
      {open && (
        <div
          data-slot="navigation-menu-backdrop"
          className="cn-navigation-menu-backdrop fixed inset-0"
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
            "cn-navigation-menu-panel relative w-full overflow-hidden",
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
        "cn-navigation-menu-link [&_svg:not([class*='size-'])]:size-4",
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
      className={cn("cn-navigation-menu-label", className)}
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
        "cn-navigation-menu-indicator top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
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
