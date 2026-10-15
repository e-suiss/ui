import {
  CalendarBlankIcon,
  ChartBarIcon,
  FolderIcon,
  GearIcon,
  HouseIcon,
  LifebuoyIcon,
  TrayIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import * as React from "react"
import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"

const manyItems: AppShellItem[] = [
  {
    value: "home",
    label: "Home",
    icon: <HouseIcon />,
    group: "Platform",
  },
  {
    value: "inbox",
    label: "Inbox",
    icon: <TrayIcon />,
    badge: 12,
    group: "Platform",
  },
  {
    value: "calendar",
    label: "Calendar",
    icon: <CalendarBlankIcon />,
    group: "Platform",
  },
  {
    value: "reports",
    label: "Reports",
    icon: <ChartBarIcon />,
    group: "Platform",
  },
  {
    value: "projects",
    label: "Projects",
    icon: <FolderIcon />,
    group: "Platform",
  },
  {
    value: "team",
    label: "Team",
    icon: <UsersIcon />,
    group: "Workspace",
  },
  {
    value: "settings",
    label: "Settings",
    icon: <GearIcon />,
    group: "Workspace",
  },
  {
    value: "support",
    label: "Support",
    icon: <LifebuoyIcon />,
    group: "Workspace",
    disabled: true,
  },
]

function Page({ title }: { title: string }) {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-separator px-4">
        <AppShellTrigger className="-ms-1" />
        <h1 className="text-base font-semibold">{title}</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {["Revenue", "Active users", "Open issues"].map((label) => (
            <div
              key={label}
              className="flex h-20 flex-col justify-end rounded-2xl bg-surface-secondary p-3 md:aspect-video md:h-auto md:p-4"
            >
              <span className="text-sm text-label-secondary">{label}</span>
            </div>
          ))}
        </div>
        <div className="min-h-64 flex-1 rounded-2xl bg-surface-secondary" />
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
