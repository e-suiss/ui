import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsDisabledTab() {
  return (
    <Tabs
      defaultValue="account"
      orientation="horizontal"
      className="w-full max-w-96"
    >
      <TabsList variant="default">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="text-muted-foreground">
        Update your name, email address, and profile photo.
      </TabsContent>
      <TabsContent value="notifications" className="text-muted-foreground">
        Choose which updates you receive by email and push.
      </TabsContent>
    </Tabs>
  )
}
