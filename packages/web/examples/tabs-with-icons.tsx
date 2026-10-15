import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = [
  {
    value: "account",
    label: "Account",
    icon: (
      <IconPlaceholder
        lucide="UserIcon"
        tabler="IconUser"
        hugeicons="UserIcon"
        phosphor="UserIcon"
        remixicon="RiUserLine"
        data-icon="inline-start"
      />
    ),
    content: "Update your name, email address, and profile photo.",
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: (
      <IconPlaceholder
        lucide="BellIcon"
        tabler="IconBell"
        hugeicons="Notification03Icon"
        phosphor="BellIcon"
        remixicon="RiNotificationLine"
        data-icon="inline-start"
      />
    ),
    content: "Choose which updates you receive by email and push.",
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
        data-icon="inline-start"
      />
    ),
    content: "Manage language, time zone, and privacy preferences.",
  },
] as const

export default function TabsWithIcons() {
  return (
    <div className="w-full max-w-96">
      <Tabs defaultValue="account" orientation="horizontal">
        <TabsList variant="default">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="text-muted-foreground"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
