"use client"

import * as React from "react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  {
    value: "users",
    label: "Users",
    icon: (
      <IconPlaceholder
        lucide="UsersIcon"
        tabler="IconUsers"
        hugeicons="UserGroupIcon"
        phosphor="UsersIcon"
        remixicon="RiGroupLine"
      />
    ),
  },
  {
    value: "roles",
    label: "Roles",
    icon: (
      <IconPlaceholder
        lucide="ShieldIcon"
        tabler="IconShield"
        hugeicons="Shield01Icon"
        phosphor="ShieldIcon"
        remixicon="RiShieldLine"
      />
    ),
  },
  {
    value: "log",
    label: "Activity",
    icon: (
      <IconPlaceholder
        lucide="ChartColumnIcon"
        tabler="IconChartBar"
        hugeicons="ChartColumnIcon"
        phosphor="ChartBarIcon"
        remixicon="RiBarChartLine"
      />
    ),
  },
  {
    value: "settings",
    label: "Settings",
    icon: (
      <IconPlaceholder
        lucide="SettingsIcon"
        tabler="IconSettings"
        hugeicons="Settings01Icon"
        phosphor="GearIcon"
        remixicon="RiSettingsLine"
      />
    ),
  },
]

const roles = ["Admin", "Editor", "Support", "Viewer"]

const groups = [
  {
    name: "Content",
    permissions: [
      { name: "View", grants: [1, 1, 1, 1] },
      { name: "Create", grants: [1, 1, 0, 0] },
      { name: "Publish", grants: [1, 1, 0, 0] },
      { name: "Delete", grants: [1, 0, 0, 0] },
    ],
  },
  {
    name: "Orders",
    permissions: [
      { name: "View", grants: [1, 1, 1, 1] },
      { name: "Issue refunds", grants: [1, 0, 1, 0] },
      { name: "Change prices", grants: [1, 0, 0, 0] },
    ],
  },
  {
    name: "Management",
    permissions: [
      { name: "Invite users", grants: [1, 0, 0, 0] },
      { name: "Billing", grants: [1, 0, 0, 0] },
    ],
  },
]

const gridClass =
  "grid grid-cols-[minmax(7rem,1.5fr)_repeat(4,minmax(3.5rem,1fr))] items-center"

export function RolesMatrix() {
  const [matrix, setMatrix] = React.useState(() =>
    groups.map((group) =>
      group.permissions.map((permission) => [...permission.grants])
    )
  )
  const [dirty, setDirty] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  const toggle = (group: number, permission: number, role: number) => {
    setMatrix((current) =>
      current.map((rows, g) =>
        rows.map((grants, p) =>
          g === group && p === permission
            ? grants.map((value, r) => (r === role ? Number(!value) : value))
            : grants
        )
      )
    )
    setDirty(true)
    setSaved(false)
  }

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
        <div className="flex flex-col gap-5 px-5 py-5.5 md:px-7">
          <div className="flex items-start gap-3">
            <SidebarTrigger className="-ms-2 mt-0.5" />
            <div className="flex flex-1 flex-col">
              <h1 className="text-3xl font-semibold tracking-tight">
                Permissions
              </h1>
              <p className="text-sm text-muted-foreground">
                Admin permissions can't be changed.
              </p>
            </div>
            <Button
              size="sm"
              disabled={!dirty}
              onClick={() => {
                setDirty(false)
                setSaved(true)
              }}
            >
              {saved ? "Saved" : "Save"}
            </Button>
          </div>
          <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
            <div className="flex min-w-120 flex-col gap-4.5">
              <div className={`${gridClass} -mb-3 px-4`} aria-hidden>
                <span />
                {roles.map((role) => (
                  <span
                    key={role}
                    className="text-center text-xs font-semibold text-muted-foreground"
                  >
                    {role}
                  </span>
                ))}
              </div>
              {groups.map((group, g) => (
                <section key={group.name} className="flex flex-col gap-2">
                  <h2 className="px-1 text-sm font-semibold">{group.name}</h2>
                  <ul className="overflow-hidden rounded-2xl bg-muted">
                    {group.permissions.map((permission, p) => (
                      <li
                        key={permission.name}
                        className={`${gridClass} min-h-10 px-4 not-first:border-t not-first:border-border`}
                      >
                        <span className="text-sm">{permission.name}</span>
                        {roles.map((role, r) => (
                          <span key={role} className="flex justify-center">
                            <Checkbox
                              checked={!!matrix[g]?.[p]?.[r]}
                              disabled={r === 0}
                              onCheckedChange={() => toggle(g, p, r)}
                              aria-label={`${group.name} ${permission.name} for ${role}`}
                              className="size-4.5 data-disabled:data-checked:border-transparent data-disabled:data-checked:text-white data-disabled:opacity-50"
                            />
                          </span>
                        ))}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
