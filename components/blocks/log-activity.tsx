"use client"

import {
  CaretRightIcon,
  ChartBarIcon,
  GearIcon,
  HandbagIcon,
  NotePencilIcon,
  ShieldIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"
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

const nav: AppShellItem[] = [
  { value: "users", label: "Users", icon: <UsersIcon /> },
  { value: "roles", label: "Roles", icon: <ShieldIcon /> },
  { value: "log", label: "Activity", icon: <ChartBarIcon /> },
  { value: "settings", label: "Settings", icon: <GearIcon /> },
]

const kinds = {
  Price: { icon: TagIcon, tint: "bg-orange" },
  Content: { icon: NotePencilIcon, tint: "bg-blue" },
  Security: { icon: ShieldIcon, tint: "bg-red" },
  Order: { icon: HandbagIcon, tint: "bg-green" },
  User: { icon: UserIcon, tint: "bg-purple" },
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
        <kind.icon weight="bold" className="size-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm">
          <strong className="font-semibold">{event.actor}</strong>{" "}
          {event.action}
        </span>
        <span className="truncate text-xs text-label-secondary">
          {event.target}
        </span>
      </span>
      <span className="text-sm text-label-secondary tabular-nums">
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
      <CollapsibleTrigger className="group/event flex min-h-11 w-full items-center gap-3 py-2 ps-4 pe-4 text-start outline-none hover:bg-item-hover focus-visible:focus-ring">
        {body}
        <CaretRightIcon
          weight="bold"
          className="size-3 text-label-tertiary transition-[rotate] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] rtl:rotate-180 group-data-panel-open/event:rotate-90"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
        <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 ps-14 pe-4 pb-3 text-sm">
          <div className="flex items-center gap-2">
            <dt className="text-xs text-label-secondary">Before</dt>
            <dd className="text-label-secondary line-through">
              {event.diff[0]}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="text-xs text-label-secondary">After</dt>
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
    <AppShell
      items={nav}
      defaultValue="log"
      header={
        <p className="flex items-center gap-2 px-2 pt-1 text-sm font-semibold">
          <span className="font-bold">suiss</span> Admin
        </p>
      }
    >
      <div className="flex flex-col gap-5 px-5 py-5.5 md:px-7">
        <div className="flex flex-wrap items-start gap-3">
          <AppShellTrigger className="-ms-2 mt-0.5" />
          <h1 className="flex-1 text-3xl font-semibold tracking-tight">
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
              <ul className="overflow-hidden rounded-2xl bg-surface-secondary">
                {list
                  .filter((event) => event.day === day)
                  .map((event) => (
                    <li
                      key={`${event.time}-${event.actor}`}
                      className="relative not-first:before:absolute not-first:before:inset-e-0 not-first:before:start-14 not-first:before:top-0 not-first:before:h-px not-first:before:bg-separator"
                    >
                      <EventRow event={event} />
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
