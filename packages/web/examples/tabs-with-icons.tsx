import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsWithIcons() {
  return (
    <Tabs
      defaultValue="account"
      orientation="horizontal"
      className="w-full max-w-96"
    >
      <TabsList variant="default">
        <TabsTrigger value="account">
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
        <TabsTrigger value="notifications">
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
        <TabsTrigger value="settings">
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
      <TabsContent value="account" className="text-muted-foreground">
        Update your name, email address, and profile photo.
      </TabsContent>
      <TabsContent value="notifications" className="text-muted-foreground">
        Choose which updates you receive by email and push.
      </TabsContent>
      <TabsContent value="settings" className="text-muted-foreground">
        Manage language, time zone, and privacy preferences.
      </TabsContent>
    </Tabs>
  )
}
