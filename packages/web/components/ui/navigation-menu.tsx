"use client"

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/lib/utils"

function NavigationMenu({
  align = "start",
  layout = "popover",
  anchor,
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align" | "anchor"> & {
    layout?: "popover" | "panel"
  }) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-layout={layout}
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
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
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
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
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
}: NavigationMenuPrimitive.Trigger.Props) {
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
        className="relative top-px ms-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-[layout=panel]/navigation-menu:hidden"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "cn-navigation-menu-content h-full transition-[opacity,transform,translate] data-ending-style:opacity-0 data-starting-style:opacity-0 in-data-[slot=navigation-menu-panel]:[&_li]:animate-in in-data-[slot=navigation-menu-panel]:[&_li]:fade-in-0 in-data-[slot=navigation-menu-panel]:[&_li]:slide-in-from-top-2 in-data-[slot=navigation-menu-panel]:[&_li]:fill-mode-both in-data-[slot=navigation-menu-panel]:[&_li]:duration-300 in-data-[slot=navigation-menu-panel]:[&_li]:ease-[cubic-bezier(0.4,0,0.6,1)] in-data-[slot=navigation-menu-panel]:[&_li:nth-child(2)]:delay-[25ms] in-data-[slot=navigation-menu-panel]:[&_li:nth-child(3)]:delay-[50ms] in-data-[slot=navigation-menu-panel]:[&_li:nth-child(4)]:delay-75 in-data-[slot=navigation-menu-panel]:[&_li:nth-child(5)]:delay-100 in-data-[slot=navigation-menu-panel]:[&_li:nth-child(6)]:delay-[125ms] in-data-[slot=navigation-menu-panel]:[&_li:nth-child(n+7)]:delay-150 motion-reduce:[&_li]:animate-none",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        data-slot="navigation-menu-positioner"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn("cn-navigation-menu-positioner", className)}
        {...props}
      >
        <NavigationMenuPrimitive.Popup
          data-slot="navigation-menu-popup"
          className="cn-navigation-menu-popup"
        >
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  )
}

function NavigationMenuPanel({
  className,
  anchor,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Backdrop
        data-slot="navigation-menu-backdrop"
        className="cn-navigation-menu-backdrop"
      />
      <NavigationMenuPrimitive.Positioner
        anchor={anchor}
        side="bottom"
        align="start"
        sideOffset={0}
        collisionPadding={0}
        className={cn(
          "isolate z-50 h-(--positioner-height) w-(--anchor-width)",
          className
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup
          data-slot="navigation-menu-panel"
          className="cn-navigation-menu-panel"
        >
          <NavigationMenuPrimitive.Viewport className="relative size-full" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  )
}

function NavigationMenuLink({
  className,
  size = "default",
  ...props
}: NavigationMenuPrimitive.Link.Props & {
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
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      className={cn(
        "cn-navigation-menu-indicator top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-ss-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Icon>
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
