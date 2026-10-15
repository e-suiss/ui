"use client"

import * as React from "react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

const kinds = {
  Price: {
    icon: (
      <IconPlaceholder
        lucide="TagIcon"
        tabler="IconTag"
        hugeicons="Tag01Icon"
        phosphor="TagIcon"
        remixicon="RiPriceTag3Line"
        className="size-4"
      />
    ),
    tint: "bg-orange-500",
  },
  Content: {
    icon: (
      <IconPlaceholder
        lucide="SquarePenIcon"
        tabler="IconEdit"
        hugeicons="PencilEdit02Icon"
        phosphor="NotePencilIcon"
        remixicon="RiEditBoxLine"
        className="size-4"
      />
    ),
    tint: "bg-blue-500",
  },
  Security: {
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
    tint: "bg-red-500",
  },
  Order: {
    icon: (
      <IconPlaceholder
        lucide="HandbagIcon"
        tabler="IconShoppingBag"
        hugeicons="ShoppingBag01Icon"
        phosphor="HandbagIcon"
        remixicon="RiHandbagLine"
        className="size-4"
      />
    ),
    tint: "bg-green-500",
  },
  User: {
    icon: (
      <IconPlaceholder
        lucide="UserIcon"
        tabler="IconUser"
        hugeicons="UserIcon"
        phosphor="UserIcon"
        remixicon="RiUserLine"
        className="size-4"
      />
    ),
    tint: "bg-purple-500",
  },
}

type Kind = keyof typeof kinds

const events: {
  day: string
  time: string
  actor: string
  action: string
  target: string
  kind: Kind
  diff?: [string, string]
}[] = [
  {
    day: "Today",
    time: "9:41 AM",
    actor: "Jamie Rivera",
    action: "updated",
    target: "Price: Phone Pro",
    kind: "Price",
    diff: ["$1,049", "$1,099"],
  },
  {
    day: "Today",
    time: "9:12 AM",
    actor: "Morgan Lee",
    action: "published",
    target: "Blog: October campaign",
    kind: "Content",
  },
  {
    day: "Today",
    time: "8:55 AM",
    actor: "System",
    action: "blocked",
    target: "5 failed sign-ins · 85.104.x.x",
    kind: "Security",
  },
  {
    day: "Yesterday",
    time: "6:20 PM",
    actor: "Riley Chen",
    action: "refunded",
    target: "Order W1044 · $999",
    kind: "Order",
  },
  {
    day: "Yesterday",
    time: "2:03 PM",
    actor: "Jamie Rivera",
    action: "changed a role",
    target: "Taylor Kim: Editor → Viewer",
    kind: "User",
    diff: ["Editor", "Viewer"],
  },
  {
    day: "Yesterday",
    time: "10:31 AM",
    actor: "Jordan Park",
    action: "created",
    target: "Product: MagCharge Wallet",
    kind: "Content",
  },
]

function EventRow({ event }: { event: (typeof events)[number] }) {
  const kind = kinds[event.kind]
  const body = (
    <>
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-[7px] text-white ${kind.tint}`}
      >
        {kind.icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm">
          <strong className="font-semibold">{event.actor}</strong>{" "}
          {event.action}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {event.target}
        </span>
      </span>
      <span className="text-sm text-muted-foreground tabular-nums">
        {event.time}
      </span>
    </>
  )

  if (!event.diff) {
    return (
      <div className="flex min-h-11 items-center gap-3 py-2 ps-4 pe-9">
        {body}
      </div>
    )
  }

  return (
    <Collapsible>
      <CollapsibleTrigger className="group/event flex min-h-11 w-full items-center gap-3 py-2 ps-4 pe-4 text-start outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 hover:text-accent-foreground">
        {body}
        <IconPlaceholder
          lucide="ChevronRightIcon"
          tabler="IconChevronRight"
          hugeicons="ArrowRight01Icon"
          phosphor="CaretRightIcon"
          remixicon="RiArrowRightSLine"
          className="size-3 text-muted-foreground transition-[rotate] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] rtl:rotate-180 group-data-panel-open/event:rotate-90"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-open:animate-collapsible-down data-closed:animate-collapsible-up motion-reduce:animate-none">
        <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 ps-14 pe-4 pb-3 text-sm">
          <div className="flex items-center gap-2">
            <dt className="text-xs text-muted-foreground">Before</dt>
            <dd className="text-muted-foreground line-through">
              {event.diff[0]}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="text-xs text-muted-foreground">After</dt>
            <dd className="font-semibold">{event.diff[1]}</dd>
          </div>
        </dl>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function LogActivity() {
  const [filter, setFilter] = React.useState("All")
  const list = events.filter(
    (event) => filter === "All" || event.kind === filter
  )
  const days = [...new Set(list.map((event) => event.day))]

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
          <div className="flex flex-wrap items-start gap-3">
            <SidebarTrigger className="-ms-2 mt-0.5" />
            <h1 className="flex-1 text-3xl font-semibold tracking-tight whitespace-nowrap">
              Activity log
            </h1>
            <div className="flex items-center gap-2">
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value as string)}
              >
                <SelectTrigger size="sm" aria-label="Type" className="h-7.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {["All", ...Object.keys(kinds)].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="secondary">
                Export
              </Button>
            </div>
          </div>
          <div
            key={filter}
            className="flex flex-col gap-5 transition-[opacity,translate] duration-700 starting:translate-y-1.5 starting:opacity-0 motion-reduce:transition-none"
          >
            {days.map((day) => (
              <section key={day} className="flex flex-col gap-2">
                <h2 className="px-1 text-sm font-semibold">{day}</h2>
                <ul className="overflow-hidden rounded-2xl bg-muted">
                  {list
                    .filter((event) => event.day === day)
                    .map((event) => (
                      <li
                        key={`${event.time}-${event.actor}`}
                        className="relative not-first:before:absolute not-first:before:inset-e-0 not-first:before:start-14 not-first:before:top-0 not-first:before:h-px not-first:before:bg-border"
                      >
                        <EventRow event={event} />
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
