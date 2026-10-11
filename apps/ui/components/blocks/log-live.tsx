"use client"

import {
  ChartBarIcon,
  ChatCircleIcon,
  CloudIcon,
  GearIcon,
  HandbagIcon,
  PauseIcon,
  PlayIcon,
  ShieldIcon,
  TagIcon,
  UsersIcon,
  WarningIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const nav: AppShellItem[] = [
  { value: "users", label: "Users", icon: <UsersIcon /> },
  { value: "roles", label: "Roles", icon: <ShieldIcon /> },
  { value: "log", label: "Activity", icon: <ChartBarIcon /> },
  { value: "settings", label: "Settings", icon: <GearIcon /> },
]

const feed = [
  {
    actor: "Jamie Rivera",
    action: "signed in",
    detail: "Book Pro · San Francisco",
    hue: 250,
  },
  {
    actor: "System",
    action: "finished a backup",
    detail: "12.4 GB · 3 min",
    icon: CloudIcon,
  },
  {
    actor: "Morgan Lee",
    action: "updated a product",
    detail: "Phone Air · 240 in stock",
    hue: 30,
    icon: TagIcon,
  },
  {
    actor: "Riley Chen",
    action: "answered a ticket",
    detail: "#4821 Screen flickers",
    hue: 150,
    icon: ChatCircleIcon,
  },
  {
    actor: "System",
    action: "raised a warning",
    detail: "API latency 820 ms",
    icon: WarningIcon,
    warning: true,
  },
  {
    actor: "Jordan Park",
    action: "approved an order",
    detail: "W1052 · $399",
    hue: 100,
    icon: HandbagIcon,
  },
]

type Entry = { id: number; time: string; event: (typeof feed)[number] }

export function LogLive() {
  const [entries, setEntries] = React.useState<Entry[]>([])
  const [running, setRunning] = React.useState(true)
  const [count, setCount] = React.useState(0)
  const next = React.useRef(0)

  React.useEffect(() => {
    if (!running) return
    const push = () => {
      const id = next.current++
      const event = feed[id % feed.length]
      if (!event) return
      const time = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
      setCount((current) => current + 1)
      setEntries((current) => [{ id, time, event }, ...current].slice(0, 7))
    }
    if (next.current === 0) push()
    const timer = window.setInterval(push, 2200)
    return () => window.clearInterval(timer)
  }, [running])

  const stats = [
    {
      label: "This session",
      value: `${count} ${count === 1 ? "event" : "events"}`,
    },
    { label: "Active users", value: "14" },
    { label: "Avg. response", value: "182 ms" },
  ]

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
        <div className="flex items-start gap-3">
          <AppShellTrigger className="-ms-2 mt-0.5" />
          <div className="flex flex-1 flex-col">
            <h1 className="text-3xl font-semibold tracking-tight">
              Live activity
            </h1>
            <p className="text-sm text-label-secondary">
              {running ? "Events appear as they happen" : "Paused"}
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setRunning(!running)}
            className="gap-1.5"
          >
            {running ? (
              <PauseIcon weight="fill" className="size-3" />
            ) : (
              <PlayIcon weight="fill" className="size-3" />
            )}
            {running ? "Pause" : "Resume"}
          </Button>
        </div>
        <dl className="grid grid-cols-3 overflow-hidden rounded-xl bg-surface-secondary">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col px-4 py-3 not-first:border-s not-first:border-separator"
            >
              <dt className="text-xs text-label-secondary">{stat.label}</dt>
              <dd className="text-xl font-semibold tabular-nums md:text-2xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="-mb-2.5 flex items-center gap-2 px-1">
          <h2 className="flex-1 text-sm font-semibold">Recent events</h2>
          {running && (
            <span className="flex items-center gap-1.5 text-xs text-label-secondary">
              <span className="size-1.75 animate-pulse rounded-full bg-green" />
              Live
            </span>
          )}
        </div>
        <ul
          aria-live="polite"
          aria-relevant="additions"
          className="overflow-hidden rounded-2xl bg-surface-secondary"
        >
          {entries.map(({ id, time, event }) => (
            <li
              key={id}
              className="relative flex min-h-11 items-center gap-3 px-4 py-2 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] not-first:before:absolute not-first:before:inset-e-0 not-first:before:inset-s-14 not-first:before:top-0 not-first:before:h-px not-first:before:bg-separator starting:-translate-y-2.5 starting:opacity-0 motion-reduce:transition-none"
            >
              {event.hue ? (
                <Avatar className="size-7">
                  <AvatarFallback
                    style={{
                      background: `linear-gradient(160deg, oklch(0.78 0.1 ${event.hue}), oklch(0.6 0.14 ${event.hue + 30}))`,
                    }}
                    className="text-3xs text-white"
                  >
                    {event.actor
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <span
                  data-warning={event.warning ? "" : undefined}
                  className="flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-gray text-white data-warning:bg-orange"
                >
                  {event.icon && (
                    <event.icon weight="bold" className="size-4" />
                  )}
                </span>
              )}
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm">
                  <strong className="font-semibold">{event.actor}</strong>{" "}
                  {event.action}
                </span>
                <span className="truncate text-xs text-label-secondary">
                  {event.detail}
                </span>
              </span>
              <span className="text-sm text-label-secondary tabular-nums">
                {time}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  )
}
