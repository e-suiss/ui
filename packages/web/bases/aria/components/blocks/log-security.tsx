"use client"

import * as React from "react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

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

type Severity = "High" | "Medium" | "Low"

const severity: Record<
  Severity,
  { tint: string; text: string; weight: number }
> = {
  High: {
    tint: "bg-red-500",
    text: "text-[color-mix(in_oklab,var(--color-red-500),var(--foreground)_25%)] dark:text-red-500",
    weight: 18,
  },
  Medium: {
    tint: "bg-orange-500",
    text: "text-[color-mix(in_oklab,var(--color-orange-500),var(--foreground)_45%)] dark:text-orange-500",
    weight: 8,
  },
  Low: {
    tint: "bg-yellow-500",
    text: "text-[color-mix(in_oklab,var(--color-yellow-500),var(--foreground)_55%)] dark:text-yellow-500",
    weight: 3,
  },
}

const initialAlerts: {
  severity: Severity
  title: string
  detail: string
  icon: React.ReactNode
}[] = [
  {
    severity: "High",
    title: "Sign-in from an unusual location",
    detail: "morgan@company.com · Lagos, NG · 3:12 AM",
    icon: (
      <IconPlaceholder
        lucide="GlobeIcon"
        tabler="IconWorld"
        hugeicons="Globe02Icon"
        phosphor="GlobeIcon"
        remixicon="RiGlobalLine"
        className="size-4"
      />
    ),
  },
  {
    severity: "Medium",
    title: "5 failed sign-in attempts",
    detail: "85.104.x.x · last 10 minutes",
    icon: (
      <IconPlaceholder
        lucide="LockIcon"
        tabler="IconLock"
        hugeicons="SquareLock02Icon"
        phosphor="LockSimpleIcon"
        remixicon="RiLockLine"
        className="size-4"
      />
    ),
  },
  {
    severity: "Medium",
    title: "API key expires in 7 days",
    detail: "Payments integration",
    icon: (
      <IconPlaceholder
        lucide="KeyIcon"
        tabler="IconKey"
        hugeicons="Key01Icon"
        phosphor="KeyIcon"
        remixicon="RiKey2Line"
        className="size-4"
      />
    ),
  },
  {
    severity: "Low",
    title: "Two-factor authentication is off",
    detail: "2 users",
    icon: (
      <IconPlaceholder
        lucide="ShieldIcon"
        tabler="IconShield"
        hugeicons="Shield01Icon"
        phosphor="ShieldIcon"
        remixicon="RiShieldLine"
        className="size-4"
      />
    ),
  },
]

function scoreTone(score: number) {
  if (score > 85) return "text-green-500"
  if (score > 65) return "text-orange-500"
  return "text-red-500"
}

export function LogSecurity() {
  const [alerts, setAlerts] = React.useState(() =>
    initialAlerts.map((alert) => ({ ...alert, resolved: false }))
  )
  const [filter, setFilter] = React.useState("Open")
  const open = alerts.filter((alert) => !alert.resolved)
  const count = (level: Severity) =>
    open.filter((alert) => alert.severity === level).length
  const score =
    100 -
    (Object.keys(severity) as Severity[]).reduce(
      (sum, level) => sum + count(level) * severity[level].weight,
      0
    )
  const tone = scoreTone(score)
  const list =
    filter === "All"
      ? alerts
      : alerts.filter((alert) => alert.resolved === (filter === "Resolved"))

  const setResolved = (title: string, resolved: boolean) =>
    setAlerts((current) =>
      current.map((alert) =>
        alert.title === title ? { ...alert, resolved } : alert
      )
    )

  return (
    <SidebarProvider>
      <NavSidebar
        items={nav}
        defaultValue="log"
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
                Security
              </h1>
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {open.length ? `${open.length} open alerts` : "No open alerts"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 rounded-xl bg-muted px-4 py-3.5">
            <svg
              aria-hidden
              viewBox="0 0 54 54"
              className={`size-13.5 -rotate-90 transition-colors duration-400 ${tone}`}
            >
              <circle
                cx="27"
                cy="27"
                r="22"
                fill="none"
                strokeWidth="6"
                className="stroke-secondary"
              />
              <circle
                cx="27"
                cy="27"
                r="22"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${score} 100`}
                className="stroke-current transition-[stroke-dasharray] duration-600 ease-[cubic-bezier(0.32,0.72,0,1)]"
              />
            </svg>
            <div className="flex flex-1 flex-col">
              <span className="text-sm text-muted-foreground">
                Security score
              </span>
              <span className="text-3xl font-bold tabular-nums">{score}</span>
            </div>
            <dl className="flex gap-4.5">
              {(Object.keys(severity) as Severity[]).map((level) => (
                <div key={level} className="flex flex-col items-center">
                  <dt className="text-xs text-muted-foreground">{level}</dt>
                  <dd
                    className={`text-xl font-semibold tabular-nums ${count(level) ? severity[level].text : "text-muted-foreground"}`}
                  >
                    {count(level)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <ToggleGroup
            spacing={0}
            selectedKeys={[filter]}
            onSelectionChange={(keys) => {
              const value = [...keys].map(String)

              if (value[0]) setFilter(value[0])
            }}
            aria-label="Filter"
          >
            {["Open", "Resolved", "All"].map((item) => (
              <ToggleGroupItem key={item} id={item} size="sm" className="px-4">
                {item}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div key={filter}>
            {list.length > 0 ? (
              <ul className="overflow-hidden rounded-2xl bg-muted">
                {list.map((alert) => (
                  <li
                    key={alert.title}
                    className="relative flex min-h-13 items-center gap-3 px-4 py-2.5 not-first:before:absolute not-first:before:inset-e-0 not-first:before:inset-s-14.5 not-first:before:top-0 not-first:before:h-px not-first:before:bg-border"
                  >
                    <span
                      className={`flex size-7.5 shrink-0 items-center justify-center rounded-[7px] text-white transition-colors duration-300 ${alert.resolved ? "bg-[color-mix(in_oklab,var(--color-green-500),var(--foreground)_20%)] dark:bg-green-500" : severity[alert.severity].tint}`}
                    >
                      {alert.resolved ? (
                        <IconPlaceholder
                          lucide="CheckIcon"
                          tabler="IconCheck"
                          hugeicons="Tick02Icon"
                          phosphor="CheckIcon"
                          remixicon="RiCheckLine"
                          className="size-4"
                        />
                      ) : (
                        alert.icon
                      )}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-semibold">
                        {alert.title}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {alert.resolved
                          ? "Resolved"
                          : `${alert.severity} severity`}{" "}
                        · {alert.detail}
                      </span>
                    </span>
                    {alert.resolved ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setResolved(alert.title, false)}
                      >
                        Reopen
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setResolved(alert.title, true)}
                      >
                        Resolve
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-7.5 text-center text-sm text-muted-foreground">
                {filter === "Open"
                  ? "No open alerts. All good."
                  : "Nothing here yet."}
              </p>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
