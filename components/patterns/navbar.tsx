"use client"

import { cn } from "cn"
import type * as React from "react"

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

type NavbarItem = NavbarLink | { label: string; items: NavbarLink[] }

function isGroup(
  item: NavbarItem
): item is { label: string; items: NavbarLink[] } {
  return "items" in item
}

function NavbarAnchor(props: React.ComponentProps<"a">) {
  return <a {...props} />
}

function Navbar({
  items,
  brand,
  actions,
  menuLabel = "Menu",
  closeLabel,
  render = <NavbarAnchor />,
  className,
  ...props
}: React.ComponentProps<"header"> & {
  items: NavbarItem[]
  brand?: React.ReactNode
  actions?: React.ReactNode
  menuLabel?: string
  closeLabel?: string
  render?: React.ReactElement
}) {
  const isMobile = useIsMobile()
  const links = items.filter((item): item is NavbarLink => !isGroup(item))
  const groups = items.filter(isGroup)

  return (
    <header
      data-slot="navbar"
      className={cn(
        "flex h-14 w-full items-center gap-4 px-4 md:px-6",
        className
      )}
      {...props}
    >
      {brand && (
        <div data-slot="navbar-brand" className="flex shrink-0 items-center">
          {brand}
        </div>
      )}
      {isMobile ? (
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
          <NavigationMenu className="mx-auto">
            <NavigationMenuList>
              {items.map((item) =>
                isGroup(item) ? (
                  <NavigationMenuItem key={item.label} value={item.label}>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-80 gap-1">
                        {item.items.map((link) => (
                          <li key={link.label}>
                            <NavigationMenuLink
                              href={link.href}
                              active={link.active}
                              render={render}
                              className={cn(
                                link.description && "items-start gap-3"
                              )}
                            >
                              {link.icon}
                              {link.description ? (
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium">
                                    {link.label}
                                  </span>
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
                ) : (
                  <NavigationMenuItem key={item.label}>
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
              )}
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

export { Navbar, type NavbarItem, type NavbarLink }
