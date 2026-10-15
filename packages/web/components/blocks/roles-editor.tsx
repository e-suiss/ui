"use client"

import {
  ChartBarIcon,
  GearIcon,
  PlusIcon,
  ShieldIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import {
  SplitView,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
} from "@/components/patterns/split-view"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
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
import { Switch } from "@/components/ui/switch"

type NavItem = {
  value: string
  label: string
  icon: React.ReactNode
  badge?: React.ReactNode
  group?: string
}

function NavSidebar({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  header,
  footer,
}: {
  items: NavItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  header?: React.ReactNode
  footer?: React.ReactNode
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? items[0]?.value
  )
  const value = valueProp ?? uncontrolledValue
  const groups = [...new Set(items.map((item) => item.group ?? ""))]

  return (
    <Sidebar collapsible="icon">
      {header && (
        <SidebarHeader className="group-data-[collapsible=icon]:hidden">
          {header}
        </SidebarHeader>
      )}
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group}>
            {group && <SidebarGroupLabel>{group}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {items
                  .filter((item) => (item.group ?? "") === group)
                  .map((item) => (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        isActive={item.value === value}
                        tooltip={item.label}
                        aria-current={item.value === value ? "page" : undefined}
                        onClick={() => {
                          if (valueProp === undefined) {
                            setUncontrolledValue(item.value)
                          }
                          onValueChange?.(item.value)
                          if (isMobile) setOpenMobile(false)
                        }}
                      >
                        {item.icon}
                        <span>{item.label}</span>
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
      {footer && (
        <SidebarFooter className="group-data-[collapsible=icon]:hidden">
          {footer}
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}

const nav: NavItem[] = [
  { value: "users", label: "Users", icon: <UsersIcon /> },
  { value: "roles", label: "Roles", icon: <ShieldIcon /> },
  { value: "log", label: "Activity", icon: <ChartBarIcon /> },
  { value: "settings", label: "Settings", icon: <GearIcon /> },
]

const groups = [
  {
    name: "Content",
    permissions: [
      { name: "Create drafts", description: "Can start new content drafts." },
      { name: "Publish", description: "Can make content public." },
      { name: "Delete", description: "Can permanently delete content." },
    ],
  },
  {
    name: "Customers",
    permissions: [
      {
        name: "Customer data",
        description: "Sees names, emails and order history.",
      },
      { name: "Export", description: "Downloads the customer list as CSV." },
    ],
  },
]

const roles = ["Editor", "Support", "Viewer"] as const

type Role = (typeof roles)[number]

const members: Record<Role, number> = { Editor: 2, Support: 2, Viewer: 1 }

const defaults: Record<Role, boolean[]> = {
  Editor: [true, true, false, true, false],
  Support: [false, false, false, true, false],
  Viewer: [false, false, false, false, false],
}

const clone = (value: Record<Role, boolean[]>) => structuredClone(value)

export function RolesEditor() {
  const [role, setRole] = React.useState<Role>("Editor")
  const [state, setState] = React.useState(() => clone(defaults))
  const [base, setBase] = React.useState(() => clone(defaults))
  const dirty = JSON.stringify(state) !== JSON.stringify(base)
  let index = 0

  return (
    <SidebarProvider>
      <NavSidebar
        items={nav}
        defaultValue="roles"
        header={
          <p className="flex items-center gap-2 px-2 pt-1 text-sm font-semibold">
            <span className="font-bold">suiss</span> Admin
          </p>
        }
      />
      <SidebarInset>
        <div className="flex items-center px-5 pt-4 md:hidden">
          <SidebarTrigger />
        </div>
        <SplitView
          defaultColumn="list"
          className="flex-1 rounded-none border-0 max-md:p-4 md:min-h-150"
        >
          <SplitViewList
            title="Roles"
            className="gap-0.5 md:px-4 md:pt-5 [&>h2]:md:not-sr-only [&>h2]:md:px-1 [&>h2]:md:pb-2 [&>h2]:md:text-sm [&>h2]:md:font-semibold [&>h2]:md:text-muted-foreground"
          >
            {roles.map((name) => (
              <SplitViewItem
                key={name}
                isActive={name === role}
                onClick={() => setRole(name)}
                className="group/role py-1.5"
              >
                <span className="text-sm">{name}</span>
                <span className="text-xs text-muted-foreground">
                  {state[name].filter(Boolean).length} permissions
                </span>
              </SplitViewItem>
            ))}
            <Button
              size="sm"
              variant="secondary"
              className="mt-2.5 gap-1 self-start"
            >
              <PlusIcon weight="bold" className="size-3.25" />
              New Role
            </Button>
          </SplitViewList>
          <SplitViewDetail title={role} className="md:p-6 [&>h2]:sr-only">
            <div
              key={role}
              className="flex flex-col gap-4.5 transition-[opacity,translate] duration-800 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-1.5 starting:opacity-0 motion-reduce:transition-none"
            >
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex flex-1 flex-col">
                  <p className="text-3xl font-semibold tracking-tight">
                    {role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {members[role]}{" "}
                    {members[role] === 1 ? "user has" : "users have"} this role
                  </p>
                </div>
                {dirty && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setState(clone(base))}
                    >
                      Revert
                    </Button>
                    <Button size="sm" onClick={() => setBase(clone(state))}>
                      Save
                    </Button>
                  </div>
                )}
              </div>
              {groups.map((group) => (
                <section key={group.name} className="flex flex-col gap-2">
                  <h2 className="px-1 text-sm font-semibold">{group.name}</h2>
                  <ItemGroup variant="inset">
                    {group.permissions.map((permission, position) => {
                      const slot = index++
                      const id = `roles-editor-${slot}`
                      return (
                        <React.Fragment key={permission.name}>
                          {position > 0 && <ItemSeparator />}
                          <Item size="sm" role="listitem">
                            <ItemContent className="gap-0">
                              <ItemTitle className="font-normal">
                                <label htmlFor={id}>{permission.name}</label>
                              </ItemTitle>
                              <ItemDescription className="text-xs">
                                {permission.description}
                              </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                              <Switch
                                id={id}
                                checked={state[role][slot] ?? false}
                                onCheckedChange={(value) =>
                                  setState((current) => ({
                                    ...current,
                                    [role]: current[role].map((item, i) =>
                                      i === slot ? value : item
                                    ),
                                  }))
                                }
                              />
                            </ItemActions>
                          </Item>
                        </React.Fragment>
                      )
                    })}
                  </ItemGroup>
                </section>
              ))}
            </div>
          </SplitViewDetail>
        </SplitView>
      </SidebarInset>
    </SidebarProvider>
  )
}
