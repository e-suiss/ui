import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsDisabledTab() {
  return (
    <Tabs
      defaultSelectedKey="account"
      orientation="horizontal"
      className="w-full max-w-96"
    >
      <TabsList variant="default">
        <TabsTrigger id="account">Account</TabsTrigger>
        <TabsTrigger id="notifications">Notifications</TabsTrigger>
        <TabsTrigger id="billing" isDisabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent id="account" className="text-muted-foreground">
        Update your name, email address, and profile photo.
      </TabsContent>
      <TabsContent id="notifications" className="text-muted-foreground">
        Choose which updates you receive by email and push.
      </TabsContent>
    </Tabs>
  )
}
