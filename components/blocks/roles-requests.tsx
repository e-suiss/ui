"use client"

import {
  ChartBarIcon,
  CheckIcon,
  GearIcon,
  ShieldIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
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

type Decision = "approved" | "denied" | null

const initialRequests = [
  {
    name: "Morgan Lee",
    permission: "Change prices",
    reason: "I need to update the campaign prices.",
    time: "10 min ago",
    hue: 30,
  },
  {
    name: "Riley Chen",
    permission: "Export customers",
    reason: "I need the customer list for the monthly report.",
    time: "1 hr ago",
    hue: 150,
  },
  {
    name: "Jordan Park",
    permission: "Issue refunds",
    reason: "So I can refund support tickets myself.",
    time: "Yesterday",
    hue: 100,
  },
  {
    name: "Taylor Kim",
    permission: "Publish",
    reason: "I'd like to publish blog posts.",
    time: "2 days ago",
    hue: 200,
  },
]

export function RolesRequests() {
  const [requests, setRequests] = React.useState(() =>
    initialRequests.map((request) => ({
      ...request,
      decision: null as Decision,
    }))
  )
  const [duration, setDuration] = React.useState("Permanent")
  const open = requests.filter((request) => !request.decision).length

  const decide = (name: string, decision: Decision) => {
    setRequests((current) =>
      current.map((request) =>
        request.name === name ? { ...request, decision } : request
      )
    )
    window.setTimeout(
      () =>
        setRequests((current) =>
          current.filter((request) => request.name !== name)
        ),
      900
    )
  }

  return (
    <AppShell
      items={nav}
      defaultValue="roles"
      header={
        <p className="flex items-center gap-2 px-2 pt-1 text-sm font-semibold">
          <span className="font-bold">suiss</span> Admin
        </p>
      }
    >
      <div className="flex flex-col gap-5 px-5 py-5.5 md:px-7">
        <div className="flex flex-wrap items-start gap-3">
          <AppShellTrigger className="-ms-2 mt-0.5" />
          <div className="flex flex-1 flex-col">
            <h1 className="text-3xl font-semibold tracking-tight">
              Access requests
            </h1>
            <p className="text-sm text-label-secondary" aria-live="polite">
              {open} pending {open === 1 ? "request" : "requests"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              id="roles-requests-duration"
              className="text-sm text-label-secondary"
            >
              Approval length
            </span>
            <Select
              value={duration}
              onValueChange={(value) => setDuration(value as string)}
            >
              <SelectTrigger
                size="sm"
                aria-labelledby="roles-requests-duration"
                className="h-7.5"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {["24 hours", "7 days", "Permanent"].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {requests.length > 0 ? (
          <ul className="overflow-hidden rounded-2xl bg-surface-secondary">
            {requests.map((request) => (
              <li
                key={request.name}
                data-closing={request.decision ? "" : undefined}
                className="grid grid-rows-[1fr] transition-[grid-template-rows,opacity] delay-500 duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] not-data-closing:delay-0 data-closing:grid-rows-[0fr] data-closing:opacity-0 motion-reduce:transition-none"
              >
                <div className="flex min-h-0 items-start gap-3 overflow-hidden ps-4">
                  <Avatar className="mt-3 size-8.5">
                    <AvatarFallback
                      style={{
                        background: `linear-gradient(160deg, oklch(0.78 0.1 ${request.hue}), oklch(0.6 0.14 ${request.hue + 30}))`,
                      }}
                      className="text-white"
                    >
                      {request.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col gap-2.5 border-separator py-3 pe-4 sm:flex-row sm:items-start sm:gap-3 [li+li_&]:border-t">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.75">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {request.name}
                        </span>
                        <span className="text-xs text-label-secondary">
                          {request.time}
                        </span>
                      </span>
                      <span className="text-sm">
                        Requests {request.permission}
                      </span>
                      <span className="text-sm text-label-secondary">
                        {request.reason}
                      </span>
                    </div>
                    {request.decision ? (
                      <span
                        role="status"
                        data-decision={request.decision}
                        className="pt-0.5 text-sm font-semibold text-[color-mix(in_oklab,var(--green),var(--label)_45%)] data-[decision=denied]:text-danger dark:text-green dark:data-[decision=denied]:text-danger"
                      >
                        {request.decision === "approved"
                          ? "Approved"
                          : "Denied"}
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => decide(request.name, "denied")}
                        >
                          Deny
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => decide(request.name, "approved")}
                        >
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty className="gap-3 p-10 transition-[opacity,translate] duration-800 starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none">
            <EmptyHeader>
              <EmptyMedia className="mb-0 text-[color-mix(in_oklab,var(--green),var(--label)_35%)] dark:text-green">
                <CheckIcon weight="bold" className="size-10" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No pending requests.</EmptyTitle>
            </EmptyHeader>
            <EmptyContent>
              <button
                type="button"
                onClick={() =>
                  setRequests(
                    initialRequests.map((request) => ({
                      ...request,
                      decision: null,
                    }))
                  )
                }
                className="rounded-xs text-sm text-link outline-none hover:underline focus-visible:focus-ring"
              >
                Reset the sample ›
              </button>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </AppShell>
  )
}
