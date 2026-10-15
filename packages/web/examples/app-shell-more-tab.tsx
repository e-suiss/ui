import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"

const manyItems: AppShellItem[] = [
  {
    value: "home",
    label: "Home",
    icon: (
      <IconPlaceholder
        lucide="HouseIcon"
        tabler="IconHome"
        hugeicons="Home01Icon"
        phosphor="HouseIcon"
        remixicon="RiHomeLine"
      />
    ),
    group: "Platform",
  },
  {
    value: "inbox",
    label: "Inbox",
    icon: (
      <IconPlaceholder
        lucide="InboxIcon"
        tabler="IconInbox"
        hugeicons="InboxIcon"
        phosphor="TrayIcon"
        remixicon="RiInboxLine"
      />
    ),
    badge: 12,
    group: "Platform",
  },
  {
    value: "calendar",
    label: "Calendar",
    icon: (
      <IconPlaceholder
        lucide="CalendarIcon"
        tabler="IconCalendar"
        hugeicons="Calendar01Icon"
        phosphor="CalendarBlankIcon"
        remixicon="RiCalendarLine"
      />
    ),
    group: "Platform",
  },
  {
    value: "reports",
    label: "Reports",
    icon: (
      <IconPlaceholder
        lucide="ChartColumnIcon"
        tabler="IconChartBar"
        hugeicons="ChartColumnIcon"
        phosphor="ChartBarIcon"
        remixicon="RiBarChartLine"
      />
    ),
    group: "Platform",
  },
  {
    value: "projects",
    label: "Projects",
    icon: (
      <IconPlaceholder
        lucide="FolderIcon"
        tabler="IconFolder"
        hugeicons="Folder01Icon"
        phosphor="FolderIcon"
        remixicon="RiFolderLine"
      />
    ),
    group: "Platform",
  },
  {
    value: "team",
    label: "Team",
    icon: (
      <IconPlaceholder
        lucide="UsersIcon"
        tabler="IconUsers"
        hugeicons="UserGroupIcon"
        phosphor="UsersIcon"
        remixicon="RiGroupLine"
      />
    ),
    group: "Workspace",
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
    group: "Workspace",
  },
  {
    value: "support",
    label: "Support",
    icon: (
      <IconPlaceholder
        lucide="LifeBuoyIcon"
        tabler="IconLifebuoy"
        hugeicons="LifebuoyIcon"
        phosphor="LifebuoyIcon"
        remixicon="RiLifebuoyLine"
      />
    ),
    group: "Workspace",
    disabled: true,
  },
]

function Page({ title }: { title: string }) {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
        <AppShellTrigger className="-ms-1" />
        <h1 className="text-base font-semibold">{title}</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {["Revenue", "Active users", "Open issues"].map((label) => (
            <div
              key={label}
              className="flex h-20 flex-col justify-end rounded-2xl bg-muted p-3 md:aspect-video md:h-auto md:p-4"
            >
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
        <div className="min-h-64 flex-1 rounded-2xl bg-muted" />
      </div>
    </>
  )
}

function ShellExample(props: React.ComponentProps<typeof AppShell>) {
  const [value, setValue] = React.useState(props.defaultValue ?? "home")
  const title = props.items.find((item) => item.value === value)?.label ?? ""

  return (
    <AppShell {...props} value={value} onValueChange={setValue}>
      <Page title={title} />
    </AppShell>
  )
}

export default function AppShellMoreTab() {
  return (
    <div className="min-h-svh">
      <ShellExample items={manyItems} defaultValue="team" />
    </div>
  )
}
