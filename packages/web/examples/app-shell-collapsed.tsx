import {
  CalendarBlankIcon,
  GearIcon,
  HouseIcon,
  TrayIcon,
} from "@phosphor-icons/react"
import * as React from "react"
import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items: AppShellItem[] = [
  {
    value: "home",
    label: "Home",
    icon: <HouseIcon />,
  },
  {
    value: "inbox",
    label: "Inbox",
    icon: <TrayIcon />,
    badge: 12,
  },
  {
    value: "calendar",
    label: "Calendar",
    icon: <CalendarBlankIcon />,
  },
  {
    value: "settings",
    label: "Settings",
    icon: <GearIcon />,
  },
]

const brand = (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-on-accent">
          A
        </div>
        <span className="truncate font-medium">Acme Inc.</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
)

const account = (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-tertiary text-xs font-medium">
          JL
        </div>
        <div className="grid flex-1 text-start leading-tight">
          <span className="truncate text-sm font-medium">Jordan Lee</span>
          <span className="truncate text-xs text-label-secondary">
            jordan@acme.com
          </span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
)

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

export default function AppShellCollapsed() {
  return (
    <div className="min-h-svh">
      <ShellExample
        items={items}
        defaultOpen={false}
        header={brand}
        footer={account}
      />
    </div>
  )
}
