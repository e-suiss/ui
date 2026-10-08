"use client"

import {
  ChartBarIcon,
  CheckIcon,
  GearIcon,
  GlobeIcon,
  KeyIcon,
  LockSimpleIcon,
  ShieldIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const nav: AppShellItem[] = [
  { value: "users", label: "Users", icon: <UsersIcon /> },
  { value: "roles", label: "Roles", icon: <ShieldIcon /> },
  { value: "log", label: "Activity", icon: <ChartBarIcon /> },
  { value: "settings", label: "Settings", icon: <GearIcon /> },
]

type Severity = "High" | "Medium" | "Low"

const severity: Record<
  Severity,
  { tint: string; text: string; weight: number }
> = {
  High: {
    tint: "bg-red",
    text: "text-[color-mix(in_oklab,var(--red),var(--label)_25%)] dark:text-red",
    weight: 18,
  },
  Medium: {
    tint: "bg-orange",
    text: "text-[color-mix(in_oklab,var(--orange),var(--label)_45%)] dark:text-orange",
    weight: 8,
  },
  Low: {
    tint: "bg-yellow",
    text: "text-[color-mix(in_oklab,var(--yellow),var(--label)_55%)] dark:text-yellow",
    weight: 3,
  },
}

const initialAlerts: {
  severity: Severity
  title: string
  detail: string
  icon: React.ElementType
}[] = [
  {
    severity: "High",
    title: "Sign-in from an unusual location",
    detail: "morgan@company.com · Lagos, NG · 3:12 AM",
    icon: GlobeIcon,
  },
  {
    severity: "Medium",
    title: "5 failed sign-in attempts",
    detail: "85.104.x.x · last 10 minutes",
    icon: LockSimpleIcon,
  },
  {
    severity: "Medium",
    title: "API key expires in 7 days",
    detail: "Payments integration",
    icon: KeyIcon,
  },
  {
    severity: "Low",
    title: "Two-factor authentication is off",
    detail: "2 users",
    icon: ShieldIcon,
  },
]

function scoreTone(score: number) {
  if (score > 85) return "text-green"
  if (score > 65) return "text-orange"
  return "text-red"
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
            <h1 className="text-3xl font-semibold tracking-tight">Security</h1>
            <p className="text-sm text-label-secondary" aria-live="polite">
              {open.length ? `${open.length} open alerts` : "No open alerts"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-surface-secondary px-4 py-3.5">
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
              className="stroke-control"
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
            <span className="text-sm text-label-secondary">Security score</span>
            <span className="text-3xl font-bold tabular-nums">{score}</span>
          </div>
          <dl className="flex gap-4.5">
            {(Object.keys(severity) as Severity[]).map((level) => (
              <div key={level} className="flex flex-col items-center">
                <dt className="text-xs text-label-secondary">{level}</dt>
                <dd
                  className={`text-xl font-semibold tabular-nums ${count(level) ? severity[level].text : "text-label-tertiary"}`}
                >
                  {count(level)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <ToggleGroup
          spacing={0}
          value={[filter]}
          onValueChange={(value: string[]) => {
            if (value[0]) setFilter(value[0])
          }}
          aria-label="Filter"
        >
          {["Open", "Resolved", "All"].map((item) => (
            <ToggleGroupItem key={item} value={item} size="sm" className="px-4">
              {item}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div key={filter}>
          {list.length > 0 ? (
            <ul className="overflow-hidden rounded-2xl bg-surface-secondary">
              {list.map((alert) => (
                <li
                  key={alert.title}
                  className="relative flex min-h-13 items-center gap-3 px-4 py-2.5 not-first:before:absolute not-first:before:inset-e-0 not-first:before:inset-s-14.5 not-first:before:top-0 not-first:before:h-px not-first:before:bg-separator"
                >
                  <span
                    className={`flex size-7.5 shrink-0 items-center justify-center rounded-[7px] text-white transition-colors duration-300 ${alert.resolved ? "bg-[color-mix(in_oklab,var(--green),var(--label)_20%)] dark:bg-green" : severity[alert.severity].tint}`}
                  >
                    {alert.resolved ? (
                      <CheckIcon weight="bold" className="size-4" />
                    ) : (
                      <alert.icon weight="bold" className="size-4" />
                    )}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold">
                      {alert.title}
                    </span>
                    <span className="truncate text-xs text-label-secondary">
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
            <p className="p-7.5 text-center text-sm text-label-secondary">
              {filter === "Open"
                ? "No open alerts. All good."
                : "Nothing here yet."}
            </p>
          )}
        </div>
      </div>
    </AppShell>
  )
}
