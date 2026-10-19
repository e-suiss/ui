import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsLine() {
  return (
    <Tabs
      defaultSelectedKey="account"
      orientation="horizontal"
      className="w-full max-w-96"
    >
      <TabsList variant="line">
        <TabsTrigger id="account">Account</TabsTrigger>
        <TabsTrigger id="notifications">Notifications</TabsTrigger>
        <TabsTrigger id="settings">Settings</TabsTrigger>
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
