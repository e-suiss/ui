"use client"

import {
  ChartBarIcon,
  DesktopIcon,
  DeviceMobileIcon,
  GearIcon,
  GlobeIcon,
  ShieldIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"
import {
  SplitView,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
} from "@/components/patterns/split-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const nav: AppShellItem[] = [
  { value: "users", label: "Users", icon: <UsersIcon /> },
  { value: "roles", label: "Roles", icon: <ShieldIcon /> },
  { value: "log", label: "Activity", icon: <ChartBarIcon /> },
  { value: "settings", label: "Settings", icon: <GearIcon /> },
]

const roles = ["Admin", "Editor", "Support", "Viewer"]

const users = [
  {
    name: "Jamie Rivera",
    email: "jamie@company.com",
    role: "Admin",
    status: "Active",
    hue: 250,
  },
  {
    name: "Morgan Lee",
    email: "morgan@company.com",
    role: "Editor",
    status: "Active",
    hue: 30,
  },
  {
    name: "Riley Chen",
    email: "riley@company.com",
    role: "Support",
    status: "Active",
    hue: 150,
  },
  {
    name: "Taylor Kim",
    email: "taylor@company.com",
    role: "Viewer",
    status: "Suspended",
    hue: 200,
  },
  {
    name: "Avery Brooks",
    email: "avery@company.com",
    role: "Editor",
    status: "Invited",
    hue: 330,
  },
  {
    name: "Jordan Park",
    email: "jordan@company.com",
    role: "Support",
    status: "Active",
    hue: 100,
  },
]

const initialSessions = [
  {
    device: "Book Pro · Browser",
    place: "San Francisco, US",
    time: "Now",
    icon: DesktopIcon,
  },
  {
    device: "Phone Pro · App",
    place: "San Francisco, US",
    time: "2 hr ago",
    icon: DeviceMobileIcon,
  },
  {
    device: "Desktop · Browser",
    place: "Seattle, US",
    time: "3 days ago",
    icon: GlobeIcon,
  },
]

function UserAvatar({
  user,
  className,
}: {
  user: (typeof users)[number]
  className?: string
}) {
  return (
    <Avatar className={className}>
      <AvatarFallback
        style={{
          background: `linear-gradient(160deg, oklch(0.78 0.1 ${user.hue}), oklch(0.6 0.14 ${user.hue + 30}))`,
        }}
        className="text-white"
      >
        {user.name
          .split(" ")
          .map((part) => part[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  )
}

function SecurityToggle({
  label,
  initial,
}: {
  label: string
  initial: boolean
}) {
  const [on, setOn] = React.useState(initial)
  const id = React.useId()

  return (
    <Item size="sm" role="listitem">
      <ItemContent>
        <ItemTitle className="font-normal">
          <label htmlFor={id}>{label}</label>
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <Switch id={id} checked={on} onCheckedChange={setOn} />
      </ItemActions>
    </Item>
  )
}

export function UsersDetail() {
  const [selected, setSelected] = React.useState(0)
  const [tab, setTab] = React.useState("Profile")
  const [overrides, setOverrides] = React.useState<Record<number, string>>({})
  const [sessions, setSessions] = React.useState(initialSessions)
  const user = users[selected]
  if (!user) return null
  const role = overrides[selected] ?? user.role

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
      <div className="flex items-center px-5 pt-4 md:hidden">
        <AppShellTrigger />
      </div>
      <SplitView
        defaultColumn="list"
        className="flex-1 rounded-none border-0 max-md:p-4 md:min-h-150"
      >
        <SplitViewList
          title="Users"
          className="gap-0.5 md:px-4 md:pt-5 [&>h2]:md:not-sr-only [&>h2]:md:px-1 [&>h2]:md:pb-2 [&>h2]:md:text-sm [&>h2]:md:font-semibold [&>h2]:md:text-label-secondary"
        >
          {users.map((item, index) => (
            <SplitViewItem
              key={item.email}
              isActive={index === selected}
              onClick={() => {
                setSelected(index)
                setTab("Profile")
              }}
              className="group/user py-1.5 md:data-active:bg-accent md:data-active:text-on-accent"
            >
              <span className="flex items-center gap-2.5">
                <UserAvatar user={item} className="size-7 *:text-3xs" />
                <span className="flex flex-col">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-xs text-label-secondary md:group-data-active/user:text-on-accent">
                    {overrides[index] ?? item.role}
                  </span>
                </span>
              </span>
            </SplitViewItem>
          ))}
        </SplitViewList>
        <SplitViewDetail title={user.name} className="md:p-6 [&>h2]:sr-only">
          <div
            key={selected}
            className="flex flex-col gap-5 transition-[opacity,translate] duration-800 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
          >
            <div className="flex items-center gap-3.5">
              <UserAvatar user={user} className="size-16 *:text-2xl" />
              <div className="flex flex-col gap-0.5">
                <p className="text-2xl font-bold">{user.name}</p>
                <p className="text-sm text-label-secondary">
                  {user.email} · {role}
                </p>
              </div>
            </div>
            <ToggleGroup
              spacing={0}
              value={[tab]}
              onValueChange={(value: string[]) => {
                if (value[0]) setTab(value[0])
              }}
              aria-label="Section"
            >
              {["Profile", "Sessions", "Security"].map((item) => (
                <ToggleGroupItem
                  key={item}
                  value={item}
                  size="sm"
                  className="px-4"
                >
                  {item}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <div
              key={tab}
              className="flex flex-col gap-3 transition-[opacity,translate] duration-700 starting:translate-y-1.5 starting:opacity-0 motion-reduce:transition-none"
            >
              {tab === "Profile" && (
                <ItemGroup variant="inset">
                  {[
                    ["Full name", user.name],
                    ["Email", user.email],
                    ["Department", "Product"],
                    ["Joined", "March 12, 2024"],
                  ].map(([label, value]) => (
                    <React.Fragment key={label}>
                      <Item size="sm" role="listitem">
                        <ItemContent>
                          <ItemTitle className="font-normal">{label}</ItemTitle>
                        </ItemContent>
                        <ItemActions className="text-label-secondary">
                          {value}
                        </ItemActions>
                      </Item>
                      <ItemSeparator />
                    </React.Fragment>
                  ))}
                  <Item size="sm" role="listitem">
                    <ItemContent>
                      <ItemTitle className="font-normal">Role</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Select
                        value={role}
                        onValueChange={(value) =>
                          setOverrides((current) => ({
                            ...current,
                            [selected]: value as string,
                          }))
                        }
                      >
                        <SelectTrigger
                          size="sm"
                          aria-label="Role"
                          className="h-7.5"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="end">
                          {roles.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </ItemActions>
                  </Item>
                  <ItemSeparator />
                  <Item size="sm" role="listitem">
                    <ItemContent>
                      <ItemTitle className="font-normal">Status</ItemTitle>
                    </ItemContent>
                    <ItemActions className="text-label-secondary">
                      {user.status}
                    </ItemActions>
                  </Item>
                </ItemGroup>
              )}
              {tab === "Sessions" && (
                <>
                  <ItemGroup
                    variant="inset"
                    className="**:data-[slot=item-separator]:ms-15"
                  >
                    {sessions.map((session, index) => (
                      <React.Fragment key={session.device}>
                        {index > 0 && <ItemSeparator />}
                        <Item size="sm" role="listitem">
                          <ItemMedia className="size-7.5 rounded-[7px] bg-gray text-white">
                            <session.icon weight="bold" className="size-4" />
                          </ItemMedia>
                          <ItemContent className="gap-0">
                            <ItemTitle className="font-normal">
                              {session.device}
                            </ItemTitle>
                            <ItemDescription className="text-xs">
                              {session.place} · {session.time}
                            </ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            {index === 0 ? (
                              <span className="text-sm">This device</span>
                            ) : (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() =>
                                  setSessions((current) =>
                                    current.filter(
                                      (item) => item.device !== session.device
                                    )
                                  )
                                }
                              >
                                Sign Out
                              </Button>
                            )}
                          </ItemActions>
                        </Item>
                      </React.Fragment>
                    ))}
                  </ItemGroup>
                  {sessions.length > 1 && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="self-start"
                      onClick={() =>
                        setSessions((current) => current.slice(0, 1))
                      }
                    >
                      Sign Out All Other Sessions
                    </Button>
                  )}
                </>
              )}
              {tab === "Security" && (
                <>
                  <ItemGroup variant="inset" key={selected}>
                    <SecurityToggle label="Two-factor authentication" initial />
                    <ItemSeparator />
                    <SecurityToggle label="Require passkey" initial={false} />
                    <ItemSeparator />
                    <SecurityToggle label="Sign-in alerts" initial />
                  </ItemGroup>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="self-start"
                  >
                    Send Password Reset Link
                  </Button>
                </>
              )}
            </div>
          </div>
        </SplitViewDetail>
      </SplitView>
    </AppShell>
  )
}
