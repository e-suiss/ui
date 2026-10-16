"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  TabBar,
  TabBarContent,
  TabBarItem,
  TabBarList,
  TabBarTrigger,
} from "@/components/ui/tab-bar"
import { cn } from "@/lib/utils"

type AppShellItem = {
  value: string
  label: string
  icon: React.ReactNode
  href?: string
  badge?: React.ReactNode
  group?: string
  disabled?: boolean
}

type AppShellGroup = {
  value: string
  items: AppShellItem[]
}

function groupItems(items: AppShellItem[]): AppShellGroup[] {
  const groups = new Map<string, AppShellItem[]>()
  for (const item of items) {
    const key = item.group ?? ""
    groups.set(key, [...(groups.get(key) ?? []), item])
  }
  return [...groups].map(([value, groupItems]) => ({
    value,
    items: groupItems,
  }))
}

function AppShellLink(props: React.ComponentProps<"a">) {
  return <a {...props} />
}

function AppShell(props: React.ComponentProps<typeof AppShellLayout>) {
  return (
    <SidebarProvider
      defaultOpen={props.defaultOpen}
      open={props.open}
      onOpenChange={props.onOpenChange}
    >
      <AppShellLayout {...props} />
    </SidebarProvider>
  )
}

function AppShellLayout({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  header,
  footer,
  variant,
  collapsible = "icon",
  side,
  rail = true,
  moreLabel = "More",
  label = "Main",
  render = <AppShellLink />,
  className,
  children,
}: {
  items: AppShellItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  header?: React.ReactNode
  footer?: React.ReactNode
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
  side?: "left" | "right"
  rail?: boolean
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  moreLabel?: string
  label?: string
  render?: React.ReactElement
  className?: string
  children?: React.ReactNode
}) {
  const { isMobile } = useSidebar()
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? items[0]?.value
  )
  const value = valueProp ?? uncontrolledValue
  const groups = React.useMemo(() => groupItems(items), [items])

  const select = (next: string) => {
    if (next === value) return
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  if (isMobile) {
    return (
      <div
        data-slot="app-shell"
        className="flex min-h-svh w-full flex-col bg-background"
      >
        <main
          data-slot="app-shell-content"
          className={cn(
            "flex flex-1 flex-col pb-[calc(--spacing(16)+env(safe-area-inset-bottom))]",
            className
          )}
        >
          {children}
        </main>
        <AppShellTabBar
          items={items}
          value={value}
          onSelect={select}
          moreLabel={moreLabel}
          label={label}
          render={render}
        />
      </div>
    )
  }

  return (
    <>
      <Sidebar variant={variant} collapsible={collapsible} side={side}>
        {header && <SidebarHeader>{header}</SidebarHeader>}
        <SidebarContent>
          {groups.map((group) => (
            <SidebarGroup key={group.value}>
              {group.value && (
                <SidebarGroupLabel>{group.value}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        isActive={item.value === value}
                        tooltip={item.label}
                        disabled={item.disabled}
                        aria-current={item.value === value ? "page" : undefined}
                        asChild={Boolean(item.href)}
                        onClick={() => select(item.value)}
                      >
                        {withLink(
                          render,
                          item.href,
                          <>
                            {item.icon}
                            <span>{item.label}</span>
                          </>
                        )}
                      </SidebarMenuButton>
                      {item.badge !== undefined && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        {footer && <SidebarFooter>{footer}</SidebarFooter>}
        {rail && collapsible !== "none" && <SidebarRail />}
      </Sidebar>
      <SidebarInset className={className}>{children}</SidebarInset>
    </>
  )
}

function withLink(
  render: React.ReactElement,
  href: string | undefined,
  children: React.ReactNode
) {
  if (!href) return children
  const link = render as React.ReactElement<{ href?: string }>
  return React.cloneElement(link, { href, ...link.props }, children)
}

function AppShellTabBar({
  items,
  value,
  onSelect,
  moreLabel,
  label,
  render,
}: {
  items: AppShellItem[]
  value: string | undefined
  onSelect: (value: string) => void
  moreLabel: string
  label: string
  render: React.ReactElement
}) {
  return (
    <TabBar aria-label={label}>
      <TabBarList>
        {items.map((item) => (
          <TabBarItem
            key={item.value}
            isActive={item.value === value}
            disabled={item.disabled}
            asChild={Boolean(item.href)}
            onClick={() => onSelect(item.value)}
          >
            {withLink(render, item.href, item.label)}
          </TabBarItem>
        ))}
      </TabBarList>
      <TabBarContent />
      <TabBarTrigger>{moreLabel}</TabBarTrigger>
    </TabBar>
  )
}

function AppShellTrigger(props: React.ComponentProps<typeof SidebarTrigger>) {
  const { isMobile } = useSidebar()

  if (isMobile) return null

  return <SidebarTrigger {...props} />
}

export { AppShell, type AppShellItem, AppShellTrigger }
