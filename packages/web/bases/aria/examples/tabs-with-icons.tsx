import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsWithIcons() {
  return (
    <Tabs
      defaultSelectedKey="account"
      orientation="horizontal"
      className="w-full max-w-96"
    >
      <TabsList variant="default">
        <TabsTrigger id="account">
          <IconPlaceholder
            lucide="UserIcon"
            tabler="IconUser"
            hugeicons="UserIcon"
            phosphor="UserIcon"
            remixicon="RiUserLine"
            data-icon="inline-start"
          />
          Account
        </TabsTrigger>
        <TabsTrigger id="notifications">
          <IconPlaceholder
            lucide="BellIcon"
            tabler="IconBell"
            hugeicons="Notification03Icon"
            phosphor="BellIcon"
            remixicon="RiNotificationLine"
            data-icon="inline-start"
          />
          Notifications
        </TabsTrigger>
        <TabsTrigger id="settings">
          <IconPlaceholder
            lucide="SettingsIcon"
            tabler="IconSettings"
            hugeicons="Settings01Icon"
            phosphor="GearIcon"
            remixicon="RiSettingsLine"
            data-icon="inline-start"
          />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent id="account" className="text-muted-foreground">
        Update your name, email address, and profile photo.
      </TabsContent>
      <TabsContent id="notifications" className="text-muted-foreground">
        Choose which updates you receive by email and push.
      </TabsContent>
      <TabsContent id="settings" className="text-muted-foreground">
        Manage language, time zone, and privacy preferences.
      </TabsContent>
    </Tabs>
  )
}
