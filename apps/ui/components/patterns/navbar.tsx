"use client"

import { cn } from "cn"
import * as React from "react"

import {
  FullscreenMenu,
  FullscreenMenuContent,
  FullscreenMenuGroup,
  FullscreenMenuLabel,
  FullscreenMenuLink,
  FullscreenMenuTitle,
  FullscreenMenuTrigger,
} from "@/components/ui/fullscreen-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useIsMobile } from "@/hooks/use-mobile"

type NavbarLink = {
  label: string
  href: string
  description?: string
  icon?: React.ReactNode
  active?: boolean
}

type NavbarColumn = {
  label: string
  links: NavbarLink[]
  featured?: boolean
}

type NavbarGroup = { label: string; items: NavbarLink[] }

type NavbarMega = { label: string; columns: NavbarColumn[] }

type NavbarItem = NavbarLink | NavbarGroup | NavbarMega

function isGroup(item: NavbarItem): item is NavbarGroup {
  return "items" in item
}

function isMega(item: NavbarItem): item is NavbarMega {
  return "columns" in item
}

function NavbarAnchor(props: React.ComponentProps<"a">) {
  return <a {...props} />
}

function NavbarMenuItem({
  item,
  render,
}: {
  item: NavbarItem
  render: React.ReactElement
}) {
  if (isMega(item)) {
    return (
      <NavigationMenuItem value={item.label}>
        <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
        <NavigationMenuContent className="w-full p-0">
          <div
            data-slot="navbar-columns"
            className="mx-auto flex max-w-5xl gap-16 px-6 pt-7 pb-14"
          >
            {item.columns.map((column, index) => (
              <div
                key={column.label}
                data-slot="navbar-column"
                data-featured={column.featured ? "" : undefined}
                style={{ transitionDelay: `${60 + index * 40}ms` }}
                className="group/navbar-column flex flex-col gap-2 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.45,0,0.2,1)] starting:-translate-y-1.5 starting:opacity-0 motion-reduce:transition-none data-featured:gap-2.5"
              >
                <span className="text-xs text-label-secondary">
                  {column.label}
                </span>
                {column.links.map((link) => (
                  <NavigationMenuLink
                    key={link.label}
                    href={link.href}
                    active={link.active}
                    render={render}
                    className="w-fit rounded-sm p-0 text-xs leading-tight font-semibold hover:bg-transparent hover:underline focus:bg-transparent group-data-featured/navbar-column:text-2xl group-data-featured/navbar-column:tracking-tight"
                  >
                    {link.label}
                  </NavigationMenuLink>
                ))}
              </div>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  if (isGroup(item)) {
    return (
      <NavigationMenuItem value={item.label}>
        <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-80 gap-1">
            {item.items.map((link) => (
              <li key={link.label}>
                <NavigationMenuLink
                  href={link.href}
                  active={link.active}
                  render={render}
                  className={cn(link.description && "items-start gap-3")}
                >
                  {link.icon}
                  {link.description ? (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{link.label}</span>
                      <span className="text-label-secondary">
                        {link.description}
                      </span>
                    </div>
                  ) : (
                    link.label
                  )}
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        href={item.href}
        active={item.active}
        render={render}
        className={navigationMenuTriggerStyle()}
      >
        {item.label}
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

function Navbar({
  items,
  brand,
  actions,
  menuLabel = "Menu",
  closeLabel,
  layout = "popover",
  render = <NavbarAnchor />,
  className,
  ...props
}: React.ComponentProps<"header"> & {
  items: NavbarItem[]
  brand?: React.ReactNode
  actions?: React.ReactNode
  menuLabel?: string
  closeLabel?: string
  layout?: "popover" | "panel"
  render?: React.ReactElement
}) {
  const isMobile = useIsMobile()
  const headerRef = React.useRef<HTMLElement>(null)
  const [crowdedBelow, setCrowdedBelow] = React.useState<number | null>(null)
  const compact = isMobile || crowdedBelow !== null

  React.useLayoutEffect(() => {
    const header = headerRef.current
    if (!header || isMobile) return
    const measure = () => {
      if (crowdedBelow === null) {
        if (header.scrollWidth > header.clientWidth + 1) {
          setCrowdedBelow(header.scrollWidth)
        }
      } else if (header.clientWidth >= crowdedBelow) {
        setCrowdedBelow(null)
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    for (const child of header.children) observer.observe(child)
    return () => observer.disconnect()
  }, [crowdedBelow, isMobile])
  const links = items.filter(
    (item): item is NavbarLink => !isGroup(item) && !isMega(item)
  )
  const groups = items.flatMap((item) => {
    if (isGroup(item)) return [item]
    if (isMega(item)) {
      return item.columns.map((column) => ({
        label: column.label,
        items: column.links,
      }))
    }
    return []
  })

  return (
    <header
      ref={headerRef}
      data-slot="navbar"
      data-layout={layout}
      data-compact={compact ? "" : undefined}
      className={cn(
        "flex h-14 w-full items-center gap-4 px-4 data-[layout=panel]:relative data-[layout=panel]:z-50 md:px-6",
        className
      )}
      {...props}
    >
      {brand && (
        <div data-slot="navbar-brand" className="flex shrink-0 items-center">
          {brand}
        </div>
      )}
      {compact ? (
        <div className="ms-auto flex items-center gap-2">
          {actions}
          <FullscreenMenu>
            <FullscreenMenuTrigger aria-label={menuLabel} />
            <FullscreenMenuContent closeLabel={closeLabel}>
              <FullscreenMenuTitle>{menuLabel}</FullscreenMenuTitle>
              {links.length > 0 && (
                <FullscreenMenuGroup>
                  {links.map((link) => (
                    <FullscreenMenuLink
                      key={link.label}
                      href={link.href}
                      isActive={link.active}
                      render={render}
                    >
                      {link.label}
                    </FullscreenMenuLink>
                  ))}
                </FullscreenMenuGroup>
              )}
              {groups.map((group) => (
                <FullscreenMenuGroup key={group.label}>
                  <FullscreenMenuLabel>{group.label}</FullscreenMenuLabel>
                  {group.items.map((link) => (
                    <FullscreenMenuLink
                      key={link.label}
                      href={link.href}
                      isActive={link.active}
                      render={render}
                    >
                      {link.label}
                    </FullscreenMenuLink>
                  ))}
                </FullscreenMenuGroup>
              ))}
            </FullscreenMenuContent>
          </FullscreenMenu>
        </div>
      ) : (
        <>
          <NavigationMenu
            className="mx-auto"
            layout={layout}
            anchor={layout === "panel" ? headerRef : undefined}
          >
            <NavigationMenuList>
              {items.map((item) => (
                <NavbarMenuItem key={item.label} item={item} render={render} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          {actions && (
            <div
              data-slot="navbar-actions"
              className="flex shrink-0 items-center gap-2"
            >
              {actions}
            </div>
          )}
        </>
      )}
    </header>
  )
}

export { Navbar, type NavbarColumn, type NavbarItem, type NavbarLink }
