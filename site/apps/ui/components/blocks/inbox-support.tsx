"use client"

import { ChatCircleIcon, CheckIcon, TrayIcon } from "@phosphor-icons/react"
import * as React from "react"

import {
  SplitView,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
  SplitViewSidebar,
} from "@/components/patterns/split-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Status = "Open" | "Pending" | "Solved"

type Priority = "High" | "Medium" | "Low"

type Ticket = {
  id: string
  title: string
  device: string
  status: Status
  priority: Priority
  requester: string
  hue: number
}

const initialTickets: Ticket[] = [
  {
    id: "#4821",
    title: "Screen flickers",
    device: "Phone Pro",
    status: "Open",
    priority: "High",
    requester: "Jamie Rivera",
    hue: 30,
  },
  {
    id: "#4820",
    title: "Battery drains fast",
    device: "Book Air",
    status: "Pending",
    priority: "Medium",
    requester: "Morgan Lee",
    hue: 200,
  },
  {
    id: "#4819",
    title: "Pods won't pair",
    device: "Pods Studio",
    status: "Open",
    priority: "Low",
    requester: "Avery Brooks",
    hue: 330,
  },
  {
    id: "#4818",
    title: "Cloud backup error",
    device: "Phone Air",
    status: "Solved",
    priority: "Medium",
    requester: "Taylor Kim",
    hue: 120,
  },
]

const views: { value: Status | "All"; icon: React.ElementType }[] = [
  { value: "Open", icon: ChatCircleIcon },
  { value: "Pending", icon: ChatCircleIcon },
  { value: "Solved", icon: CheckIcon },
  { value: "All", icon: TrayIcon },
]

const priorityClass: Record<Priority, string> = {
  High: "bg-danger/14 text-[color-mix(in_oklab,var(--danger),var(--label)_30%)] dark:text-danger",
  Medium:
    "bg-orange/14 text-[color-mix(in_oklab,var(--orange),var(--label)_50%)] dark:text-orange",
  Low: "bg-control text-label-secondary",
}

function Requester({
  ticket,
  className,
}: {
  ticket: Ticket
  className?: string
}) {
  return (
    <Avatar className={className}>
      <AvatarFallback
        style={{
          background: `linear-gradient(160deg, oklch(0.78 0.1 ${ticket.hue}), oklch(0.6 0.14 ${ticket.hue + 30}))`,
        }}
        className="text-white"
      >
        {ticket.requester
          .split(" ")
          .map((part) => part[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  )
}

export function InboxSupport() {
  const [tickets, setTickets] = React.useState(initialTickets)
  const [view, setView] = React.useState<Status | "All">("Open")
  const [selected, setSelected] = React.useState("#4821")
  const [reply, setReply] = React.useState("")
  const list = tickets.filter(
    (ticket) => view === "All" || ticket.status === view
  )
  const current = tickets.find((ticket) => ticket.id === selected)

  const setStatus = (status: Status) =>
    setTickets((items) =>
      items.map((ticket) =>
        ticket.id === selected ? { ...ticket, status } : ticket
      )
    )

  return (
    <SplitView
      defaultColumn="list"
      className="h-155 rounded-none border-0 max-md:h-auto max-md:min-h-155 max-md:p-4"
    >
      <SplitViewSidebar
        title="Support"
        className="min-h-full md:bg-surface-secondary [&>h2]:md:px-3 [&>h2]:md:pt-3 [&>h2]:md:text-lg [&>h2]:md:text-label"
      >
        {views.map((item) => (
          <SplitViewItem
            key={item.value}
            isActive={view === item.value}
            onClick={() => setView(item.value)}
          >
            <span className="flex items-center gap-2.5">
              <item.icon className="size-4.5 text-accent" />
              <span className="flex-1">{item.value}</span>
              <span className="text-xs text-label-secondary tabular-nums">
                {item.value === "All"
                  ? tickets.length
                  : tickets.filter((ticket) => ticket.status === item.value)
                      .length}
              </span>
            </span>
          </SplitViewItem>
        ))}
      </SplitViewSidebar>
      <SplitViewList title={view} className="gap-1 md:p-2">
        {list.map((ticket) => (
          <SplitViewItem
            key={ticket.id}
            isActive={ticket.id === selected}
            onClick={() => setSelected(ticket.id)}
            className="gap-1 py-3"
          >
            <span className="flex items-center gap-2">
              <span className="flex-1 text-xs text-label-secondary">
                {ticket.id} · {ticket.device}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-2xs font-semibold ${priorityClass[ticket.priority]}`}
              >
                {ticket.priority}
              </span>
            </span>
            <span className="text-base font-semibold">{ticket.title}</span>
            <span className="mt-1 flex items-center gap-1.5">
              <Requester
                ticket={ticket}
                className="size-4.5 *:text-[0.4375rem]"
              />
              <span className="text-xs text-label-secondary">
                {ticket.requester}
              </span>
            </span>
          </SplitViewItem>
        ))}
        {list.length === 0 && (
          <p className="p-6 text-center text-sm text-label-secondary">
            No tickets
          </p>
        )}
      </SplitViewList>
      <SplitViewDetail
        title={current?.title}
        className="md:p-5.5 [&>h2]:sr-only"
      >
        {current && (
          <div
            key={current.id}
            className="flex flex-col gap-4 transition-[opacity,translate] duration-800 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
          >
            <span className="text-sm text-label-secondary">
              {current.id} · {current.device}
            </span>
            <ToggleGroup
              spacing={0}
              value={[current.status]}
              onValueChange={(value: string[]) => {
                if (value[0]) setStatus(value[0] as Status)
              }}
              aria-label="Status"
            >
              {(["Open", "Pending", "Solved"] as const).map((status) => (
                <ToggleGroupItem key={status} value={status} size="sm">
                  {status}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <h3 className="text-3xl font-semibold tracking-tight">
              {current.title}
            </h3>
            <div className="flex items-center gap-2.5">
              <Requester ticket={current} className="size-8.5" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {current.requester}
                </span>
                <span className="text-xs text-label-secondary">
                  Today 8:12 AM
                </span>
              </div>
            </div>
            <p className="max-w-130 rounded-2xl rounded-ss-sm bg-surface-secondary px-3.5 py-3 text-base leading-relaxed">
              Hi, this started right after the latest update. I tried restarting
              but it keeps happening. Can you help?
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                setReply("")
                setStatus("Pending")
              }}
              className="flex flex-col gap-2.5"
            >
              <Textarea
                rows={3}
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder="Write a reply…"
                aria-label="Reply"
              />
              <div className="flex flex-wrap gap-2.5">
                <Button type="submit" size="sm" disabled={!reply}>
                  Send and set pending
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setStatus("Solved")}
                >
                  Mark as solved
                </Button>
              </div>
            </form>
          </div>
        )}
      </SplitViewDetail>
    </SplitView>
  )
}
