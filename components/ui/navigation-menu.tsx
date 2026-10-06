import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { CaretDownIcon } from "@phosphor-icons/react"
import { cva } from "class-variance-authority"
import { cn } from "cn"

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
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
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
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-md px-4.5 py-2.5 text-sm transition-colors outline-none hover:bg-item-hover focus:bg-item-hover focus-visible:focus-ring disabled:pointer-events-none disabled:text-label-quaternary data-popup-open:bg-item-selected data-popup-open:hover:bg-item-selected"
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
      <CaretDownIcon
        className="relative top-px ms-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180"
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
        "data-ending-style:data-[activation-direction=left]:translate-x-[50%] rtl:data-ending-style:data-[activation-direction=left]:-translate-x-[50%] data-ending-style:data-[activation-direction=right]:translate-x-[-50%] rtl:data-ending-style:data-[activation-direction=right]:-translate-x-[-50%] data-starting-style:data-[activation-direction=left]:translate-x-[-50%] rtl:data-starting-style:data-[activation-direction=left]:-translate-x-[-50%] data-starting-style:data-[activation-direction=right]:translate-x-[50%] rtl:data-starting-style:data-[activation-direction=right]:-translate-x-[50%] h-full w-auto p-2.5 pe-3 transition-[opacity,transform,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:opacity-0 data-starting-style:opacity-0",
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
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn(
          "isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none data-[side=bottom]:before:-top-2.5 data-[side=bottom]:before:inset-e-0 data-[side=bottom]:before:inset-s-0",
          className
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup className="relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-2xl bg-surface-raised text-label shadow-lg ring-1 ring-label/5 transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0 dark:ring-label/10">
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
        className="fixed inset-0 z-40 bg-scrim/20 backdrop-blur-md transition-opacity duration-350 ease-[cubic-bezier(0.45,0,0.2,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
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
          className="relative h-(--popup-height) w-full overflow-hidden bg-surface text-label transition-[height] duration-450 ease-[cubic-bezier(0.45,0,0.2,1)] outline-none data-ending-style:h-0 data-ending-style:duration-300 data-starting-style:h-0 motion-reduce:transition-none"
        >
          <NavigationMenuPrimitive.Viewport className="relative size-full" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex items-center gap-1.5 rounded-md p-3 text-sm transition-colors outline-none hover:bg-item-hover focus:bg-item-hover focus-visible:focus-ring in-data-[slot=navigation-menu-content]:rounded-md data-active:bg-item-selected data-active:hover:bg-item-selected data-active:focus:bg-item-selected [&_svg:not([class*='size-'])]:size-4",
        className
      )}
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
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden opacity-0 transition-opacity data-popup-open:opacity-100",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-ss-sm bg-separator shadow-md" />
    </NavigationMenuPrimitive.Icon>
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPanel,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
}
