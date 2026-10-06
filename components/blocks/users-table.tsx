"use client"

import {
  ChartBarIcon,
  GearIcon,
  MagnifyingGlassIcon,
  PlusIcon,
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const nav: AppShellItem[] = [
  { value: "users", label: "Users", icon: <UsersIcon /> },
  { value: "roles", label: "Roles", icon: <ShieldIcon /> },
  { value: "log", label: "Activity", icon: <ChartBarIcon /> },
  { value: "settings", label: "Settings", icon: <GearIcon /> },
]

const roles = ["Admin", "Editor", "Support", "Viewer"]

type Status = "Active" | "Suspended" | "Invited"

type User = {
  name: string
  email: string
  role: string
  status: Status
  seen: string
  hue: number
}

const initialUsers: User[] = [
  {
    name: "Jamie Rivera",
    email: "jamie@company.com",
    role: "Admin",
    status: "Active",
    seen: "2 min ago",
    hue: 250,
  },
  {
    name: "Morgan Lee",
    email: "morgan@company.com",
    role: "Editor",
    status: "Active",
    seen: "1 hr ago",
    hue: 30,
  },
  {
    name: "Riley Chen",
    email: "riley@company.com",
    role: "Support",
    status: "Active",
    seen: "Yesterday",
    hue: 150,
  },
  {
    name: "Taylor Kim",
    email: "taylor@company.com",
    role: "Viewer",
    status: "Suspended",
    seen: "3 days ago",
    hue: 200,
  },
  {
    name: "Avery Brooks",
    email: "avery@company.com",
    role: "Editor",
    status: "Invited",
    seen: "—",
    hue: 330,
  },
  {
    name: "Jordan Park",
    email: "jordan@company.com",
    role: "Support",
    status: "Active",
    seen: "5 hr ago",
    hue: 100,
  },
]

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")

export function UsersTable() {
  const [users, setUsers] = React.useState(initialUsers)
  const [query, setQuery] = React.useState("")
  const [role, setRole] = React.useState("All")
  const [selected, setSelected] = React.useState<string[]>([])
  const list = users.filter(
    (user) =>
      (role === "All" || user.role === role) &&
      (!query ||
        `${user.name} ${user.email}`
          .toLowerCase()
          .includes(query.toLowerCase()))
  )

  const toggle = (email: string) =>
    setSelected((current) =>
      current.includes(email)
        ? current.filter((item) => item !== email)
        : [...current, email]
    )

  const bulk = (patch: Partial<User>) => {
    setUsers((current) =>
      current.map((user) =>
        selected.includes(user.email) ? { ...user, ...patch } : user
      )
    )
    setSelected([])
  }

  return (
    <AppShell
      items={nav}
      defaultValue="users"
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
            <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
            <p className="text-sm text-label-secondary">
              {users.length} people
            </p>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <InputGroup className="h-8 flex-1 sm:w-48">
              <InputGroupAddon>
                <MagnifyingGlassIcon />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                aria-label="Search users"
                className="text-sm"
              />
            </InputGroup>
            <Button size="sm" className="gap-1">
              <PlusIcon weight="bold" className="size-3.25" />
              Invite
            </Button>
          </div>
        </div>
        <ToggleGroup
          spacing={0}
          value={[role]}
          onValueChange={(value: string[]) => {
            if (!value[0]) return
            setRole(value[0])
            setSelected([])
          }}
          aria-label="Role"
          className="max-w-full overflow-x-auto"
        >
          {["All", ...roles].map((item) => (
            <ToggleGroupItem
              key={item}
              value={item}
              size="sm"
              className="px-4 md:px-8"
            >
              {item}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="overflow-hidden rounded-xl bg-surface-secondary">
          <Table>
            <TableHeader>
              <TableRow className="border-separator hover:bg-transparent">
                <TableHead className="ps-4 text-xs font-normal text-label-secondary">
                  Name
                </TableHead>
                <TableHead className="hidden text-xs font-normal text-label-secondary sm:table-cell">
                  Role
                </TableHead>
                <TableHead className="text-xs font-normal text-label-secondary">
                  Status
                </TableHead>
                <TableHead className="hidden pe-4 text-end text-xs font-normal text-label-secondary md:table-cell">
                  Last sign-in
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((user) => {
                const isSelected = selected.includes(user.email)
                return (
                  <TableRow
                    key={user.email}
                    data-selected={isSelected ? "true" : undefined}
                    onClick={() => toggle(user.email)}
                    className="group/row cursor-default border-0 select-none not-data-selected:even:bg-surface/60 not-data-selected:hover:bg-label/5 has-focus-visible:focus-ring data-selected:bg-accent data-selected:text-on-accent"
                  >
                    <TableCell className="ps-4">
                      <span className="flex items-center gap-2.5">
                        <Checkbox
                          checked={isSelected}
                          onClick={(event) => event.stopPropagation()}
                          onCheckedChange={() => toggle(user.email)}
                          aria-label={`Select ${user.name}`}
                          className="absolute sr-only"
                        />
                        <Avatar className="size-7">
                          <AvatarFallback
                            style={{
                              background: `linear-gradient(160deg, oklch(0.78 0.1 ${user.hue}), oklch(0.6 0.14 ${user.hue + 30}))`,
                            }}
                            className="text-3xs text-white"
                          >
                            {initials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex min-w-0 flex-col">
                          <span className="text-sm font-semibold">
                            {user.name}
                          </span>
                          <span className="truncate text-xs text-label-secondary group-data-selected/row:text-on-accent">
                            {user.email}
                          </span>
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-sm sm:table-cell">
                      {user.role}
                    </TableCell>
                    <TableCell
                      data-status={isSelected ? undefined : user.status}
                      className="text-sm data-[status=Invited]:text-label-secondary data-[status=Suspended]:text-danger group-data-selected/row:text-on-accent"
                    >
                      {user.status}
                    </TableCell>
                    <TableCell className="hidden pe-4 text-end text-sm text-label-secondary group-data-selected/row:text-on-accent md:table-cell">
                      {user.seen}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {list.length === 0 && (
            <p className="p-6 text-center text-sm text-label-secondary">
              No matching users.
            </p>
          )}
          <div className="flex min-h-12 flex-wrap items-center gap-2 border-t border-separator py-2 ps-4 pe-3">
            <span
              className="flex-1 text-xs text-label-secondary"
              aria-live="polite"
            >
              {selected.length
                ? `${selected.length} selected`
                : "Click rows to select"}
            </span>
            {selected.length > 0 && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => bulk({ role: "Editor" })}
                >
                  Make Editor
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => bulk({ status: "Active" })}
                >
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => bulk({ status: "Suspended" })}
                >
                  Suspend
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
