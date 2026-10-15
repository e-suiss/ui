import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"

const items: AppShellItem[] = [
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

export default function AppShellDemo() {
  return (
    <div className="min-h-svh">
      <ShellExample items={items} />
    </div>
  )
}
